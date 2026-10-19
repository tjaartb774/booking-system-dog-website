/* Beyond the Leash - catalog page: product grid, category filter, basket
   kept in localStorage, and a WhatsApp order message. */
(function () {
  'use strict';
  const D = window.BTL;
  const grid = document.getElementById('products-grid');
  if (!grid || !D.products) return;
  const I = D.icons;
  const KEY = 'btl-basket';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const cur = D.shop.currency || 'R';
  const money = n => cur + Math.round(n).toLocaleString('en-ZA');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let basket = {};
  try { basket = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { basket = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(basket)); } catch (e) { /* private mode */ } };
  const byId = id => D.products.find(p => p.id === id);

  $$('[data-shop-note]').forEach(e => { e.textContent = D.shop.note || ''; });

  /* ---------- Category chips ---------- */
  let active = 'All';
  const chips = $('#cat-chips');
  function renderChips() {
    chips.innerHTML = ['All'].concat(D.shop.categories).map(c =>
      '<button type="button" class="chip" role="tab" aria-pressed="' + (c === active) + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>').join('');
    $$('[data-cat]', chips).forEach(b => b.addEventListener('click', () => { active = b.dataset.cat; renderChips(); renderGrid(); }));
  }

  /* ---------- Product grid ---------- */
  function tile(p) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">';
    return '<div class="ph" aria-hidden="true">' + I.paw + '<span>Photo coming soon</span></div>';
  }
  function renderGrid() {
    const list = D.products.filter(p => active === 'All' || p.category === active);
    grid.innerHTML = list.map(p => `
      <article class="card product" data-product="${esc(p.id)}">
        <div class="product-img">${tile(p)}</div>
        <span class="cat">${esc(p.category)}</span>
        <h3>${esc(p.name)}</h3>
        <p class="size">${esc(p.size || '')}</p>
        <p class="blurb">${esc(p.blurb || '')}</p>
        <div class="product-foot">
          <b class="price">${money(p.price)}</b>
          <button type="button" class="btn btn-primary btn-sm" data-add="${esc(p.id)}">${basket[p.id] ? 'Add another' : 'Add to basket'}</button>
        </div>
      </article>`).join('');
    $$('[data-add]', grid).forEach(b => b.addEventListener('click', e => {
      add(b.dataset.add);
      if (D.confetti) D.confetti(e.clientX, e.clientY, 10);
      b.textContent = 'Add another';
    }));
  }

  /* ---------- Basket ---------- */
  function add(id, n) { basket[id] = (basket[id] || 0) + (n || 1); if (basket[id] <= 0) delete basket[id]; save(); renderBasket(); if (n === undefined && D.toast) D.toast(byId(id).name + ' added'); }
  function count() { return Object.values(basket).reduce((a, b) => a + b, 0); }
  function total() { return Object.keys(basket).reduce((t, id) => t + (byId(id) ? byId(id).price * basket[id] : 0), 0); }

  function message() {
    const lines = ['Hi Beyond the Leash! I would like to order:', ''];
    Object.keys(basket).forEach(id => { const p = byId(id); if (p) lines.push('- ' + basket[id] + ' x ' + p.name + (p.size ? ' (' + p.size + ')' : '') + ' = ' + money(p.price * basket[id])); });
    lines.push('', 'Total: ' + money(total()), '', 'Please let me know about collection or delivery and how to pay.', '', 'Sent from the Beyond the Leash website');
    return lines.join('\n');
  }

  function renderBasket() {
    const n = count(), t = total();
    $$('[data-basket-count]').forEach(e => { e.textContent = n; });
    $$('[data-basket-total]').forEach(e => { e.textContent = money(t); });
    const bar = $('.basket-bar'); if (bar) bar.hidden = n === 0;
    const box = $('#basket-lines');
    if (n === 0) {
      box.innerHTML = '<p class="empty">Your basket is empty. Add something your floof will love.</p>';
    } else {
      box.innerHTML = Object.keys(basket).map(id => { const p = byId(id); if (!p) return ''; return `
        <div class="line" data-line="${esc(id)}">
          <div class="line-img">${tile(p)}</div>
          <div class="line-info"><b>${esc(p.name)}</b><small>${esc(p.size || '')} · ${money(p.price)} each</small></div>
          <div class="qty">
            <button type="button" data-dec="${esc(id)}" aria-label="One less">−</button>
            <span>${basket[id]}</span>
            <button type="button" data-inc="${esc(id)}" aria-label="One more">+</button>
          </div>
          <b class="line-total">${money(p.price * basket[id])}</b>
        </div>`; }).join('');
      $$('[data-inc]', box).forEach(b => b.addEventListener('click', () => add(b.dataset.inc, 1)));
      $$('[data-dec]', box).forEach(b => b.addEventListener('click', () => add(b.dataset.dec, -1)));
    }
    const order = $('#order-wa');
    order.href = D.waLink(message());
    order.classList.toggle('disabled', n === 0);
    order.setAttribute('aria-disabled', String(n === 0));
  }

  /* ---------- Drawer ---------- */
  const drawer = $('#basket'), backdrop = $('.drawer-backdrop');
  function openBasket() { drawer.hidden = false; backdrop.hidden = false; requestAnimationFrame(() => { drawer.classList.add('open'); backdrop.classList.add('open'); }); document.body.style.overflow = 'hidden'; }
  function closeBasket() { drawer.classList.remove('open'); backdrop.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => { drawer.hidden = true; backdrop.hidden = true; }, 300); }
  $$('[data-open-basket]').forEach(b => b.addEventListener('click', openBasket));
  $$('[data-close-basket]').forEach(b => b.addEventListener('click', closeBasket));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeBasket(); });
  $('#clear-basket').addEventListener('click', () => { basket = {}; save(); renderBasket(); renderGrid(); });
  $('#order-wa').addEventListener('click', e => {
    if (count() === 0) { e.preventDefault(); if (D.toast) D.toast('Your basket is empty'); return; }
    if (D.toast) D.toast('Opening WhatsApp with your order');
  });

  renderChips();
  renderGrid();
  renderBasket();
})();
