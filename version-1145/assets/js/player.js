(function () {
  var player = document.getElementById('movie-player');
  var startButton = document.querySelector('[data-player-button]');
  var message = document.querySelector('[data-player-message]');
  var hlsInstance = null;
  var initialized = false;

  function setMessage(text) {
    if (message) {
      message.textContent = text;
    }
  }

  function playVideo() {
    if (!player) {
      return;
    }

    var playback = player.play();

    if (playback && typeof playback.catch === 'function') {
      playback.catch(function () {
        setMessage('点击视频区域即可继续播放');
      });
    }
  }

  function attachStream() {
    if (!player || initialized) {
      playVideo();
      return;
    }

    initialized = true;
    var stream = player.getAttribute('data-stream');

    if (!stream) {
      setMessage('播放暂时不可用，请稍后再试');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(player);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        playVideo();
      });
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setMessage('播放暂时不可用，请稍后再试');
        }
      });
    } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
      player.src = stream;
      player.addEventListener('loadedmetadata', playVideo, { once: true });
    } else {
      player.src = stream;
      playVideo();
    }
  }

  if (startButton) {
    startButton.addEventListener('click', function () {
      startButton.classList.add('is-hidden');
      attachStream();
    });
  }

  if (player) {
    player.addEventListener('click', function () {
      if (startButton) {
        startButton.classList.add('is-hidden');
      }
      attachStream();
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
