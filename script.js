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

/* ═══════════════════════════════════════════════════════════════
   BLOQUE 5 — Línea divisoria (scaleY reveal)
═══════════════════════════════════════════════════════════════ */
(function initDivider() {
  'use strict';

  const divider = document.querySelector('.b5-divider');
  if (!divider) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    divider.classList.add('is-visible');
    return;
  }

  /* Reutiliza el mismo IntersectionObserver threshold que el reveal global */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        divider.classList.add('is-visible');
        io.disconnect();
      }
    });
  }, { threshold: 0.1 });

  io.observe(divider);
})();

/* ═══════════════════════════════════════════════════════════════
   BLOQUE 5 — Parallax fondo (solo desktop, RAF throttle)
═══════════════════════════════════════════════════════════════ */
(function initArcoiris() {
  'use strict';
  const linea = document.getElementById('footer-arcoiris');
  if (!linea) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function randomHsl() {
    return 'hsl(' + Math.floor(Math.random() * 360) + ',80%,60%)';
  }
  function buildGradient() {
    const stops = Array.from({ length: 8 }, randomHsl);
    stops.push(stops[0]);
    return 'linear-gradient(to right,' + [...stops, ...stops].join(',') + ')';
  }
  function applyGradient() {
    linea.style.backgroundImage = buildGradient();
  }

  applyGradient();

  let offset = 0;
  function moverGradiente() {
    offset += 0.15;
    linea.style.backgroundPosition = offset + '% 0%';
    requestAnimationFrame(moverGradiente);
  }

  if (!reducedMotion) {
    moverGradiente();
  }

})();

/* ═══════════════════════════════════════════════════════════════
   BLOQUE 6 — Carrusel galería (auto-scroll + drag + touch)
═══════════════════════════════════════════════════════════════ */
(function initGaleria() {
  'use strict';

  const wrapper = document.querySelector('.galeria__track-wrapper');
  const track   = document.getElementById('galeria-track');
  if (!wrapper || !track) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Duplicar contenido para loop infinito ── */
  const original = track.innerHTML;
  track.innerHTML = original + original;

  /* ── 2. Estado ── */
  const SPEED    = 0.3; /* px por frame */
  let offset     = 0;
  let halfWidth  = 0;   /* ancho de la mitad (un juego de fotos) */
  let rafId      = null;
  let isPaused   = false;

  /* Drag */
  let isDragging   = false;
  let dragStartX   = 0;
  let dragStartOff = 0;

  /* Touch */
  let touchStartX   = 0;
  let touchStartOff = 0;

  function getHalfWidth() {
    return track.scrollWidth / 2;
  }

  function applyTransform() {
    track.style.transform = 'translateX(' + (-offset) + 'px)';
  }

  /* ── 3. Normalizar offset dentro del rango del primer juego ── */
  function clampOffset() {
    halfWidth = getHalfWidth();
    if (offset >= halfWidth) offset -= halfWidth;
    if (offset < 0)          offset += halfWidth;
  }

  /* ── 4. Auto-scroll ── */
  function autoScroll() {
    if (!isPaused && !reducedMotion) {
      offset += SPEED;
      clampOffset();
      applyTransform();
    }
    rafId = requestAnimationFrame(autoScroll);
  }

  /* ── 5. Mouse drag ── */
  wrapper.addEventListener('mousedown', function (e) {
    isDragging   = true;
    dragStartX   = e.clientX;
    dragStartOff = offset;
    isPaused     = true;
    wrapper.classList.add('is-dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    const delta = dragStartX - e.clientX;
    offset = dragStartOff + delta;
    clampOffset();
    applyTransform();
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    isPaused   = false;
    wrapper.classList.remove('is-dragging');
  }

  window.addEventListener('mouseup',    endDrag);
  window.addEventListener('mouseleave', endDrag);

  /* ── 6. Touch ── */
  wrapper.addEventListener('touchstart', function (e) {
    touchStartX   = e.touches[0].clientX;
    touchStartOff = offset;
    isPaused      = true;
  }, { passive: true });

  wrapper.addEventListener('touchmove', function (e) {
    const delta = touchStartX - e.touches[0].clientX;
    offset = touchStartOff + delta;
    clampOffset();
    applyTransform();
    e.preventDefault();
  }, { passive: false });

  wrapper.addEventListener('touchend', function () {
    isPaused = false;
  });

  /* ── 7. Arrancar ── */
  halfWidth = getHalfWidth();
  rafId = requestAnimationFrame(autoScroll);
})();

/* ═══════════════════════════════════════════════════════════════
   TICKER — loop infinito
═══════════════════════════════════════════════════════════════ */
(function initTicker() {
  'use strict';

  const track = document.querySelector('.ticker__track');
  if (!track) return;

  const base      = 'Rosana & Nicanor 26 ❖ 07 ❖ 2026';
  const separator = '    '; /* 4× em space */
  const unit      = base + separator;

  /* Calcula repeticiones para cubrir el doble del viewport */
  const tempSpan = document.createElement('span');
  tempSpan.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:prestige-elite-std,monospace;font-size:0.7rem;letter-spacing:0.25em;text-transform:uppercase;';
  tempSpan.textContent = unit;
  document.body.appendChild(tempSpan);
  const unitWidth = tempSpan.offsetWidth || 300;
  document.body.removeChild(tempSpan);

  const copies = Math.ceil((window.innerWidth * 2) / unitWidth) + 2;
  const content = unit.repeat(copies);

  /* Duplicar exactamente para que -50% = un ciclo completo */
  track.textContent = content + content;
})();

/* ═══════════════════════════════════════════════════════════════
   MÚSICA — botón flotante (play / pause)
═══════════════════════════════════════════════════════════════ */
(function initMusica() {
  'use strict';

  const audio = document.getElementById('musica-boda');
  const btn   = document.getElementById('musica-btn');
  if (!audio || !btn) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setPlaying() {
    btn.classList.add('musica-btn--playing');
    btn.classList.remove('musica-btn--paused');
    btn.setAttribute('aria-label', 'Pausar música');
    btn.setAttribute('aria-pressed', 'true');
  }

  function setPaused() {
    btn.classList.remove('musica-btn--playing');
    btn.classList.add('musica-btn--paused');
    btn.setAttribute('aria-label', 'Reproducir música');
    btn.setAttribute('aria-pressed', 'false');
  }

  /* ── Mostrar botón y hacer autoplay tras el gesto del usuario ── */
  const btnInvitacion = document.getElementById('btn-invitacion');
  if (btnInvitacion) {
    btnInvitacion.addEventListener('click', function () {
      setTimeout(function () {
        btn.classList.add('musica-btn--visible');

        audio.play().then(function () {
          setPlaying();
        }).catch(function () {
          /* Autoplay bloqueado — botón queda visible para play manual */
        });
      }, 1200); /* Coincide con la duración de la transición del bloque 1 */
    });
  }

  /* ── Toggle play / pause ── */
  btn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().then(setPlaying).catch(function () {});
    } else {
      audio.pause();
      setPaused();
    }
  });

})();

