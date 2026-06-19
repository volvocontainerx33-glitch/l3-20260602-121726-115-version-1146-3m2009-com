(() => {
    const body = document.body;
    const navToggle = document.querySelector("[data-nav-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    if (navToggle && mobileNav) {
        navToggle.addEventListener("click", () => {
            mobileNav.classList.toggle("is-open");
            body.classList.toggle("nav-open", mobileNav.classList.contains("is-open"));
        });
    }

    const hero = document.querySelector("[data-hero]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        let current = 0;

        const showSlide = (index) => {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        };

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => showSlide(index));
        });

        if (slides.length > 1) {
            window.setInterval(() => showSlide(current + 1), 5200);
        }
    }

    const normalize = (value) => String(value || "").trim().toLowerCase();
    const searchInput = document.querySelector("[data-search]");
    const typeFilter = document.querySelector("[data-type-filter]");
    const yearFilter = document.querySelector("[data-year-filter]");
    const sortSelect = document.querySelector("[data-sort]");
    const cardLists = Array.from(document.querySelectorAll("[data-card-list]"));

    const allCards = () => cardLists.flatMap((list) => Array.from(list.querySelectorAll("[data-card]")));

    const applyFilters = () => {
        const term = normalize(searchInput ? searchInput.value : "");
        const type = normalize(typeFilter ? typeFilter.value : "");
        const year = normalize(yearFilter ? yearFilter.value : "");

        allCards().forEach((card) => {
            const text = normalize(card.textContent);
            const cardType = normalize(card.dataset.type);
            const cardYear = normalize(card.dataset.year);
            const termMatched = !term || text.includes(term);
            const typeMatched = !type || cardType === type;
            const yearMatched = !year || cardYear === year;
            card.classList.toggle("is-hidden", !(termMatched && typeMatched && yearMatched));
        });
    };

    const sortCards = () => {
        if (!sortSelect) {
            return;
        }

        const mode = sortSelect.value;

        cardLists.forEach((list) => {
            const cards = Array.from(list.querySelectorAll("[data-card]"));
            cards.sort((a, b) => {
                const ay = Number(a.dataset.year || 0);
                const by = Number(b.dataset.year || 0);
                const at = normalize(a.dataset.title || a.textContent);
                const bt = normalize(b.dataset.title || b.textContent);

                if (mode === "year-asc") {
                    return ay - by || at.localeCompare(bt, "zh-CN");
                }

                if (mode === "title-asc") {
                    return at.localeCompare(bt, "zh-CN") || by - ay;
                }

                return by - ay || at.localeCompare(bt, "zh-CN");
            });
            cards.forEach((card) => list.appendChild(card));
        });
        applyFilters();
    };

    [searchInput, typeFilter, yearFilter].forEach((control) => {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });

    if (sortSelect) {
        sortSelect.addEventListener("change", sortCards);
        sortCards();
    }
})();
