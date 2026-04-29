/* ════════════════════════════════════════════════════════
   BODA — Lorenzo & Isabella
   script.js · Interactions & Animation Engine
   ════════════════════════════════════════════════════════ */

const App = (() => {

  /* ── CONFIG ─────────────────────────────────────────── */
  const CONFIG = {
    weddingDate: new Date('2025-10-19T16:00:00'),
    calendarUrl: 'https://www.google.com/calendar/render?action=TEMPLATE'
      + '&text=Boda+Lorenzo+%26+Isabella'
      + '&dates=20251019T160000%2F20251020T000000'
      + '&location=Sal%C3%B3n+de+Eventos+Notre+Dame'
      + '&details=Celebramos+nuestra+boda.+%C2%A1Nos+acompa%C3%B1as%3F',
  };

  /* ── STATE ──────────────────────────────────────────── */
  let countdownInterval = null;
  let lastSeconds = -1;
  let animObserver = null;
  let lightboxOpen = false;


  /* ════════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════════ */
  function init() {
    parseUrlParams();
    setupCalendarLink();
    setupCountdown();
    setupNav();
    setupScrollIndicator();
    setupGallery();
    setupLightbox();
    setupCopyButtons();
    setupTimeline();
    // Animations boot after intro is dismissed
  }


  /* ════════════════════════════════════════════════════
     URL PARAMETERS
  ════════════════════════════════════════════════════ */
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);

    // Guest name — ?m=Name or fallback
    const nombre = params.get('m') || params.get('nombre') || 'Invitado Especial';
    const elNombre = document.getElementById('nombre-invitado');
    if (elNombre) elNombre.textContent = nombre;

    // Passes — ?n=X pases or just a number
    const pasesRaw = params.get('n') || '2';
    const pasesNum = (pasesRaw.match(/\d+/) || ['2'])[0];
    const elPases = document.getElementById('pases-num');
    if (elPases) elPases.textContent = pasesNum;
  }


  /* ════════════════════════════════════════════════════
     CALENDAR LINK
  ════════════════════════════════════════════════════ */
  function setupCalendarLink() {
    const btn = document.getElementById('btn-calendar');
    if (btn) btn.href = CONFIG.calendarUrl;
  }


  /* ════════════════════════════════════════════════════
     COUNTDOWN
  ════════════════════════════════════════════════════ */
  function setupCountdown() {
    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  function tick() {
    const now  = new Date();
    const diff = CONFIG.weddingDate - now;

    const ids = ['cd-dias', 'cd-hrs', 'cd-mins', 'cd-segs'];

    if (diff <= 0) {
      ids.forEach(id => setCountdownNum(id, '00'));
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000)  / 60000);
    const segs = Math.floor((diff % 60000)    / 1000);

    const values = [days, hrs, mins, segs];

    // Only flip seconds digit every second (and by extension carry)
    const currentSeconds = segs;
    const secondsChanged = currentSeconds !== lastSeconds;
    lastSeconds = currentSeconds;

    values.forEach((val, i) => {
      const str = String(val).padStart(2, '0');
      const el  = document.getElementById(ids[i]);
      if (!el) return;

      if (el.textContent !== str) {
        if (secondsChanged) {
          el.classList.remove('flipping');
          // Force reflow for re-triggering animation
          void el.offsetWidth;
          el.classList.add('flipping');
        }
        el.textContent = str;
      }
    });
  }

  function setCountdownNum(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }


  /* ════════════════════════════════════════════════════
     NAVIGATION
  ════════════════════════════════════════════════════ */
  function setupNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    // Scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 60;
          nav.classList.toggle('scrolled', scrolled);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Smooth scroll for nav links
    nav.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  /* ════════════════════════════════════════════════════
     SCROLL INDICATOR (hero)
  ════════════════════════════════════════════════════ */
  function setupScrollIndicator() {
    const indicator = document.querySelector('.hero-scroll-indicator');
    if (!indicator) return;

    // Show after a delay
    setTimeout(() => indicator.classList.add('visible'), 3500);

    // Hide when user scrolls
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) indicator.classList.remove('visible');
    }, { passive: true, once: false });
  }


  /* ════════════════════════════════════════════════════
     ANIMATION OBSERVER
  ════════════════════════════════════════════════════ */
  function bootAnimations() {
    // Mark body as animation-ready — CSS picks this up
    document.body.classList.add('anim-ready');

    animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => {
          el.style.animationDelay = delay + 'ms';
        }, 0);
        animObserver.unobserve(el);
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    document.querySelectorAll('[data-anim]').forEach(el => {
      animObserver.observe(el);
    });

    // Timeline line reveal
    const tl = document.querySelector('.timeline');
    if (tl) {
      const tlObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          tl.classList.add('tl-line-visible');
          tlObserver.disconnect();
        }
      }, { threshold: 0.2 });
      tlObserver.observe(tl);
    }
  }


  /* ════════════════════════════════════════════════════
     INTRO
  ════════════════════════════════════════════════════ */
  function enterSite() {
    const intro = document.getElementById('intro');
    const nav   = document.getElementById('nav');
    if (!intro) return;

    intro.classList.add('exiting');

    // Make nav visible
    if (nav) {
      setTimeout(() => nav.classList.add('visible'), 800);
    }

    // Remove intro from DOM and start hero animations
    setTimeout(() => {
      intro.style.display = 'none';
      bootAnimations();

      // Scroll indicator
      setTimeout(() => {
        const indicator = document.querySelector('.hero-scroll-indicator');
        if (indicator) indicator.classList.add('visible');
      }, 2500);
    }, 1500);
  }


  /* ════════════════════════════════════════════════════
     GALLERY
  ════════════════════════════════════════════════════ */
  function setupGallery() {
    const items = document.querySelectorAll('.galeria-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
    });
  }


  /* ════════════════════════════════════════════════════
     LIGHTBOX
  ════════════════════════════════════════════════════ */
  function setupLightbox() {
    // Create lightbox elements
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Fotografía ampliada');

    const img = document.createElement('img');
    img.id = 'lightbox-img';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Cerrar');

    lb.appendChild(img);
    lb.appendChild(closeBtn);
    document.body.appendChild(lb);

    // Close on click
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target === closeBtn) closeLightbox();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxOpen) closeLightbox();
    });
  }

  function openLightbox(src, alt) {
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxOpen = true;
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lightboxOpen = false;
  }


  /* ════════════════════════════════════════════════════
     COPY BUTTONS
  ════════════════════════════════════════════════════ */
  function setupCopyButtons() {
    document.querySelectorAll('.btn-copiar').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          btn.classList.add('copied');
          const origHTML = btn.innerHTML;
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/></svg> ¡Copiado!`;
          showToast('Número copiado al portapapeles');
          setTimeout(() => {
            btn.innerHTML = origHTML;
            btn.classList.remove('copied');
          }, 2500);
        } catch {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.cssText = 'position:absolute;opacity:0;';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast('Número copiado');
        }
      });
    });
  }


  /* ════════════════════════════════════════════════════
     TIMELINE HOVER EFFECTS
  ════════════════════════════════════════════════════ */
  function setupTimeline() {
    const items = document.querySelectorAll('.tl-item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const dot = item.querySelector('.tl-dot');
        if (dot) dot.style.background = 'var(--granate)';
      });
      item.addEventListener('mouseleave', () => {
        const dot = item.querySelector('.tl-dot');
        if (dot && !dot.classList.contains('featured')) {
          dot.style.background = 'var(--marfil)';
        }
      });
    });
  }


  /* ════════════════════════════════════════════════════
     TOAST NOTIFICATION
  ════════════════════════════════════════════════════ */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('show');
    void toast.offsetWidth; // reflow
    toast.classList.add('show');
  }


  /* ════════════════════════════════════════════════════
     PARALLAX (subtle — only on desktop)
  ════════════════════════════════════════════════════ */
  function setupParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    const heroNames = document.querySelector('.hero-nombres-wrap');
    const heroAmp   = document.querySelector('.hero-amp');

    if (!heroNames) return;

    let raf = null;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        if (scrollY < vh) {
          const progress = scrollY / vh;
          heroNames.style.transform = `translateY(${progress * 40}px)`;
          if (heroAmp) heroAmp.style.transform = `translateY(${-10 + progress * 30}px)`;
        }
        raf = null;
      });
    }, { passive: true });
  }


  /* ════════════════════════════════════════════════════
     MAGNETIC BUTTONS (subtle pull effect)
  ════════════════════════════════════════════════════ */
  function setupMagneticButtons() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    document.querySelectorAll('.btn, #intro-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.18;
        const dy = (e.clientY - cy) * 0.18;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }


  /* ════════════════════════════════════════════════════
     CURSOR TRAIL (luxury touch on desktop)
  ════════════════════════════════════════════════════ */
  function setupCursorTrail() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    const DOT_COUNT = 8;
    const dots = [];

    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed;
        width: ${3 - i * 0.25}px;
        height: ${3 - i * 0.25}px;
        border-radius: 50%;
        background: rgba(107,15,26,${0.35 - i * 0.04});
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
        will-change: left, top;
      `;
      document.body.appendChild(dot);
      dots.push({ el: dot, x: -100, y: -100 });
    }

    let mouseX = -100, mouseY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hide on touch
    document.addEventListener('touchstart', () => {
      dots.forEach(d => d.el.style.opacity = '0');
    }, { passive: true });

    function animateDots() {
      let x = mouseX, y = mouseY;
      dots.forEach((dot, i) => {
        dot.x += (x - dot.x) * (0.5 - i * 0.04);
        dot.y += (y - dot.y) * (0.5 - i * 0.04);
        dot.el.style.left = dot.x + 'px';
        dot.el.style.top  = dot.y + 'px';
        x = dot.x;
        y = dot.y;
      });
      requestAnimationFrame(animateDots);
    }
    animateDots();
  }


  /* ════════════════════════════════════════════════════
     SECTION PARALLAX BACKGROUNDS
  ════════════════════════════════════════════════════ */
  function setupSectionParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const countdown = document.getElementById('countdown-section');
    const rsvp      = document.getElementById('rsvp');

    if (!countdown && !rsvp) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (countdown) {
        const rect = countdown.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = 1 - (rect.bottom / (window.innerHeight + rect.height));
          countdown.style.backgroundPositionY = `${progress * 30}px`;
        }
      }
    }, { passive: true });
  }


  /* ════════════════════════════════════════════════════
     WINDOW LOAD — full boot
  ════════════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', () => {
    init();

    // Post-load features
    window.addEventListener('load', () => {
      setupParallax();
      setupMagneticButtons();
      setupCursorTrail();
      setupSectionParallax();
    });
  });


  /* ── Public API ── */
  return { enterSite, showToast, openLightbox };

})();
