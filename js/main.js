document.addEventListener('DOMContentLoaded', function () {

    // ── 1. Letreiro infinito ────────────────────────────────────────
    const nav = document.getElementById('nav');
    if (nav) {
        const words = 'GRAVURA · DESENHO · DESOBJETOS · PINTURENHOS · LABORATÓRIO DE AFETOS · OBJETOS · COISINHA DE NADA · TAILA IDZI · ';
        const marquee = document.createElement('div');
        marquee.className = 'marquee-wrap';
        marquee.innerHTML =
            `<div class="marquee-track"><span>${words.repeat(6)}</span></div>`;
        nav.after(marquee);
    }

    // ── 2 & 3. Carrossel com focus ──────────────────────────────────
    const wrap = document.getElementById('carousel-wrap');
    if (!wrap) return;

    const items  = Array.from(wrap.querySelectorAll('.c-item'));
    const total  = items.length;
    let current  = 0;
    let timer;

    function update() {
        items.forEach((item, i) => {
            item.classList.remove('c-active', 'c-side', 'c-far');
            const dist = Math.min(
                Math.abs(i - current),
                total - Math.abs(i - current)
            );
            if (dist === 0) item.classList.add('c-active');
            else if (dist === 1) item.classList.add('c-side');
            else item.classList.add('c-far');
        });
    }

    function goTo(idx) {
        current = (idx + total) % total;
        update();
        resetTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 3800);
    }

    wrap.querySelector('.c-prev').addEventListener('click', () => goTo(current - 1));
    wrap.querySelector('.c-next').addEventListener('click', () => goTo(current + 1));

    // swipe em mobile
    let startX = 0;
    wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    wrap.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    });

    update();
    resetTimer();
});
