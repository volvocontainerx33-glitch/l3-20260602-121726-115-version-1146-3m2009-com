(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupPlayer(frame) {
    var video = frame.querySelector('video');
    var button = frame.querySelector('[data-play-button]');
    var stream = frame.getAttribute('data-stream');
    var initialized = false;
    var hls = null;

    if (!video || !stream) {
      return;
    }

    function attachStream() {
      if (initialized) {
        return;
      }
      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function startPlayback() {
      attachStream();
      if (button) {
        button.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (!initialized || video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  ready(function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-player]'), setupPlayer);
  });
})();
