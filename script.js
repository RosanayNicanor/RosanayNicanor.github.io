/* ═══════════════════════════════════════════════════════
   ROSANA & NICANOR — WEDDING INVITATION SCRIPTS
   GitHub Pages ready · No frameworks · No npm
═══════════════════════════════════════════════════════ */

'use strict';

/* ── GLOBAL CONFIGURATION ──────────────────────────── */
const CONFIG = {
  WEDDING_DATE:    '2026-07-26T15:00:00',
  RSVP_DEADLINE:   '2026-07-10',
  WHATSAPP_NUMBER: '51987654321',
  WHATSAPP_MSG:    '¡Hola! Confirmo mi asistencia a la boda de Rosana y Nicanor el 26 de julio en Tingo María 🌿🎊',
  MAPS_CEREMONY:   'https://maps.google.com/?q=Jr.+Raymondi+450+Tingo+Maria+Huanuco+Peru',
  MAPS_RECEPTION:  'https://maps.google.com/?q=Carretera+Central+Km+2.5+Tingo+Maria+Peru',
  ACCOUNT_NUMBER:  '191-2847563-0-52',
  ACCOUNT_CCI:     '002-191-002847563052-14',
  ACCOUNT_NAME:    'Rosana Mantilla Carlos',
  ACCOUNT_BANK:    'BCP',
  QR_ALIAS:        '@rosana.nicanor2026',
};

/* ── UTILITY ────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════════
   1. COVER / ENVELOPE OPENING MECHANIC
═══════════════════════════════════════════════ */
(function coverModule() {
  const cover   = $('#cover');
  const openBtn = $('#open-btn');

  if (!cover || !openBtn) return;

  function openInvitation() {
    openBtn.disabled = true;
    openBtn.style.pointerEvents = 'none';

    /* Fade out the button gracefully */
    openBtn.style.transition = 'opacity 0.4s ease';
    openBtn.style.opacity = '0';

    /* After button fades, slide the cover up */
    setTimeout(() => {
      cover.classList.add('is-opening');

      /* After cover slides fully off, remove it from DOM flow */
      cover.addEventListener('transitionend', function onEnd() {
        cover.removeEventListener('transitionend', onEnd);
        cover.setAttribute('aria-hidden', 'true');
        cover.style.display = 'none';
        document.body.style.overflow = '';

        /* Smooth scroll to hero */
        const hero = $('#hero');
        if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 320);
  }

  /* Lock body scroll while cover is visible */
  document.body.style.overflow = 'hidden';

  openBtn.addEventListener('click', openInvitation);

  /* Keyboard: allow Enter / Space on button (native for button elements) */
  openBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openInvitation();
    }
  });
})();

/* ═══════════════════════════════════════════════
   2. STICKY NAVIGATION
═══════════════════════════════════════════════ */
(function navModule() {
  const nav    = $('#main-nav');
  const burger = $('#nav-burger');
  const menu   = $('#nav-menu');
  const hero   = $('#hero');

  if (!nav || !hero) return;

  /* Show/hide nav after scrolling past hero */
  const navObserver = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('is-visible', !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );
  navObserver.observe(hero);

  /* Hamburger toggle */
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!isOpen));
      burger.classList.toggle('is-open', !isOpen);
      menu.classList.toggle('is-open', !isOpen);
      burger.setAttribute('aria-label', isOpen ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
    });

    /* Close menu on nav link click */
    $$('.nav__link', menu).forEach(link => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        burger.classList.remove('is-open');
        menu.classList.remove('is-open');
        burger.setAttribute('aria-label', 'Abrir menú de navegación');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        burger.setAttribute('aria-expanded', 'false');
        burger.classList.remove('is-open');
        menu.classList.remove('is-open');
      }
    });
  }
})();

