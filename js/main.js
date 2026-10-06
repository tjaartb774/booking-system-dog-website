/* Beyond the Leash - shared behaviour: icons, nav, reveal, paws, services,
   checklist, toast, confetti. Loaded on every page before quiz/booking. */
(function () {
  'use strict';
  const D = window.BTL;
  const B = D.business;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Icons (inline SVG, stroke based) ---------- */
  const PAW = '<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><ellipse cx="20" cy="22" rx="6" ry="8" transform="rotate(-20 20 22)"/><ellipse cx="44" cy="22" rx="6" ry="8" transform="rotate(20 44 22)"/><ellipse cx="11" cy="34" rx="5" ry="6.5" transform="rotate(-40 11 34)"/><ellipse cx="53" cy="34" rx="5" ry="6.5" transform="rotate(40 53 34)"/><path d="M32 30c-9 0-16 8-16 15 0 5 4 8 8 8 3 0 5-1 8-1s5 1 8 1c4 0 8-3 8-8 0-7-7-15-16-15z"/></svg>';
  const st = (inner) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  const ICONS = {
    paw: PAW,
    scissors: st('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>'),
    bubbles: st('<circle cx="9" cy="14" r="6"/><circle cx="17" cy="7" r="3"/><circle cx="18" cy="17" r="2"/>'),
    puppy: st('<path d="M4 8c0-2 1-4 3-4 1 0 2 1 2 2M20 8c0-2-1-4-3-4-1 0-2 1-2 2"/><path d="M5 9c-1 3 0 9 7 11 7-2 8-8 7-11-2-2-4-3-7-3s-5 1-7 3z"/><circle cx="9.5" cy="12" r="1" fill="currentColor"/><circle cx="14.5" cy="12" r="1" fill="currentColor"/><path d="M12 14.5v1.5M10.5 17c.5.7 2.5.7 3 0"/>'),
    comb: st('<path d="M4 4h16v6H4z"/><path d="M6 10v10M9 10v10M12 10v10M15 10v10M18 10v10"/>'),
    heart: st('<path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6C19 16.4 12 21 12 21z"/>'),
    star: st('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>'),
    leaf: st('<path d="M5 20c0-9 5-15 15-15 0 10-6 15-15 15z"/><path d="M5 20c3-5 7-8 11-10"/>'),
    flask: st('<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M4 4l16 16"/>'),
    globe: st('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>'),
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z"/></svg>',
    mail: st('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    pin: st('<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.5"/>'),
    check: st('<path d="m5 12 4 4L19 6"/>'),
    dog: st('<path d="M4 8c0-2 1-4 3-4 1 0 2 1 2 2M20 8c0-2-1-4-3-4-1 0-2 1-2 2"/><path d="M5 9c-1 3 0 9 7 11 7-2 8-8 7-11-2-2-4-3-7-3s-5 1-7 3z"/><circle cx="9.5" cy="12" r="1" fill="currentColor"/><circle cx="14.5" cy="12" r="1" fill="currentColor"/>'),
    calendar: st('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    info: st('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    user: st('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
    send: st('<path d="m3 11 18-8-8 18-2-8z"/>'),
    sparkle: st('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/><circle cx="12" cy="12" r="2.5"/>')
  };
  D.icons = ICONS;
  $$('[data-icon]').forEach(el => { el.innerHTML = ICONS[el.dataset.icon] || PAW; });

  /* ---------- Contact links from data.js ---------- */
  const waBase = 'https://wa.me/' + B.whatsapp;
  D.waLink = (text) => waBase + (text ? '?text=' + encodeURIComponent(text) : '');
  const defaultWa = D.waLink('Hi Beyond the Leash! I would like to ask about a groom for my dog.');
  $$('[data-wa-link]').forEach(a => { a.href = defaultWa; a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-mail-link]').forEach(a => { a.href = 'mailto:' + B.email; });
  $$('[data-fb-link]').forEach(a => { a.href = B.facebook; });
  $$('[data-fb-label]').forEach(a => { a.textContent = B.facebookLabel; });
  $$('[data-tiktok-link]').forEach(a => { a.href = B.tiktok; });
  $$('[data-phone]').forEach(e => { e.textContent = B.phoneDisplay; });
  $$('[data-email]').forEach(e => { e.textContent = B.email; });
  $$('[data-town]').forEach(e => { e.textContent = B.town; });
  $$('[data-service-area]').forEach(e => { e.textContent = 'Serving ' + B.serviceArea; });
  $$('[data-year]').forEach(e => { e.textContent = String(new Date().getFullYear()); });

  /* ---------- Toast ---------- */
  let toastTimer;
  D.toast = function (msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  };

  /* ---------- Paw confetti ---------- */
  D.confetti = function (x, y, count) {
    if (reduced) return;
    const n = count || 24;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('div');
      p.className = 'confetti';
      p.innerHTML = PAW;
      const ang = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 180;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist - 60 + 'px');
      p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      p.style.color = Math.random() > .5 ? '#5B2D8E' : '#C9B6E4';
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  };

  /* ---------- Mobile nav ---------- */
  const toggle = $('.nav-toggle');
  const menu = $('#mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = $$('main section[id]');
  const links = $$('.nav-links a[href^="#"]');
  if (sections.length && links.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealAll = () => $$('.reveal:not(.in)').forEach(r => r.classList.add('in'));
  const revealVisible = () => {
    const limit = window.innerHeight * 0.95;
    $$('.reveal:not(.in)').forEach(r => { if (r.getBoundingClientRect().top < limit) r.classList.add('in'); });
  };
  D.observeReveal = function (el) {
    if (reduced || !('IntersectionObserver' in window)) { el.classList.add('in'); return; }
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: .05 });
    ro.observe(el);
  };
  if (reduced) {
    revealAll();
  } else {
    $$('.reveal').forEach(D.observeReveal);
    // Fallback so a fast scroll never leaves a section hidden
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { revealVisible(); ticking = false; });
    }, { passive: true });
    window.addEventListener('load', revealVisible);
  }

  /* ---------- Floating paws in hero ---------- */
  const floatBox = $('#float-paws');
  if (floatBox && !reduced) {
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'float-paw';
      p.innerHTML = PAW;
      p.style.left = (Math.random() * 100) + '%';
      p.style.bottom = '-50px';
      p.style.animationDuration = (14 + Math.random() * 14) + 's';
      p.style.animationDelay = (-Math.random() * 20) + 's';
      p.style.width = p.style.height = (22 + Math.random() * 30) + 'px';
      floatBox.appendChild(p);
    }
  }

  /* ---------- Paw-print trail in hero ---------- */
  const hero = $('#hero');
  if (hero && !reduced) {
    let last = 0, flip = false;
    const stamp = (x, y) => {
      const now = Date.now();
      if (now - last < 90) return;
      last = now;
      flip = !flip;
      const p = document.createElement('div');
      p.className = 'paw-print';
      p.innerHTML = PAW;
      p.style.left = (x - 13 + (flip ? -10 : 10)) + 'px';
      p.style.top = (y - 13) + 'px';
      p.style.transform = 'rotate(' + (flip ? -15 : 15) + 'deg)';
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    };
    hero.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') stamp(e.clientX, e.clientY); });
    hero.addEventListener('pointerdown', e => { if (e.target.closest('a, button')) return; stamp(e.clientX, e.clientY); });
  }

  /* ---------- Logo easter egg ---------- */
  const logo = $('#hero-logo');
  if (logo) {
    let pats = 0, resetTimer;
    logo.addEventListener('click', e => {
      pats++;
      logo.classList.remove('wiggle');
      void logo.offsetWidth;
      logo.classList.add('wiggle');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { pats = 0; }, 2500);
      if (pats >= 5) {
        pats = 0;
        D.confetti(e.clientX, e.clientY, 36);
        D.toast('Good dog! 🐾 Lead with Love');
      } else if (pats === 3) {
        D.toast('Keep patting...');
      }
    });
  }

  /* ---------- Services grid ---------- */
  const grid = $('#services-grid');
  if (grid) {
    grid.innerHTML = D.services.map((s, i) => `
      <article class="card service-card reveal reveal-delay-${i % 3}" data-service="${s.id}">
        ${s.training ? '<span class="training-tag">Training</span>' : ''}
        <div class="icon">${ICONS[s.icon] || PAW}</div>
        <h3>${s.name}</h3>
        <p>${s.blurb}</p>
        <ul>${s.includes.map(x => '<li>' + x + '</li>').join('')}</ul>
        <span class="quote">Quote on request</span>
        <p class="note">${s.quoteNote}</p>
        <a class="btn btn-outline btn-sm" href="#book" data-book-service="${s.id}">Book ${s.training ? 'a chat' : 'this'}</a>
      </article>`).join('');
    $$('.reveal', grid).forEach(D.observeReveal);
  }

  /* Any "book this" link anywhere preselects the service in the wizard */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-book-service]');
    if (!a) return;
    document.dispatchEvent(new CustomEvent('btl:preselect', { detail: { service: a.dataset.bookService } }));
  });

  /* ---------- Pre-visit checklist ---------- */
  const box = $('#checklist-box');
  if (box) {
    const KEY = 'btl-checklist';
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
    box.innerHTML = D.checklist.map(c => `
      <label class="check-item">
        <input type="checkbox" data-check="${c.id}" ${saved[c.id] ? 'checked' : ''}>
        <span class="box">${ICONS.check}</span>
        <span>${c.text}</span>
      </label>`).join('') + `
      <div class="check-progress"><div class="bar"><i></i></div><span class="count">0/${D.checklist.length}</span></div>
      <p class="check-done">All set! Your dog is going to have a lovely visit. 🐾</p>`;
    const boxes = $$('input[data-check]', box);
    const bar = $('.bar i', box), count = $('.count', box), done = $('.check-done', box);
    let wasDone = boxes.every(b => b.checked);
    const update = (e) => {
      const n = boxes.filter(b => b.checked).length;
      bar.style.width = (n / boxes.length * 100) + '%';
      count.textContent = n + '/' + boxes.length;
      const all = n === boxes.length;
      done.classList.toggle('show', all);
      if (all && !wasDone && e) {
        const r = done.getBoundingClientRect();
        D.confetti(r.left + r.width / 2, r.top, 30);
      }
      wasDone = all;
      const state = {};
      boxes.forEach(b => { state[b.dataset.check] = b.checked; });
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
    };
    boxes.forEach(b => b.addEventListener('change', update));
    update();
  }

  /* ---------- Toggle helper for labelled checkboxes ---------- */
  document.addEventListener('change', e => {
    const t = e.target.closest('.toggle');
    if (t && e.target.type === 'checkbox') t.classList.toggle('on', e.target.checked);
  });
})();
