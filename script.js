/* ═══════════════════════════════════════════════════════════
   ROSANA & NICANOR — WEDDING INVITATION
   script.js · Vanilla JS · Sin dependencias
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────
   ⚙️  CONFIGURACIÓN — Personaliza aquí
   ───────────────────────────────────────────────────────── */

const CONFIG = {
  // 📅 Fecha y hora de la boda (formato: 'YYYY-MM-DDTHH:MM:SS')
  // La hora está en zona horaria local del servidor; ajusta si es necesario
  WEDDING_DATE: '2026-07-26T15:00:00',

  // 📱 Número de WhatsApp (con código de país, sin '+' ni espacios)
  // Perú: 51 + 9 dígitos   Ej: '51987654321'
  WHATSAPP_NUMBER: '51912762243',

  // 💬 Mensaje prellenado para WhatsApp
  WHATSAPP_MESSAGE: '¡Hola! Confirmo mi asistencia a la boda de Rosana y Nicanor el 26 de julio. 🎉',
};

/* ─────────────────────────────────────────────────────────
   🎵  CONTROL DE AUDIO
   ───────────────────────────────────────────────────────── */

(function initAudio() {
  const btn      = document.getElementById('audioBtn');
  const music    = document.getElementById('bgMusic');
  const icon     = document.getElementById('audioIcon');
  const label    = document.getElementById('audioLabel');
  let isPlaying  = false;

  if (!btn || !music) return;

  // Configura el volumen inicial
  music.volume = 0.35;

  btn.addEventListener('click', () => {
    if (isPlaying) {
      // Fade out suave
      fadeAudio(music, 0, 800, () => {
        music.pause();
        isPlaying = false;
        updateAudioUI(false);
      });
    } else {
      music.play()
        .then(() => {
          isPlaying = true;
          music.volume = 0;
          fadeAudio(music, 0.35, 1200);
          updateAudioUI(true);
        })
        .catch(() => {
          // El navegador bloqueó el audio; muéstrale al usuario que intente de nuevo
          label.textContent = 'Activar';
        });
    }
  });

  function updateAudioUI(playing) {
    icon.textContent  = playing ? '♫' : '♪';
    label.textContent = playing ? 'Pausar' : 'Música';
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-label', playing ? 'Pausar música' : 'Activar música');
  }

  /** Transición suave de volumen */
  function fadeAudio(audioEl, targetVol, durationMs, onEnd) {
    const startVol  = audioEl.volume;
    const diff      = targetVol - startVol;
    const steps     = 60;
    const stepTime  = durationMs / steps;
    let   step      = 0;

    const timer = setInterval(() => {
      step++;
      audioEl.volume = Math.max(0, Math.min(1, startVol + diff * (step / steps)));
      if (step >= steps) {
        clearInterval(timer);
        if (onEnd) onEnd();
      }
    }, stepTime);
  }
})();


/* ─────────────────────────────────────────────────────────
   ⏱️  CUENTA REGRESIVA EN TIEMPO REAL
   ───────────────────────────────────────────────────────── */

(function initCountdown() {
  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl) return;

  const weddingDate = new Date(CONFIG.WEDDING_DATE).getTime();

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick(el, newVal) {
    const old = el.textContent;
    if (old !== newVal) {
      el.classList.remove('tick');
      // Fuerza reflow para reiniciar la animación
      void el.offsetWidth;
      el.classList.add('tick');
      el.textContent = newVal;
      setTimeout(() => el.classList.remove('tick'), 300);
    }
  }

  function update() {
    const now  = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      // ¡Es hoy! Muestra un mensaje especial
      daysEl.textContent    = '00';
      hoursEl.textContent   = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      const countdownEl = document.querySelector('.countdown__until');
      if (countdownEl) {
        countdownEl.innerHTML = '¡<em>Hoy es el gran día!</em> 🎉';
      }
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    tick(daysEl,    pad(days));
    tick(hoursEl,   pad(hours));
    tick(minutesEl, pad(minutes));
    tick(secondsEl, pad(seconds));
  }

  update();
  setInterval(update, 1000);
})();


/* ─────────────────────────────────────────────────────────
   📱  WHATSAPP RSVP
   ───────────────────────────────────────────────────────── */

(function initWhatsApp() {
  const btn = document.getElementById('whatsappBtn');
  if (!btn) return;

  const encoded = encodeURIComponent(CONFIG.WHATSAPP_MESSAGE);
  btn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encoded}`;
})();


/* ─────────────────────────────────────────────────────────
   🌊  SCROLL REVEAL — Intersection Observer
   ───────────────────────────────────────────────────────── */

(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  // Verifica soporte para IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────────
   🎯  SCROLL SUAVE para anclas internas
   ───────────────────────────────────────────────────────── */

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ─────────────────────────────────────────────────────────
   ✨  ANIMACIÓN INICIAL DEL HERO (on load)
   ───────────────────────────────────────────────────────── */

(function initHeroEntrance() {
  // Elementos del hero que deben revelarse al cargar
  const heroElements = document.querySelectorAll('.hero .reveal-up');
  if (!heroElements.length) return;

  // Pequeño delay para asegurar que el DOM está listo
  setTimeout(() => {
    heroElements.forEach(el => {
      el.classList.add('revealed');
    });
  }, 200);
})();


/* ─────────────────────────────────────────────────────────
   🪄  REDUCIR MOVIMIENTO si el usuario lo prefiere
   ───────────────────────────────────────────────────────── */

(function respectMotionPreference() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyMotionPref(query) {
    if (query.matches) {
      // Revela todo inmediatamente
      document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
        .forEach(el => el.classList.add('revealed'));
    }
  }

  applyMotionPref(mq);
  mq.addEventListener('change', applyMotionPref);
})();
