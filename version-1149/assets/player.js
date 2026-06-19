(() => {
    const video = document.getElementById("moviePlayer");
    const button = document.getElementById("playButton");
    const shell = document.querySelector(".player-shell");
    const configNode = document.getElementById("streamConfig");

    if (!video || !button || !configNode) {
        return;
    }

    let attached = false;

    const readUrl = () => {
        try {
            return JSON.parse(configNode.textContent).url;
        } catch (error) {
            return "";
        }
    };

    const attachSource = () => {
        if (attached) {
            return Promise.resolve();
        }

        const source = readUrl();

        if (!source) {
            return Promise.resolve();
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            attached = true;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({
                lowLatencyMode: true,
                backBufferLength: 60
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            attached = true;
            return Promise.resolve();
        }

        video.src = source;
        attached = true;
        return Promise.resolve();
    };

    const start = () => {
        attachSource().then(() => {
            const playTask = video.play();

            if (playTask && typeof playTask.then === "function") {
                playTask.then(() => {
                    if (shell) {
                        shell.classList.add("is-playing");
                    }
                }).catch(() => {
                    if (shell) {
                        shell.classList.remove("is-playing");
                    }
                });
            } else if (shell) {
                shell.classList.add("is-playing");
            }
        });
    };

    button.addEventListener("click", start);
    video.addEventListener("click", () => {
        if (video.paused) {
            start();
        }
    });
    video.addEventListener("play", () => {
        if (shell) {
            shell.classList.add("is-playing");
        }
    });
    video.addEventListener("pause", () => {
        if (shell) {
            shell.classList.remove("is-playing");
        }
    });
})();
