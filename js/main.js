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
    const dots      = section ? Array.from(section.querySelectorAll('.c-dot')) : [];
    const counterEl = document.getElementById('c-current-num');
    const captionEl = document.getElementById('c-caption-text');
    const total = items.length;
    let current = 0;
    let timer;

    function update() {
        items.forEach((item, i) => {
            item.classList.remove('c-active', 'c-prev', 'c-next', 'c-far');
            const rel = ((i - current) % total + total) % total;
            if      (rel === 0)         item.classList.add('c-active');
            else if (rel === total - 1) item.classList.add('c-prev');
            else if (rel === 1)         item.classList.add('c-next');
            else                        item.classList.add('c-far');
        });
        dots.forEach((d, i) => d.classList.toggle('c-dot-active', i === current));
        if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0');
        if (captionEl) {
            captionEl.style.opacity = '0';
            setTimeout(() => {
                captionEl.textContent = items[current].dataset.caption || '';
                captionEl.style.opacity = '1';
            }, 180);
        }
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

// ── 3. Flythrough — imagens vindo em direção à tela ─────────────────
document.addEventListener('DOMContentLoaded', function () {
    const section = document.getElementById('flythrough');
    const scene   = document.getElementById('flythrough-scene');
    const caption = document.querySelector('.flythrough-caption');
    if (!section || !scene) return;

    // Cada imagem tem uma posição (x,y em %), um tamanho base (pequeno) e um
    // deslocamento de fase (o) — a fase escalona a chegada, criando um fluxo
    // contínuo em vez de todas surgirem juntas.
    const shots = [
        { src: 'fotos/Laborat_rio_de_Afetos-001.jpg', x: 22, y: 28, w: 160, o: 0.00 },
        { src: 'fotos/IMG_6413.jpg',                   x: 78, y: 22, w: 128, o: 0.09 },
        { src: 'fotos/1.jpg',                          x: 14, y: 64, w: 146, o: 0.18 },
        { src: 'fotos/A.jpg',                          x: 86, y: 62, w: 150, o: 0.27 },
        { src: 'fotos/Laborat_rio_de_Afetos-020.jpg',  x: 50, y: 18, w: 170, o: 0.36 },
        { src: 'fotos/IMG_6440.jpg',                   x: 32, y: 80, w: 124, o: 0.45 },
        { src: 'fotos/P8.jpg',                         x: 68, y: 78, w: 138, o: 0.54 },
        { src: 'fotos/Laborat_rio_de_Afetos-035.jpg',  x: 88, y: 42, w: 142, o: 0.63 },
        { src: 'fotos/2.jpg',                          x: 12, y: 44, w: 128, o: 0.72 },
        { src: 'fotos/B.jpg',                          x: 50, y: 84, w: 120, o: 0.81 },
        { src: 'fotos/IMG_2499.jpg',                   x: 64, y: 36, w: 134, o: 0.14 },
        { src: 'fotos/Laborat_rio_de_Afetos-041.jpg',  x: 38, y: 48, w: 148, o: 0.32 },
        { src: 'fotos/Laborat_rio_de_Afetos-027.jpg',  x: 26, y: 74, w: 130, o: 0.50 },
        { src: 'fotos/IMG_2383.jpg',                   x: 74, y: 58, w: 138, o: 0.68 },
    ];

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wFactor = window.innerWidth < 640 ? 0.62 : 1;

    // A "profundidade" é simulada com escala 2D (leve): a imagem cresce de
    // minúscula (ao fundo) até média (passando pela tela) e deriva para fora
    // do centro conforme se aproxima — dando a sensação de vir em sua direção.
    const MIN_SCALE   = 0.10;
    const MAX_SCALE   = 1.8;
    const AUTO_SPEED  = 0.30;   // ciclos por segundo — movimento autônomo (sem scroll)
    const SCROLL_SPAN = 1.4;    // impulso extra somado ao longo da rolagem da seçã4
    const imgs = shots.map(cfg => {
        const img = document.createElement('img');
        img.className = 'ft-img';
        img.src = cfg.src;
        img.alt = '';
        img.style.left   = cfg.x + '%';
        img.style.top    = cfg.y + '%';
        img.style.width  = Math.round(cfg.w * wFactor) + 'px';
        img.style.height = Math.round(cfg.w * wFactor * 1.25) + 'px';
        scene.appendChild(img);
        return img;
    });

    const frac  = n => n - Math.floor(n);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    function place(img, cfg, t) {
        const scale = MIN_SCALE + t * (MAX_SCALE - MIN_SCALE);
        const drift = t * t * 6;                    // acelera a deriva perto do fim
        const tx = (cfg.x - 50) * drift;            // empurra para fora do centro
        const ty = (cfg.y - 50) * drift;
        let op;
        if      (t < 0.12) op = t / 0.12;           // surge do fundo
        else if (t > 0.80) op = (1 - t) / 0.20;     // dissolve ao passar
        else               op = 1;
        img.style.transform = 'translate(-50%, -50%) translate(' + tx.toFixed(1) + 'px,' +
                              ty.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
        img.style.opacity = op.toFixed(3);
    }

    if (reduce) {
        // Sem animação: mostra as imagens paradas, espalhadas.
        imgs.forEach((img, i) => place(img, shots[i], 0.4));
        return;
    }

    // Progresso de rolagem dentro da seção (0..1) — apenas um impulso extra.
    let scrollP = 0;
    function updateScroll() {
        const total = section.offsetHeight - window.innerHeight;
        scrollP = total > 0 ? clamp(-section.getBoundingClientRect().top / total, 0, 1) : 0;
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    updateScroll();

    // Loop autônomo: as imagens fluem sozinhas; o scroll só adiciona avanço.
    // Um relógio acumulado garante continuidade mesmo ao pausar/retomar.
    let running = false, rafId = 0, clock = 0, lastNow = 0;
    function loop(now) {
        if (!lastNow) lastNow = now;
        clock += (now - lastNow) / 1000;
        lastNow = now;
        const travel = clock * AUTO_SPEED + scrollP * SCROLL_SPAN;
        for (let i = 0; i < imgs.length; i++) {
            place(imgs[i], shots[i], frac(travel + shots[i].o));
        }
        if (caption) {
            caption.style.opacity = (scrollP > 0.62 ? clamp(1 - (scrollP - 0.62) / 0.3, 0.12, 1) : 1).toFixed(3);
        }
        rafId = requestAnimationFrame(loop);
    }
    function start() { if (!running) { running = true; lastNow = 0; rafId = requestAnimationFrame(loop); } }
    function stop()  { if (running)  { running = false; cancelAnimationFrame(rafId); } }

    // Só anima enquanto a seção está na tela (poupa CPU/bateria).
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            entries[0].isIntersecting ? start() : stop();
        }, { threshold: 0 }).observe(section);
    } else {
        start();
    }
});
