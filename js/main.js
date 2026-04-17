document.addEventListener('DOMContentLoaded', function () {

    // ── 1. Hero slideshow ───────────────────────────────────────────
    // Imagens selecionadas por terem boa composição em full-screen:
    // espaços de exposição, instalações e objetos com fundo dramático
    const heroImages = [
        'fotos/Laborat_rio_de_Afetos-020.jpg',  // vista de instalação
        'fotos/IMG_6413.jpg',                    // objeto no chão — fundo natural
        'fotos/Laborat_rio_de_Afetos-001.jpg',   // espaço de exposição
        'fotos/IMG_6440.jpg',                    // objeto — fundo natural
        'fotos/Laborat_rio_de_Afetos-030.jpg',   // instalação
        'fotos/IMG_6449.jpg',                    // objeto — composição dramática
        'fotos/Laborat_rio_de_Afetos-015.jpg',   // espaço expositivo
    ];

    const hero = document.querySelector('.hero');
    if (hero) {
        const slidesEl = document.createElement('div');
        slidesEl.className = 'hero-slides';

        heroImages.forEach((src, i) => {
            const slide = document.createElement('div');
            slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
            slide.style.backgroundImage = `url(${src})`;
            slidesEl.appendChild(slide);
        });

        hero.insertBefore(slidesEl, hero.firstChild);

        // progress bar
        const progressBar = hero.querySelector('.hero-progress-bar');
        function resetProgress() {
            if (!progressBar) return;
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            // force reflow so transition restarts
            progressBar.offsetWidth;
            progressBar.style.transition = 'width 5s linear';
            progressBar.style.width = '100%';
        }
        resetProgress();

        let heroCurrent = 0;
        setInterval(() => {
            const slides = slidesEl.querySelectorAll('.hero-slide');
            slides[heroCurrent].classList.remove('active');
            heroCurrent = (heroCurrent + 1) % slides.length;
            slides[heroCurrent].classList.add('active');
            resetProgress();
        }, 5000);
    }

    // ── 2. Carrossel com focus ──────────────────────────────────────
    const wrap = document.getElementById('carousel-wrap');
    if (!wrap) return;

    const items = Array.from(wrap.querySelectorAll('.c-item'));
    const section = document.getElementById('carousel-section');
    const dots  = section ? Array.from(section.querySelectorAll('.c-dot')) : [];
    const counterEl = document.getElementById('c-current-num');
    const total = items.length;
    let current = 0;
    let timer;

    function update() {
        items.forEach((item, i) => {
            item.classList.remove('c-active', 'c-prev', 'c-next', 'c-far');
            // posição relativa ao item ativo (circular)
            const rel = ((i - current) % total + total) % total;
            if      (rel === 0)         item.classList.add('c-active');
            else if (rel === total - 1) item.classList.add('c-prev');   // sempre à esquerda
            else if (rel === 1)         item.classList.add('c-next');   // sempre à direita
            else                        item.classList.add('c-far');
        });
        dots.forEach((d, i) => d.classList.toggle('c-dot-active', i === current));
        if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0');
    }

    function goTo(idx) {
        current = (idx + total) % total;
        update();
        resetTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 4200);
    }

    wrap.querySelector('.c-prev-btn').addEventListener('click', () => goTo(current - 1));
    wrap.querySelector('.c-next-btn').addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // swipe mobile
    let startX = 0;
    wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    });

    update();
    resetTimer();
});