/* ═══════════════════════════════════════════════════════════════
   LOADER — pantalla de carga inicial
═══════════════════════════════════════════════════════════════ */
(function initLoader() {
  'use strict';

  const loader = document.getElementById('loader');
  if (!loader) return;

  /* window.load espera a que todas las imágenes y fuentes
     estén completamente cargadas antes de ocultar el loader */
  window.addEventListener('load', function () {
    /* Pequeño delay para que el pulso se vea al menos una vez completo */
    setTimeout(function () {
      loader.classList.add('is-hidden');

      /* Quitar del flujo tras el fade out (0.8s) */
      setTimeout(function () {
        loader.style.display = 'none';
      }, 800);
    }, 600);
  });

})();

/* ═══════════════════════════════════════════════════════════════
   BLOQUE 7 — Regalos: copiar número + modal QR
═══════════════════════════════════════════════════════════════ */
(function initRegalos() {
  'use strict';

  const NUMERO_CUENTA = '483920571634';

  /* ── Botón copiar ── */
  const btnCopiar = document.getElementById('btn-copiar');
  if (btnCopiar) {
    btnCopiar.addEventListener('click', function () {
      const btn = this;
      const textoOriginal = btn.textContent;

      function onSuccess() {
        btn.textContent = '¡copiado!';
        btn.classList.add('copiado');
        setTimeout(function () {
          btn.textContent = textoOriginal;
          btn.classList.remove('copiado');
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(NUMERO_CUENTA).then(onSuccess).catch(function () {
          fallbackCopy(NUMERO_CUENTA, onSuccess);
        });
      } else {
        fallbackCopy(NUMERO_CUENTA, onSuccess);
      }
    });
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ── Modal QR ── */
  const modal      = document.getElementById('qr-modal');
  const btnQR      = document.getElementById('btn-qr');
  const btnCerrar  = document.getElementById('btn-cerrar-qr');

  if (!modal || !btnQR || !btnCerrar) return;

  /* Elementos focusables dentro del modal (focus trap) */
  function getFocusable() {
    return Array.from(modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])'));
  }

function openModal() {
  modal.classList.add('is-open');
  modal.removeAttribute('aria-hidden');
  setTimeout(function () { btnCerrar.focus(); }, 50);
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
  btnQR.focus();
}
  btnQR.addEventListener('click', openModal);
  btnCerrar.addEventListener('click', closeModal);

  /* Clic en el fondo (overlay) */
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  /* Tecla ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* Focus trap: mantener Tab/Shift+Tab dentro del modal */
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════
   FULLSCREEN — se activa al abrir la invitación
═══════════════════════════════════════════════════════════════ */
(function initFullscreen() {
  'use strict';

  const btn = document.getElementById('btn-invitacion');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const el = document.documentElement;

    /* Intentar fullscreen — ignorar silenciosamente si el navegador lo bloquea */
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(function () {});
    } else if (el.webkitRequestFullscreen) {
      /* Safari */
      try { el.webkitRequestFullscreen(); } catch (e) {}
    } else if (el.mozRequestFullScreen) {
      /* Firefox antiguo */
      try { el.mozRequestFullScreen(); } catch (e) {}
    }
  });

})();