/* ═══════════════════════════════════════════════
   3. COUNTDOWN TIMER
═══════════════════════════════════════════════ */
(function countdownModule() {
  const target = new Date(CONFIG.WEDDING_DATE).getTime();

  const els = {
    days:  $('#cd-days'),
    hours: $('#cd-hours'),
    mins:  $('#cd-mins'),
    secs:  $('#cd-secs'),
  };

  if (!els.days) return;

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function tick() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      els.days.textContent  = '00';
      els.hours.textContent = '00';
      els.mins.textContent  = '00';
      els.secs.textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    els.days.textContent  = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent  = pad(mins);
    els.secs.textContent  = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ═══════════════════════════════════════════════
   4. SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════ */
(function revealModule() {
  /* Respect reduced motion */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  /* Add stagger delay for grid children */
  $$('.padrinos__grid, .galeria__grid, .regalos__cards').forEach(grid => {
    $$('.reveal', grid).forEach((el, i) => {
      el.style.setProperty('--delay', `${i * 0.09}s`);
    });
  });

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════
   5. ITINERARY CAROUSEL
      — Auto-advances every 4.5s
      — Pauses on hover / touch
      — Swipe on mobile
      — Dot navigation with progress indicator
═══════════════════════════════════════════════ */
(function carouselModule() {
  const track  = $('#itinerary-track');
  const dotsEl = $('#itinerary-dots');

  if (!track || !dotsEl) return;

  const slides     = $$('.itinerario__slide', track);
  const dots       = $$('.itinerario__dot', dotsEl);
  const total      = slides.length;
  let   current    = 0;
  let   autoTimer  = null;
  let   isPaused   = false;
  let   touchStart = 0;

  /* Calculate offset: each slide is full viewport width */
  function getSlideWidth() {
    return slides[0] ? slides[0].offsetWidth : window.innerWidth;
  }

  function goTo(index, fromUser = false) {
    current = ((index % total) + total) % total;

    /* For mobile: full width per slide; for desktop: slides are centered */
    const slideW = getSlideWidth();
    track.style.transform = `translateX(-${current * slideW}px)`;

    /* Update dots */
    dots.forEach((dot, i) => {
      const selected = i === current;
      dot.setAttribute('aria-selected', String(selected));
    });

    if (fromUser) resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!isPaused) next();
    }, 4500);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  /* Dot clicks */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide, 10), true);
    });
  });

  /* Keyboard navigation */
  const shell = track.closest('[role="region"]');
  if (shell) {
    shell.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { goTo(current + 1, true); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { goTo(current - 1, true); e.preventDefault(); }
    });
  }

  /* Pause on hover */
  track.addEventListener('mouseenter', () => { isPaused = true; });
  track.addEventListener('mouseleave', () => { isPaused = false; });

  /* Touch swipe */
  track.addEventListener('touchstart', (e) => {
    touchStart = e.touches[0].clientX;
    isPaused = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
      resetAuto();
    }
    isPaused = false;
  }, { passive: true });

  /* Recalculate on resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(current), 150);
  });

  /* Init */
  goTo(0);
  startAuto();
})();

/* ═══════════════════════════════════════════════
   6. COPY ACCOUNT NUMBER TO CLIPBOARD
═══════════════════════════════════════════════ */
(function copyModule() {
  const btn   = $('#copy-btn');
  const label = $('#copy-label');

  if (!btn) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.ACCOUNT_NUMBER);
      btn.classList.add('is-copied');
      label.textContent = '✓ Copiado!';

      setTimeout(() => {
        btn.classList.remove('is-copied');
        label.textContent = 'Copiar número';
      }, 3000);
    } catch {
      /* Fallback for browsers without clipboard API */
      const ta = document.createElement('textarea');
      ta.value = CONFIG.ACCOUNT_NUMBER;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();

      label.textContent = '✓ Copiado!';
      btn.classList.add('is-copied');
      setTimeout(() => {
        btn.classList.remove('is-copied');
        label.textContent = 'Copiar número';
      }, 3000);
    }
  });
})();

