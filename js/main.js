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
  const PAW = '<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><path d="M31.1 61.9C31.0 61.9 30.3 61.8 29.3 61.8C27.8 61.7 27.6 61.6 26.8 61.2C25.8 60.8 24.9 60.1 23.6 59.0C22.8 58.3 22.7 58.1 22.2 57.1C21.9 56.4 21.6 55.7 21.3 55.4C20.8 54.9 20.7 54.8 19.4 54.4C17.3 53.8 17.3 53.8 17.0 51.8C16.9 51.2 16.7 50.6 16.7 50.4C16.6 50.3 16.3 50.0 15.9 49.7C15.5 49.5 15.2 49.1 15.1 49.0C15.1 48.9 14.5 48.4 13.9 47.9C13.3 47.5 12.6 46.9 12.3 46.6C12.1 46.4 11.5 46.1 11.1 45.9C10.7 45.8 10.1 45.5 9.7 45.3C9.3 45.0 8.5 44.6 8.0 44.4C6.8 43.8 6.9 43.8 5.1 41.0C4.8 40.5 4.5 40.3 3.9 39.9C2.9 39.4 2.9 39.2 3.3 38.5C3.5 38.2 3.7 37.7 3.8 37.0C3.9 36.4 4.3 35.3 4.6 34.5C5.7 31.7 6.5 31.3 10.4 31.2C11.7 31.2 12.2 31.1 12.7 30.9C13.4 30.7 18.3 29.7 20.2 29.5C20.7 29.4 21.5 29.2 22.0 29.0C22.5 28.8 23.3 28.6 23.8 28.4C24.4 28.3 24.9 28.1 25.3 27.8C26.1 27.3 27.0 26.9 28.0 26.7C28.4 26.6 29.0 26.3 29.3 26.2C30.0 25.8 31.1 25.6 31.7 25.7C31.9 25.8 32.3 26.0 32.7 26.3C34.0 27.5 34.4 27.8 35.0 28.1C36.1 28.5 36.0 28.4 37.5 30.4C38.0 31.1 38.1 32.1 38.1 35.1C38.1 37.1 38.2 38.1 38.3 38.6C38.4 39.0 38.5 39.6 38.5 39.9C38.5 40.2 38.6 41.0 38.7 41.7C38.8 42.3 39.1 43.7 39.2 44.7C39.3 45.7 39.6 47.3 39.8 48.2C40.5 50.9 40.8 52.7 40.8 54.4C40.8 56.8 40.3 57.8 38.7 59.4C37.6 60.5 36.8 60.9 34.9 61.5C34.0 61.8 33.3 61.9 32.4 62.0C31.7 62.0 31.1 62.0 31.1 61.9ZM49.4 49.9C48.7 49.7 46.9 48.6 46.4 48.0C45.6 47.1 45.5 46.3 45.8 45.0C46.2 43.7 46.5 43.1 47.2 42.7C47.7 42.3 47.9 42.1 48.2 41.5C48.6 40.7 49.6 39.6 50.3 39.3C50.8 39.0 52.2 39.0 52.7 39.2C52.8 39.3 53.5 39.5 54.1 39.5C54.7 39.5 55.4 39.6 55.6 39.7C55.9 39.7 56.0 39.7 56.4 39.4C57.1 38.8 58.0 38.6 59.3 38.9C60.6 39.2 61.0 39.9 61.1 42.3C61.1 43.8 61.1 44.0 60.9 44.5C60.5 45.4 59.2 46.9 58.2 47.6C57.8 47.9 57.0 48.4 56.6 48.7C55.7 49.2 54.8 49.7 53.9 49.9C52.9 50.1 50.0 50.1 49.4 49.9ZM49.5 31.9C49.3 31.8 48.7 31.4 48.3 31.0C47.9 30.6 47.5 30.3 47.4 30.3C47.3 30.3 47.0 30.4 46.7 30.5C45.9 30.7 45.4 30.6 44.8 29.9C44.3 29.3 44.1 28.7 44.1 28.1C44.1 27.5 44.3 26.3 44.6 25.6C44.8 25.2 45.0 24.6 45.0 24.3C45.2 23.4 46.8 20.7 47.3 20.3C47.6 20.0 48.0 19.7 48.3 19.4C49.6 18.3 50.7 17.6 51.8 17.3C52.4 17.1 53.5 16.7 54.3 16.4C55.5 15.9 55.8 15.9 56.3 15.9C57.5 16.0 59.2 17.1 59.7 18.1C60.5 19.7 60.6 21.5 60.1 22.6C60.0 23.0 59.7 23.7 59.6 24.2C59.2 25.7 58.0 27.5 56.9 28.1C55.6 29.0 53.4 30.5 52.7 31.0C51.9 31.6 50.9 32.1 50.2 32.1C50.0 32.1 49.7 32.0 49.5 31.9ZM15.5 23.3C15.4 23.2 15.2 22.9 15.1 22.5C14.9 22.1 14.6 21.6 14.5 21.3C14.3 21.1 13.9 20.4 13.6 19.9C13.4 19.4 13.0 18.6 12.8 18.3C12.1 17.1 11.7 15.5 11.6 14.5C11.6 13.6 11.7 13.5 12.1 12.4C12.4 11.8 12.9 10.8 13.3 10.2C13.7 9.7 14.1 8.9 14.2 8.5C14.5 7.8 14.6 7.7 15.7 7.2C16.1 7.1 16.7 6.7 17.0 6.5C17.3 6.2 17.6 6.0 17.7 6.0C17.9 6.0 20.2 6.8 21.6 7.3C22.1 7.5 22.2 7.8 22.3 9.4C22.4 10.2 22.6 11.4 22.7 12.1C22.9 13.4 22.9 14.4 22.3 17.8C22.2 18.7 22.0 19.7 22.0 20.0C22.0 20.6 21.7 21.2 21.2 21.6C20.6 22.0 19.4 22.3 18.5 22.3C17.4 22.3 16.9 22.5 16.5 23.0C16.1 23.4 15.8 23.5 15.5 23.3ZM33.0 18.4C32.5 18.2 31.9 18.0 31.8 17.8C31.2 17.2 30.3 15.7 30.0 14.9C29.6 13.6 29.7 12.8 30.4 11.5C30.7 10.8 31.1 9.9 31.3 9.3C31.4 8.7 31.8 7.9 32.0 7.6C32.2 7.2 32.5 6.4 32.7 5.8C32.9 5.0 33.1 4.7 33.4 4.4C34.1 3.7 34.6 3.4 35.4 3.3C35.9 3.2 36.6 2.9 37.4 2.6C38.5 2.0 38.5 2.0 39.8 2.0C41.0 2.0 41.1 2.0 41.7 2.4C42.4 2.8 43.0 3.7 43.0 4.3C43.0 4.5 43.1 5.0 43.3 5.4C43.4 5.8 43.6 6.4 43.7 6.9C43.9 7.6 43.9 7.8 43.6 9.1C43.4 9.9 43.2 10.9 43.0 11.2C42.9 11.6 42.7 12.2 42.7 12.6C42.6 13.0 42.5 13.5 42.4 13.7C42.3 13.8 41.7 14.4 41.0 15.0C40.4 15.5 39.3 16.5 38.6 17.2C37.3 18.5 37.3 18.5 36.5 18.6C35.3 18.8 34.1 18.8 33.0 18.4Z"/></svg>';
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
    hand: '<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><rect x="19" y="14" width="8" height="30" rx="4"/><rect x="29" y="8" width="8" height="36" rx="4"/><rect x="39" y="11" width="8" height="33" rx="4"/><rect x="49" y="19" width="7" height="25" rx="3.5"/><rect x="19" y="34" width="37" height="24" rx="12"/><rect x="11" y="27" width="10" height="26" rx="5" transform="rotate(-38 16 50)"/><path d="M28 16v26M38 13v29M48 21v21" stroke="#EDE6F6" stroke-width="1.8" stroke-linecap="round"/><g transform="translate(0 2) scale(.68)"><path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6C19 16.4 12 21 12 21z"/></g></svg>',
    ball: '<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><circle cx="32" cy="32" r="25"/><path d="M14 13c11 9 11 29 0 38M50 13c-11 9-11 29 0 38" fill="none" stroke="#EDE6F6" stroke-width="4" stroke-linecap="round"/></svg>',
    heartpaw: '<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><g transform="translate(1 2) scale(2.6)"><path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6C19 16.4 12 21 12 21z"/></g><g fill="#EDE6F6" transform="translate(18 20) scale(.44) rotate(-40 32 32)"><path d="M31.1 61.9C31.0 61.9 30.3 61.8 29.3 61.8C27.8 61.7 27.6 61.6 26.8 61.2C25.8 60.8 24.9 60.1 23.6 59.0C22.8 58.3 22.7 58.1 22.2 57.1C21.9 56.4 21.6 55.7 21.3 55.4C20.8 54.9 20.7 54.8 19.4 54.4C17.3 53.8 17.3 53.8 17.0 51.8C16.9 51.2 16.7 50.6 16.7 50.4C16.6 50.3 16.3 50.0 15.9 49.7C15.5 49.5 15.2 49.1 15.1 49.0C15.1 48.9 14.5 48.4 13.9 47.9C13.3 47.5 12.6 46.9 12.3 46.6C12.1 46.4 11.5 46.1 11.1 45.9C10.7 45.8 10.1 45.5 9.7 45.3C9.3 45.0 8.5 44.6 8.0 44.4C6.8 43.8 6.9 43.8 5.1 41.0C4.8 40.5 4.5 40.3 3.9 39.9C2.9 39.4 2.9 39.2 3.3 38.5C3.5 38.2 3.7 37.7 3.8 37.0C3.9 36.4 4.3 35.3 4.6 34.5C5.7 31.7 6.5 31.3 10.4 31.2C11.7 31.2 12.2 31.1 12.7 30.9C13.4 30.7 18.3 29.7 20.2 29.5C20.7 29.4 21.5 29.2 22.0 29.0C22.5 28.8 23.3 28.6 23.8 28.4C24.4 28.3 24.9 28.1 25.3 27.8C26.1 27.3 27.0 26.9 28.0 26.7C28.4 26.6 29.0 26.3 29.3 26.2C30.0 25.8 31.1 25.6 31.7 25.7C31.9 25.8 32.3 26.0 32.7 26.3C34.0 27.5 34.4 27.8 35.0 28.1C36.1 28.5 36.0 28.4 37.5 30.4C38.0 31.1 38.1 32.1 38.1 35.1C38.1 37.1 38.2 38.1 38.3 38.6C38.4 39.0 38.5 39.6 38.5 39.9C38.5 40.2 38.6 41.0 38.7 41.7C38.8 42.3 39.1 43.7 39.2 44.7C39.3 45.7 39.6 47.3 39.8 48.2C40.5 50.9 40.8 52.7 40.8 54.4C40.8 56.8 40.3 57.8 38.7 59.4C37.6 60.5 36.8 60.9 34.9 61.5C34.0 61.8 33.3 61.9 32.4 62.0C31.7 62.0 31.1 62.0 31.1 61.9ZM49.4 49.9C48.7 49.7 46.9 48.6 46.4 48.0C45.6 47.1 45.5 46.3 45.8 45.0C46.2 43.7 46.5 43.1 47.2 42.7C47.7 42.3 47.9 42.1 48.2 41.5C48.6 40.7 49.6 39.6 50.3 39.3C50.8 39.0 52.2 39.0 52.7 39.2C52.8 39.3 53.5 39.5 54.1 39.5C54.7 39.5 55.4 39.6 55.6 39.7C55.9 39.7 56.0 39.7 56.4 39.4C57.1 38.8 58.0 38.6 59.3 38.9C60.6 39.2 61.0 39.9 61.1 42.3C61.1 43.8 61.1 44.0 60.9 44.5C60.5 45.4 59.2 46.9 58.2 47.6C57.8 47.9 57.0 48.4 56.6 48.7C55.7 49.2 54.8 49.7 53.9 49.9C52.9 50.1 50.0 50.1 49.4 49.9ZM49.5 31.9C49.3 31.8 48.7 31.4 48.3 31.0C47.9 30.6 47.5 30.3 47.4 30.3C47.3 30.3 47.0 30.4 46.7 30.5C45.9 30.7 45.4 30.6 44.8 29.9C44.3 29.3 44.1 28.7 44.1 28.1C44.1 27.5 44.3 26.3 44.6 25.6C44.8 25.2 45.0 24.6 45.0 24.3C45.2 23.4 46.8 20.7 47.3 20.3C47.6 20.0 48.0 19.7 48.3 19.4C49.6 18.3 50.7 17.6 51.8 17.3C52.4 17.1 53.5 16.7 54.3 16.4C55.5 15.9 55.8 15.9 56.3 15.9C57.5 16.0 59.2 17.1 59.7 18.1C60.5 19.7 60.6 21.5 60.1 22.6C60.0 23.0 59.7 23.7 59.6 24.2C59.2 25.7 58.0 27.5 56.9 28.1C55.6 29.0 53.4 30.5 52.7 31.0C51.9 31.6 50.9 32.1 50.2 32.1C50.0 32.1 49.7 32.0 49.5 31.9ZM15.5 23.3C15.4 23.2 15.2 22.9 15.1 22.5C14.9 22.1 14.6 21.6 14.5 21.3C14.3 21.1 13.9 20.4 13.6 19.9C13.4 19.4 13.0 18.6 12.8 18.3C12.1 17.1 11.7 15.5 11.6 14.5C11.6 13.6 11.7 13.5 12.1 12.4C12.4 11.8 12.9 10.8 13.3 10.2C13.7 9.7 14.1 8.9 14.2 8.5C14.5 7.8 14.6 7.7 15.7 7.2C16.1 7.1 16.7 6.7 17.0 6.5C17.3 6.2 17.6 6.0 17.7 6.0C17.9 6.0 20.2 6.8 21.6 7.3C22.1 7.5 22.2 7.8 22.3 9.4C22.4 10.2 22.6 11.4 22.7 12.1C22.9 13.4 22.9 14.4 22.3 17.8C22.2 18.7 22.0 19.7 22.0 20.0C22.0 20.6 21.7 21.2 21.2 21.6C20.6 22.0 19.4 22.3 18.5 22.3C17.4 22.3 16.9 22.5 16.5 23.0C16.1 23.4 15.8 23.5 15.5 23.3ZM33.0 18.4C32.5 18.2 31.9 18.0 31.8 17.8C31.2 17.2 30.3 15.7 30.0 14.9C29.6 13.6 29.7 12.8 30.4 11.5C30.7 10.8 31.1 9.9 31.3 9.3C31.4 8.7 31.8 7.9 32.0 7.6C32.2 7.2 32.5 6.4 32.7 5.8C32.9 5.0 33.1 4.7 33.4 4.4C34.1 3.7 34.6 3.4 35.4 3.3C35.9 3.2 36.6 2.9 37.4 2.6C38.5 2.0 38.5 2.0 39.8 2.0C41.0 2.0 41.1 2.0 41.7 2.4C42.4 2.8 43.0 3.7 43.0 4.3C43.0 4.5 43.1 5.0 43.3 5.4C43.4 5.8 43.6 6.4 43.7 6.9C43.9 7.6 43.9 7.8 43.6 9.1C43.4 9.9 43.2 10.9 43.0 11.2C42.9 11.6 42.7 12.2 42.7 12.6C42.6 13.0 42.5 13.5 42.4 13.7C42.3 13.8 41.7 14.4 41.0 15.0C40.4 15.5 39.3 16.5 38.6 17.2C37.3 18.5 37.3 18.5 36.5 18.6C35.3 18.8 34.1 18.8 33.0 18.4Z"/></g></svg>'
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
    t.innerHTML = '<span class="ico">' + PAW + '</span>' + msg.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
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
        D.toast('Good dog! Lead with Love');
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
      <p class="check-done"><span class="ico">${ICONS.paw}</span>All set! Your dog is going to have a lovely visit.</p>`;
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
