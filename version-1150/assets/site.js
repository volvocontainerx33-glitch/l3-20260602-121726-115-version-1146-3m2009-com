(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('is-open');
      });
    }

    initHero();
    initFilters();
    initPlayers();
  });

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  function initFilters() {
    var searchInput = document.querySelector('[data-search-input]');
    var categorySelect = document.querySelector('[data-filter-category]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    if (!cards.length) {
      return;
    }

    function matchYear(cardYear, value) {
      if (!value) {
        return true;
      }
      var year = parseInt(cardYear, 10);
      if (value === '2010') {
        return year >= 2010 && year < 2020;
      }
      if (value === '2000') {
        return year >= 2000 && year < 2010;
      }
      if (value === '1990') {
        return year < 2000;
      }
      return String(year) === value;
    }

    function apply() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var category = categorySelect ? categorySelect.value : '';
      var yearValue = yearSelect ? yearSelect.value : '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-type') || '',
          card.getAttribute('data-category') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-year') || ''
        ].join(' ').toLowerCase();
        var ok = true;

        if (query && text.indexOf(query) === -1) {
          ok = false;
        }
        if (category && card.getAttribute('data-category') !== category) {
          ok = false;
        }
        if (!matchYear(card.getAttribute('data-year'), yearValue)) {
          ok = false;
        }

        card.classList.toggle('is-hidden', !ok);
      });
    }

    [searchInput, categorySelect, yearSelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', apply);
        el.addEventListener('change', apply);
      }
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
      var video = player.querySelector('[data-video]');
      var button = player.querySelector('[data-play-button]');
      var source = video ? video.getAttribute('data-src') : '';
      var loaded = false;

      if (!video || !source) {
        return;
      }

      function loadSource() {
        if (loaded) {
          return;
        }
        loaded = true;

        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          video.src = source;
        }
      }

      function play() {
        loadSource();
        var playPromise = video.play();
        player.classList.add('is-playing');

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            player.classList.remove('is-playing');
          });
        }
      }

      if (button) {
        button.addEventListener('click', play);
      }
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
      });
    });
  }
})();
