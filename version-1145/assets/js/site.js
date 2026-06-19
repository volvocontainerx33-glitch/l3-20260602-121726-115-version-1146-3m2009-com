(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var filterForm = document.querySelector('[data-filter-form]');

  if (filterForm) {
    var keywordInput = filterForm.querySelector('[name="keyword"]');
    var yearSelect = filterForm.querySelector('[name="year"]');
    var typeSelect = filterForm.querySelector('[name="type"]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));

    function applyFilter() {
      var keyword = (keywordInput && keywordInput.value || '').trim().toLowerCase();
      var year = yearSelect && yearSelect.value || '';
      var type = typeSelect && typeSelect.value || '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();

        var yearMatched = !year || card.getAttribute('data-year') === year;
        var typeMatched = !type || card.getAttribute('data-type') === type;
        var keywordMatched = !keyword || text.indexOf(keyword) !== -1;

        card.classList.toggle('hidden-by-filter', !(yearMatched && typeMatched && keywordMatched));
      });
    }

    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });

    [keywordInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  }
})();
