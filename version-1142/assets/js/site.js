(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    if (!toggle) {
      return;
    }
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        restart();
      });
    });

    show(0);
    restart();
  }

  function setupCardFilter() {
    var input = document.querySelector('[data-card-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    if (!input || !cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (initialQuery && !input.value) {
      input.value = initialQuery;
    }

    function applyFilter() {
      var query = input.value.trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = card.getAttribute('data-text') || '';
        var visible = !query || text.indexOf(query) !== -1;
        card.hidden = !visible;
        if (visible) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    input.addEventListener('input', applyFilter);
    applyFilter();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupCardFilter();
  });
})();