/* ═══════════════════════════════════════════════
   7. QR MODAL
═══════════════════════════════════════════════ */
(function qrModalModule() {
  const openBtn   = $('#qr-btn');
  const modal     = $('#qr-modal');
  const closeBtn  = $('#qr-close');
  const backdrop  = $('#qr-backdrop');

  if (!openBtn || !modal) return;

  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    trapFocus(modal);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  function trapFocus(el) {
    const focusable = $$('button, a, input, [tabindex]:not([tabindex="-1"])', el);
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    el.addEventListener('keydown', function handler(e) {
      if (e.key !== 'Tab') {
        if (e.key === 'Escape') closeModal();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
    });
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

/* ═══════════════════════════════════════════════
   8. WHATSAPP RSVP BUTTON
═══════════════════════════════════════════════ */
(function whatsappModule() {
  const btn = $('#whatsapp-btn');
  if (!btn) return;

  const encoded = encodeURIComponent(CONFIG.WHATSAPP_MSG);
  btn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encoded}`;
})();

/* ═══════════════════════════════════════════════
   9. AUDIO PLAYER
      — Fade in/out 1.2s
      — Toggle button with aria-pressed
      — Wave icon animates while playing
═══════════════════════════════════════════════ */
(function audioModule() {
  const btn   = $('#audio-toggle');
  const audio = $('#bg-audio');

  if (!btn || !audio) return;

  /* Don't show if no source is configured */
  const hasSrc = audio.querySelector('source') || audio.src;
  if (!hasSrc) {
    /* Player still visible but clicking shows a hint */
    btn.setAttribute('aria-label', 'Agrega tu canción en el código fuente del audio');
    btn.title = 'Sin fuente de audio configurada — ver comentarios en index.html';
    btn.addEventListener('click', () => {
      btn.style.animation = 'none';
      btn.style.opacity = '0.5';
      setTimeout(() => {
        btn.style.animation = '';
        btn.style.opacity = '';
      }, 800);
    });
    return;
  }

  let isPlaying = false;
  audio.volume = 0;

  function fadeVolume(from, to, duration) {
    const steps    = 40;
    const stepTime = duration / steps;
    const stepSize = (to - from) / steps;
    let   vol      = from;

    return new Promise(resolve => {
      const id = setInterval(() => {
        vol = Math.min(1, Math.max(0, vol + stepSize));
        audio.volume = vol;
        if ((stepSize > 0 && vol >= to) || (stepSize < 0 && vol <= to)) {
          clearInterval(id);
          resolve();
        }
      }, stepTime);
    });
  }

  async function toggleAudio() {
    if (!isPlaying) {
      try {
        audio.volume = 0;
        await audio.play();
        isPlaying = true;
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Pausar música');
        fadeVolume(0, 0.65, 1200);
      } catch (err) {
        console.warn('Audio autoplay blocked:', err);
      }
    } else {
      fadeVolume(audio.volume, 0, 1200).then(() => {
        audio.pause();
        audio.volume = 0;
        isPlaying = false;
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Reproducir música de fondo');
      });
    }
  }

  btn.addEventListener('click', toggleAudio);

  /* Pause when tab is hidden, resume on return */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
      audio.pause();
    } else if (!document.hidden && isPlaying) {
      audio.play().catch(() => {});
    }
  });
})();

/* ═══════════════════════════════════════════════
   10. INIT — Run on DOMContentLoaded
       (all modules above run immediately via IIFE,
        but map links need the DOM to be ready)
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Set Google Maps hrefs from CONFIG */
  const ceremonyLinks  = $$('.evento__card:first-of-type .evento__map-link');
  const receptionLinks = $$('.evento__card:last-of-type .evento__map-link');
  ceremonyLinks.forEach(a  => { a.href = CONFIG.MAPS_CEREMONY; });
  receptionLinks.forEach(a => { a.href = CONFIG.MAPS_RECEPTION; });

  /* Active nav link on scroll */
  const sections = $$('section[id], footer[id]');
  const navLinks = $$('.nav__link[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => sectionObserver.observe(s));
});
