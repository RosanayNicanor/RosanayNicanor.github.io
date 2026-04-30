(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     BLOQUE 1 — Animaciones de entrada
  ═══════════════════════════════════════════ */
  (function initPortadaEntrance() {
    const delays = [0.3, 0.6, 1.0]; // monograma, título, botón
    const items = document.querySelectorAll('#bloque-1 .anim-item');

    // Respeta prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      items.forEach(el => el.classList.add('anim-visible'));
      return;
    }

    items.forEach((el, i) => {
      const delay = delays[i] ?? 1.0;
      setTimeout(() => {
        el.classList.add('anim-visible');
      }, delay * 1000);
    });
  })();

  /* ═══════════════════════════════════════════
     BLOQUE 1 — Botón: slide-up y reveal bloque 2
  ═══════════════════════════════════════════ */
  (function initInvitacionBtn() {
    const btn     = document.getElementById('btn-invitacion');
    const bloque1 = document.getElementById('bloque-1');
    const bloque2 = document.getElementById('bloque-2');

    if (!btn || !bloque1 || !bloque2) return;

    btn.addEventListener('click', function () {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Ocultar bloque 1
      bloque1.classList.add('slide-up');

      // Accesibilidad: marcar bloque 2 como visible
      bloque2.removeAttribute('aria-hidden');
      bloque1.setAttribute('aria-hidden', 'true');

      const transitionDuration = reducedMotion ? 0 : 1200; // ms

      setTimeout(() => {
        // Quitar del flujo
        bloque1.style.display = 'none';

        // Habilitar scroll para los bloques siguientes
        document.body.style.overflow = 'auto';

        // Disparar animaciones de entrada del bloque 2
        animateHero(reducedMotion);
      }, transitionDuration);
    });
  })();

  /* ═══════════════════════════════════════════
     BLOQUE 2 — Animaciones de entrada
  ═══════════════════════════════════════════ */
  function animateHero(reducedMotion) {
    const monograma = document.querySelector('.hero__monograma');
    const titulo    = document.querySelector('.hero__titulo');

    if (reducedMotion) {
      if (monograma) monograma.classList.add('hero-visible');
      if (titulo)    titulo.classList.add('hero-visible');
      return;
    }

    // monograma: delay 0.2s
    setTimeout(() => {
      if (monograma) monograma.classList.add('hero-visible');
    }, 200);

    // título: delay 0.5s
    setTimeout(() => {
      if (titulo) titulo.classList.add('hero-visible');
    }, 500);
  }

})();

  /* ═══════════════════════════════════════════
     BLOQUES 3+ — Scroll Reveal (IntersectionObserver)
  ═══════════════════════════════════════════ */
  (function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  })();

  /* ═══════════════════════════════════════════
     BLOQUE 4 — Countdown en tiempo real
  ═══════════════════════════════════════════ */
  (function initCountdown() {
    const target = new Date('2026-07-26T15:00:00').getTime();
    const daysEl  = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl  = document.getElementById('cd-mins');
    const secsEl  = document.getElementById('cd-secs');
    const msgEl   = document.getElementById('countdown-msg');
    const timerEl = document.getElementById('countdown-timer');

    if (!daysEl) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function update() {
      const now  = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        if (timerEl) timerEl.hidden = true;
        if (msgEl)   msgEl.hidden = false;
        return;
      }

      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000)  / 60000);
      const secs  = Math.floor((diff % 60000)    / 1000);

      daysEl.textContent  = pad(days);
      hoursEl.textContent = pad(hours);
      minsEl.textContent  = pad(mins);
      secsEl.textContent  = pad(secs);
    }

    update();
    setInterval(update, 1000);
  })();
