function qs(selector, root) {
  return (root || document).querySelector(selector);
}

function qsa(selector, root) {
  return Array.from((root || document).querySelectorAll(selector));
}

function initMobileMenu() {
  var toggle = qs('[data-menu-toggle]');
  var nav = qs('[data-main-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
}

function initSearch() {
  var input = qs('[data-search-input]');
  var cards = qsa('[data-card]');
  var count = qs('[data-search-count]');
  var clear = qs('[data-clear-search]');

  if (!input || cards.length === 0) {
    return;
  }

  function applySearch() {
    var keyword = input.value.trim().toLowerCase();
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = card.getAttribute('data-search') || card.textContent.toLowerCase();
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.classList.toggle('hidden-by-search', !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = keyword
        ? '已匹配 ' + visible + ' 条内容。'
        : '输入关键词即可筛选当前页面影片。';
    }
  }

  input.addEventListener('input', applySearch);

  if (clear) {
    clear.addEventListener('click', function () {
      input.value = '';
      applySearch();
      input.focus();
    });
  }
}

function initHero() {
  var hero = qs('[data-hero]');

  if (!hero) {
    return;
  }

  var slides = qsa('[data-hero-slide]', hero);
  var dots = qsa('[data-hero-dot]', hero);
  var prev = qs('[data-hero-prev]', hero);
  var next = qs('[data-hero-next]', hero);
  var activeIndex = 0;
  var timer = null;

  if (slides.length <= 1) {
    return;
  }

  function show(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      show(activeIndex + 1);
    }, 5600);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      show(Number(dot.getAttribute('data-hero-dot')) || 0);
      start();
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      show(activeIndex - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      show(activeIndex + 1);
      start();
    });
  }

  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  start();
}

function initPosterFallback() {
  qsa('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.opacity = '0';
      if (img.parentElement) {
        img.parentElement.classList.add('no-image');
      }
    }, { once: true });
  });
}

initMobileMenu();
initSearch();
initHero();
initPosterFallback();
