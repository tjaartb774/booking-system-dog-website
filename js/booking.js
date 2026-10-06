/* Beyond the Leash - booking wizard. Builds a WhatsApp message and opens
   wa.me with it. State is kept in sessionStorage so a refresh keeps it. */
(function () {
  'use strict';
  const D = window.BTL;
  const root = document.getElementById('wizard');
  if (!root) return;
  const KEY = 'btl-booking';
  const I = D.icons;
  const $ = (s, r) => (r || root).querySelector(s);
  const $$ = (s, r) => Array.from((r || root).querySelectorAll(s));

  const STEPS = [
    { id: 'dog', label: 'Your dog', icon: 'dog' },
    { id: 'service', label: 'Service', icon: 'scissors' },
    { id: 'when', label: 'When', icon: 'calendar' },
    { id: 'about', label: 'Tell us more', icon: 'info' },
    { id: 'you', label: 'You', icon: 'user' },
    { id: 'send', label: 'Send', icon: 'send' }
  ];
  const FLAGS = [
    { id: 'bitten', text: 'Has previously bitten or attempted to bite' },
    { id: 'nervous', text: 'Is nervous, reactive or has known triggers' },
    { id: 'handling', text: 'Dislikes particular areas being handled' },
    { id: 'badexp', text: 'Has had a difficult grooming experience before' },
    { id: 'medical', text: 'Has a medical condition, injury, allergy or skin problem' },
    { id: 'senior', text: 'Is a senior dog' },
    { id: 'mats', text: 'Has knots or matting right now' },
    { id: 'parasites', text: 'May have fleas or ticks right now' },
    { id: 'puppy', text: 'Is a puppy (we will ask about vaccinations)' }
  ];

  let state = load();
  let step = 0;

  function load() {
    const base = { dogName: '', breed: '', size: '', age: '', service: '', date: '', slot: '', altDate: '', flags: {}, notes: '', name: '', phone: '', agree: false, photos: false };
    try { return Object.assign(base, JSON.parse(sessionStorage.getItem(KEY) || '{}')); } catch (e) { return base; }
  }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const dog = () => state.dogName.trim() || 'your dog';
  const serviceObj = () => D.services.find(s => s.id === state.service);
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const fmtDate = iso => {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  /* ---------- Rendering ---------- */
  function shell() {
    root.innerHTML =
      '<div class="steps" aria-hidden="true"><div class="line"></div>' +
      STEPS.map(s => '<div class="step-dot" data-step="' + s.id + '" title="' + s.label + '">' + I[s.icon] + '</div>').join('') +
      '</div>' +
      STEPS.map(s => '<div class="panel" data-panel="' + s.id + '"></div>').join('');
  }

  function field(id, label, input, opts) {
    opts = opts || {};
    return '<div class="field" data-field="' + id + '">' +
      '<label for="f-' + id + '">' + label + (opts.optional ? ' <span class="opt">(optional)</span>' : '') + '</label>' +
      input + '<div class="error">' + (opts.error || 'Please fill this in') + '</div></div>';
  }
  const text = (id, ph, type) => '<input type="' + (type || 'text') + '" id="f-' + id + '" data-bind="' + id + '" placeholder="' + ph + '" value="' + esc(state[id]) + '" autocomplete="off">';

  function panels() {
    $('[data-panel="dog"]').innerHTML =
      '<p class="step-label">Step 1 of 6</p><h3>Tell us about your dog</h3>' +
      '<div class="row-2">' +
      field('dogName', 'Dog\'s name', text('dogName', 'e.g. Bella')) +
      field('breed', 'Breed or mix', text('breed', 'e.g. Spaniel cross'), { optional: true }) +
      '</div>' +
      '<div class="field" data-field="size"><label>Size</label><div class="chips">' +
      ['Small', 'Medium', 'Large', 'Giant'].map(s => '<button type="button" class="chip" data-chip="size" data-value="' + s + '" aria-pressed="' + (state.size === s) + '">' + s + '</button>').join('') +
      '</div><div class="error">Pick a size</div></div>' +
      '<div class="field" data-field="age"><label>Age <span class="opt">(optional)</span></label><div class="chips">' +
      ['Puppy', 'Adult', 'Senior'].map(s => '<button type="button" class="chip" data-chip="age" data-value="' + s + '" aria-pressed="' + (state.age === s) + '">' + s + '</button>').join('') +
      '</div></div>';

    $('[data-panel="service"]').innerHTML =
      '<p class="step-label">Step 2 of 6</p><h3>What does ' + esc(dog()) + ' need?</h3>' +
      '<div class="field" data-field="service"><div class="service-pick">' +
      D.services.map(s => '<button type="button" class="option" data-service-pick="' + s.id + '" aria-pressed="' + (state.service === s.id) + '"><b>' + s.name + '</b><small>' + s.blurb + '</small></button>').join('') +
      '</div><div class="error">Choose a service, or pick the closest and tell us more later</div></div>' +
      '<p style="color:var(--muted);font-size:.9rem">Not sure? Try the <a href="#finder">Groom Finder</a> or just pick the closest option. We will confirm with you.</p>';

    $('[data-panel="when"]').innerHTML =
      '<p class="step-label">Step 3 of 6</p><h3>When suits you?</h3>' +
      '<div class="row-2">' +
      field('date', 'Preferred date', '<input type="date" id="f-date" data-bind="date" min="' + todayISO() + '" value="' + esc(state.date) + '">', { error: 'Pick a date from today onwards' }) +
      field('altDate', 'Backup date', '<input type="date" id="f-altDate" data-bind="altDate" min="' + todayISO() + '" value="' + esc(state.altDate) + '">', { optional: true }) +
      '</div>' +
      '<div class="field" data-field="slot"><label>Preferred time</label><div class="chips">' +
      D.timeSlots.map(s => '<button type="button" class="chip" data-chip="slot" data-value="' + s + '" aria-pressed="' + (state.slot === s) + '">' + s + '</button>').join('') +
      '</div><div class="error">Pick a time of day</div></div>' +
      '<p style="color:var(--muted);font-size:.9rem">Appointment times are reserved for ' + esc(dog()) + ', so please give 24 hours\' notice if plans change.</p>';

    $('[data-panel="about"]').innerHTML =
      '<p class="step-label">Step 4 of 6</p><h3>Anything we should know about ' + esc(dog()) + '?</h3>' +
      '<p style="color:var(--muted)">Ticking these never means we will refuse your dog. It helps us prepare so the visit is safer and calmer.</p>' +
      '<div class="toggles">' +
      FLAGS.map(f => '<label class="toggle ' + (state.flags[f.id] ? 'on' : '') + '"><input type="checkbox" data-flag="' + f.id + '" ' + (state.flags[f.id] ? 'checked' : '') + '><span>' + f.text + '</span></label>').join('') +
      '</div><br>' +
      field('notes', 'Anything else', '<textarea id="f-notes" data-bind="notes" rows="3" placeholder="Medication, past grooms, what helps ' + esc(dog()) + ' feel safe...">' + esc(state.notes) + '</textarea>', { optional: true });

    $('[data-panel="you"]').innerHTML =
      '<p class="step-label">Step 5 of 6</p><h3>And you?</h3>' +
      '<div class="row-2">' +
      field('name', 'Your name', text('name', 'e.g. Anna')) +
      field('phone', 'Your phone number', text('phone', 'e.g. 082 123 4567', 'tel'), { error: 'Please enter a phone number we can reach you on' }) +
      '</div>' +
      '<div class="field" data-field="agree"><label class="toggle ' + (state.agree ? 'on' : '') + '"><input type="checkbox" data-bind-check="agree" ' + (state.agree ? 'checked' : '') + '><span class="agree">I have read and agree to the <a href="terms.html" target="_blank" rel="noopener">Booking Policy &amp; Terms</a>, including the force-free approach.</span></label>' +
      '<div class="error">Please read and accept the Booking Policy &amp; Terms to continue</div></div>' +
      '<div class="field"><label class="toggle ' + (state.photos ? 'on' : '') + '"><input type="checkbox" data-bind-check="photos" ' + (state.photos ? 'checked' : '') + '><span class="agree">You may share photos of ' + esc(dog()) + ' on social media <span class="opt">(optional, never affects care)</span></span></label></div>';

    $('[data-panel="send"]').innerHTML = ''; // built on demand
  }

  function buildSummary() {
    const s = serviceObj();
    const flags = FLAGS.filter(f => state.flags[f.id]).map(f => f.text);
    const rows = [
      ['Dog', state.dogName + (state.breed ? ' (' + state.breed + ')' : '') + (state.size ? ', ' + state.size.toLowerCase() : '') + (state.age ? ', ' + state.age.toLowerCase() : '')],
      ['Service', s ? s.name : ''],
      ['Date', fmtDate(state.date) + (state.slot ? ', ' + state.slot.toLowerCase() : '') + (state.altDate ? ' (backup: ' + fmtDate(state.altDate) + ')' : '')],
      ['Good to know', flags.length ? flags.join('; ') : 'Nothing flagged'],
      ['Notes', state.notes.trim() || 'None'],
      ['Owner', state.name + ', ' + state.phone],
      ['Photos', state.photos ? 'Yes, happy to be featured' : 'No thanks']
    ];
    return rows;
  }

  function buildMessage() {
    const s = serviceObj();
    const flags = FLAGS.filter(f => state.flags[f.id]).map(f => '• ' + f.text);
    const lines = [
      'Hi Beyond the Leash! I would like to book a groom.',
      '',
      '🐶 Dog: ' + state.dogName + (state.breed ? ' (' + state.breed + ')' : ''),
      '📏 Size: ' + (state.size || '-') + (state.age ? ' · ' + state.age : ''),
      '✂️ Service: ' + (s ? s.name : '-'),
      '📅 Preferred: ' + fmtDate(state.date) + (state.slot ? ' · ' + state.slot : ''),
    ];
    if (state.altDate) lines.push('📅 Backup: ' + fmtDate(state.altDate));
    lines.push('');
    lines.push('ℹ️ Good to know:');
    if (flags.length) lines.push.apply(lines, flags); else lines.push('• Nothing to flag');
    if (state.notes.trim()) { lines.push(''); lines.push('📝 Notes: ' + state.notes.trim()); }
    lines.push('');
    lines.push('👤 Owner: ' + state.name + ' · ' + state.phone);
    lines.push('📸 Photos on social media: ' + (state.photos ? 'Yes' : 'No'));
    lines.push('✅ I have read and agree to the Booking Policy & Terms.');
    lines.push('');
    lines.push('Sent from the Beyond the Leash website');
    return lines.join('\n');
  }

  function renderSend() {
    const msg = buildMessage();
    const url = D.waLink(msg);
    const mail = 'mailto:' + D.business.email + '?subject=' + encodeURIComponent('Booking request for ' + state.dogName) + '&body=' + encodeURIComponent(msg);
    $('[data-panel="send"]').innerHTML =
      '<p class="step-label">Step 6 of 6</p><h3>Ready to send, ' + esc(state.name.split(' ')[0] || 'friend') + '?</h3>' +
      '<div class="summary"><dl>' + buildSummary().map(r => '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>').join('') + '</dl></div>' +
      '<div class="send-row">' +
      '<a class="btn btn-wa" id="send-wa" href="' + url + '" target="_blank" rel="noopener">' + I.whatsapp + ' Send on WhatsApp</a>' +
      '<button type="button" class="btn btn-outline" id="copy-msg">Copy message</button>' +
      '<a class="btn btn-ghost" href="' + mail + '">Email instead</a>' +
      '</div>' +
      '<details class="preview-wrap"><summary>Preview the message</summary><pre class="preview" id="msg-preview">' + esc(msg) + '</pre></details>' +
      '<p style="color:var(--muted);font-size:.9rem;margin-top:1rem">WhatsApp opens with the message filled in. Just press send and we will reply to confirm a time and quote.</p>';
    $('#copy-msg').addEventListener('click', () => {
      const done = () => D.toast('Message copied');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(done, () => fallbackCopy(msg, done));
      else fallbackCopy(msg, done);
    });
    $('#send-wa').addEventListener('click', e => {
      D.confetti(e.clientX, e.clientY, 30);
      D.toast('Opening WhatsApp... see you soon! 💜');
    });
  }
  function fallbackCopy(txt, cb) {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) { D.toast('Could not copy, please select the preview'); }
    ta.remove();
  }

  function nav() {
    $$('.wizard-nav').forEach(n => n.remove());
    const panel = $$('.panel')[step];
    const n = document.createElement('div');
    n.className = 'wizard-nav';
    n.innerHTML =
      (step > 0 ? '<button type="button" class="btn btn-ghost" data-prev>← Back</button>' : '<span></span>') +
      (step < STEPS.length - 1 ? '<button type="button" class="btn btn-primary" data-next>' + (step === STEPS.length - 2 ? 'Review request' : 'Next') + ' →</button>' : '<button type="button" class="btn btn-ghost" data-reset>Start a new request</button>');
    panel.appendChild(n);
    const prev = $('[data-prev]'), next = $('[data-next]'), reset = $('[data-reset]');
    if (prev) prev.addEventListener('click', () => go(step - 1));
    if (next) next.addEventListener('click', () => { if (validate(step)) go(step + 1); });
    if (reset) reset.addEventListener('click', () => {
      state = { dogName: '', breed: '', size: '', age: '', service: '', date: '', slot: '', altDate: '', flags: {}, notes: '', name: '', phone: '', agree: false, photos: false };
      save(); panels(); go(0);
    });
  }

  function go(n) {
    step = Math.max(0, Math.min(STEPS.length - 1, n));
    if (step >= 1) { panels(); }      // re-render so the dog's name appears
    if (step === STEPS.length - 1) renderSend();
    $$('.panel').forEach((p, i) => p.classList.toggle('active', i === step));
    $$('.step-dot').forEach((d, i) => { d.classList.toggle('active', i === step); d.classList.toggle('done', i < step); });
    const line = $('.line');
    if (line) line.style.width = 'calc((100% - 40px) * ' + (step / (STEPS.length - 1)) + ')';
    nav();
    bind();
    if (n !== 0 || document.activeElement !== document.body) {
      const top = root.getBoundingClientRect().top + window.scrollY - 90;
      if (Math.abs(window.scrollY - top) > 120) window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  function validate(i) {
    let ok = true;
    const bad = (id, msg) => {
      const f = $('[data-field="' + id + '"]');
      if (!f) return;
      f.classList.add('invalid');
      if (msg) f.querySelector('.error').textContent = msg;
      if (ok) f.scrollIntoView({ block: 'center', behavior: 'smooth' });
      ok = false;
    };
    $$('.field').forEach(f => f.classList.remove('invalid'));
    const id = STEPS[i].id;
    if (id === 'dog') { if (!state.dogName.trim()) bad('dogName'); if (!state.size) bad('size'); }
    if (id === 'service' && !state.service) bad('service');
    if (id === 'when') {
      if (!state.date || state.date < todayISO()) bad('date');
      if (!state.slot) bad('slot');
    }
    if (id === 'you') {
      if (!state.name.trim()) bad('name');
      if (!/^\+?[\d\s()-]{8,}$/.test(state.phone.trim())) bad('phone');
      if (!state.agree) bad('agree');
    }
    if (!ok) D.toast('A few details are missing');
    return ok;
  }

  function bind() {
    $$('[data-bind]').forEach(el => {
      el.oninput = () => { state[el.dataset.bind] = el.value; save(); el.closest('.field').classList.remove('invalid'); };
    });
    $$('[data-bind-check]').forEach(el => {
      el.onchange = () => { state[el.dataset.bindCheck] = el.checked; save(); el.closest('.field').classList.remove('invalid'); };
    });
    $$('[data-chip]').forEach(el => {
      el.onclick = () => {
        state[el.dataset.chip] = el.dataset.value; save();
        $$('[data-chip="' + el.dataset.chip + '"]').forEach(c => c.setAttribute('aria-pressed', String(c === el)));
        el.closest('.field').classList.remove('invalid');
      };
    });
    $$('[data-service-pick]').forEach(el => {
      el.onclick = () => {
        state.service = el.dataset.servicePick; save();
        $$('[data-service-pick]').forEach(c => c.setAttribute('aria-pressed', String(c === el)));
        el.closest('.field').classList.remove('invalid');
      };
    });
    $$('[data-flag]').forEach(el => {
      el.onchange = () => { state.flags[el.dataset.flag] = el.checked; save(); };
    });
  }

  /* Preselect from "Book this" links (services grid, quiz) */
  document.addEventListener('btl:preselect', e => {
    state.service = e.detail.service; save();
    panels();
    go(state.dogName.trim() ? 1 : 0);
    D.toast((serviceObj() ? serviceObj().name : 'Service') + ' selected');
  });

  shell();
  panels();
  go(0);
})();
