(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === currentSlide);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var input = document.querySelector("[data-filter-input]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-card"));
  var yearSelect = document.querySelector("[data-filter-year]");

  function applyFilter() {
    var keyword = input ? input.value.trim().toLowerCase() : "";
    var year = yearSelect ? yearSelect.value : "";
    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title"),
        card.getAttribute("data-year"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre")
      ].join(" ").toLowerCase();
      var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchYear = !year || card.getAttribute("data-year") === year;
      card.classList.toggle("is-hidden-card", !(matchKeyword && matchYear));
    });
  }

  if (input) {
    input.addEventListener("input", applyFilter);
  }
  if (yearSelect) {
    yearSelect.addEventListener("change", applyFilter);
  }
})();
