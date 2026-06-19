import { H as Hls } from './hls.js';

function initPlayer(playerBox) {
  var video = playerBox.querySelector('video');
  var playButton = playerBox.querySelector('[data-play]');
  var status = playerBox.querySelector('[data-player-status]');
  var source = playerBox.getAttribute('data-src');
  var hlsInstance = null;
  var prepared = false;

  if (!video || !playButton || !source) {
    if (status) {
      status.textContent = '未找到可用播放源。';
    }
    return;
  }

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function prepareSource() {
    if (prepared) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      prepared = true;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      prepared = true;
      return;
    }

    setStatus('当前浏览器不支持 HLS 播放，请更换支持 m3u8 的浏览器。');
  }

  function startPlayback() {
    prepareSource();
    playerBox.classList.add('is-playing');
    setStatus('正在加载播放源...');

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise
        .then(function () {
          setStatus('播放源已加载，可使用播放器控件暂停、拖动或全屏。');
        })
        .catch(function () {
          setStatus('播放源已绑定，请再次点击播放器播放。');
        });
    }
  }

  playButton.addEventListener('click', startPlayback);

  video.addEventListener('playing', function () {
    playerBox.classList.add('is-playing');
    setStatus('正在播放。');
  });

  video.addEventListener('pause', function () {
    setStatus('已暂停。');
  });

  video.addEventListener('error', function () {
    setStatus('播放源加载失败，请稍后重试或检查网络。');
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

document.querySelectorAll('[data-player]').forEach(initPlayer);
