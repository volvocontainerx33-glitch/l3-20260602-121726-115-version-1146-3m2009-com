(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMobileNavigation() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (!button || !nav) {
      return;
    }

    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var currentIndex = 0;
    var timer = null;

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === currentIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === currentIndex);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        showSlide(currentIndex + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot'));
        showSlide(index);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    if (slides.length > 1) {
      start();
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFiltering() {
    var form = document.querySelector('[data-filter-form]');
    var list = document.querySelector('[data-filter-list]');

    if (!form || !list) {
      return;
    }

    var input = form.querySelector('[data-filter-input]');
    var typeSelect = form.querySelector('[data-filter-select]');
    var regionSelect = form.querySelector('[data-region-select]');
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));
    var emptyState = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery && input) {
      input.value = initialQuery;
    }

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      var selectedType = normalize(typeSelect ? typeSelect.value : '');
      var selectedRegion = normalize(regionSelect ? regionSelect.value : '');
      var visibleCount = 0;

      cards.forEach(function (card) {
        var searchText = normalize(card.getAttribute('data-search'));
        var typeText = normalize(card.getAttribute('data-type'));
        var regionText = normalize(card.getAttribute('data-region'));
        var matchesQuery = !query || searchText.indexOf(query) !== -1;
        var matchesType = !selectedType || typeText.indexOf(selectedType) !== -1;
        var matchesRegion = !selectedRegion || regionText.indexOf(selectedRegion) !== -1;
        var shouldShow = matchesQuery && matchesType && matchesRegion;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', applyFilter);
    }

    if (regionSelect) {
      regionSelect.addEventListener('change', applyFilter);
    }

    applyFilter();
  }

  function setupPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var startButton = shell.querySelector('[data-player-start]');
      var message = shell.querySelector('[data-player-message]');
      var hlsInstance = null;
      var initialized = false;

      if (!video) {
        return;
      }

      function setMessage(text) {
        if (message) {
          message.textContent = text || '';
        }
      }

      function initializePlayer() {
        if (initialized) {
          return;
        }

        initialized = true;

        var source = video.getAttribute('data-src');

        if (!source) {
          setMessage('当前影片暂未配置播放源');
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);

          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setMessage('');
          });

          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setMessage('视频加载失败，请稍后重试');
            }
          });

          return;
        }

        video.src = source;
        setMessage('浏览器未加载 HLS 组件，已尝试使用原生播放');
      }

      function play() {
        initializePlayer();

        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            setMessage('请再次点击播放器开始播放');
          });
        }
      }

      if (startButton) {
        startButton.addEventListener('click', play);
      }

      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });

      video.addEventListener('pause', function () {
        shell.classList.remove('is-playing');
      });

      video.addEventListener('error', function () {
        setMessage('视频加载失败，请检查播放源或网络环境');
      });

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    setupMobileNavigation();
    setupHeroCarousel();
    setupFiltering();
    setupPlayers();
  });
})();
