(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function setupFilters(scope) {
        var panelElement = scope.querySelector("[data-filter-panel]");
        var container = scope.querySelector("[data-card-container]");

        if (!panelElement || !container) {
            return;
        }

        var searchInput = panelElement.querySelector("[data-card-search]");
        var yearSelect = panelElement.querySelector("[data-year-filter]");
        var sortSelect = panelElement.querySelector("[data-sort-filter]");
        var cards = Array.prototype.slice.call(container.querySelectorAll("[data-card]"));

        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get("q");

        if (queryValue && searchInput) {
            searchInput.value = queryValue;
        }

        function sortCards() {
            var mode = sortSelect ? sortSelect.value : "default";
            var sorted = cards.slice();

            if (mode === "year-desc") {
                sorted.sort(function (a, b) {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                });
            }

            if (mode === "title-asc") {
                sorted.sort(function (a, b) {
                    return normalize(a.dataset.title).localeCompare(normalize(b.dataset.title), "zh-Hans-CN");
                });
            }

            sorted.forEach(function (card) {
                container.appendChild(card);
            });
        }

        function applyFilters() {
            var keyword = normalize(searchInput ? searchInput.value : "");
            var year = yearSelect ? yearSelect.value : "";

            cards.forEach(function (card) {
                var text = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.tags
                ].join(" "));
                var yearMatched = !year || card.dataset.year === year;
                var textMatched = !keyword || text.indexOf(keyword) !== -1;
                card.classList.toggle("is-hidden", !(yearMatched && textMatched));
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilters);
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", function () {
                sortCards();
                applyFilters();
            });
        }

        sortCards();
        applyFilters();
    }

    setupFilters(document);

    function setupHero() {
        var hero = document.querySelector("[data-hero]");

        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function play() {
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
                play();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                play();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", play);
        show(0);
        play();
    }

    setupHero();

    function setupPlayer() {
        var video = document.querySelector("[data-player-video]");
        var overlay = document.querySelector("[data-player-overlay]");

        if (!video) {
            return;
        }

        var streamUrl = video.getAttribute("data-stream");
        var started = false;
        var hlsInstance = null;

        function attachStream() {
            if (started || !streamUrl) {
                return;
            }

            started = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function startPlayback() {
            attachStream();

            if (overlay) {
                overlay.classList.add("is-hidden");
            }

            var attempt = video.play();

            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }

        video.addEventListener("click", function () {
            if (!started) {
                startPlayback();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    }

    setupPlayer();
})();
