(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var section = panel.closest("section") || document;
            var list = section.querySelector("[data-filter-list]") || document.querySelector("[data-filter-list]");
            var empty = section.querySelector("[data-empty-state]") || document.querySelector("[data-empty-state]");
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
            var search = panel.querySelector("[data-search-input]");
            var region = panel.querySelector("[data-region-filter]");
            var type = panel.querySelector("[data-type-filter]");
            var year = panel.querySelector("[data-year-filter]");

            function apply() {
                var query = normalize(search && search.value);
                var regionValue = normalize(region && region.value);
                var typeValue = normalize(type && type.value);
                var yearValue = normalize(year && year.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.year,
                        card.dataset.type,
                        card.dataset.genre,
                        card.textContent
                    ].join(" "));
                    var match = true;
                    if (query && haystack.indexOf(query) === -1) {
                        match = false;
                    }
                    if (regionValue && normalize(card.dataset.region) !== regionValue) {
                        match = false;
                    }
                    if (typeValue && normalize(card.dataset.type) !== typeValue) {
                        match = false;
                    }
                    if (yearValue && normalize(card.dataset.year) !== yearValue) {
                        match = false;
                    }
                    card.hidden = !match;
                    if (match) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [search, region, type, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector("[data-play-button]");
            if (!video || !button) {
                return;
            }
            var stream = video.getAttribute("data-stream");
            var hlsInstance = null;

            function attach() {
                if (player.dataset.ready === "true") {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }
                player.dataset.ready = "true";
            }

            function play() {
                attach();
                button.hidden = true;
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function () {
                        button.hidden = false;
                    });
                }
            }

            button.addEventListener("click", play);
            video.addEventListener("play", function () {
                button.hidden = true;
            });
            window.addEventListener("pagehide", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupPlayers();
    });
})();
