/* Beyond the Leash - catalog page: brand and category filters, product grid
   with size/price options, basket kept in localStorage, WhatsApp order. */
(function () {
  'use strict';
  const D = window.BTL;
  const grid = document.getElementById('products-grid');
  if (!grid || !D.products) return;
  const I = D.icons;
  const KEY = 'btl-basket-v2';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const cur = D.shop.currency || 'R';
  const money = n => cur + (Number.isInteger(n) ? n.toLocaleString('en-ZA') : n.toFixed(2));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* basket is keyed by product id + variant label */
  let basket = {};
  try { basket = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { basket = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(basket)); } catch (e) { /* private mode */ } };
  const byId = id => D.products.find(p => p.id === id);
  const keyOf = (id, label) => id + '::' + label;
  const parseKey = k => { const i = k.indexOf('::'); return { id: k.slice(0, i), label: k.slice(i + 2) }; };
  const variantOf = (p, label) => (p.variants || []).find(v => v.label === label) || p.variants[0];
  const minPrice = p => Math.min.apply(null, p.variants.map(v => v.price));
  const maxPrice = p => Math.max.apply(null, p.variants.map(v => v.price));
  const chosen = {};   // product id -> chosen variant label on the card

  $$('[data-shop-note]').forEach(e => { e.textContent = D.shop.note || ''; });

  /* ---------- Filters ---------- */
  let brand = 'All', cat = 'All';
  const brandChips = $('#brand-chips'), catChips = $('#cat-chips');
  function chip(group, value, active) {
    return '<button type="button" class="chip" role="tab" aria-pressed="' + (value === active) + '" data-' + group + '="' + esc(value) + '">' + esc(value) + '</button>';
  }
  function renderChips() {
    brandChips.innerHTML = chip('brand', 'All', brand) + (D.shop.brands || []).map(b => chip('brand', b.name, brand)).join('');
    catChips.innerHTML = chip('cat', 'All', cat) + (D.shop.categories || []).map(c => chip('cat', c, cat)).join('');
    $$('[data-brand]', brandChips).forEach(b => b.addEventListener('click', () => { brand = b.dataset.brand; renderChips(); renderGrid(); }));
    $$('[data-cat]', catChips).forEach(b => b.addEventListener('click', () => { cat = b.dataset.cat; renderChips(); renderGrid(); }));
  }

  /* ---------- Product grid ---------- */
  function tile(p) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" referrerpolicy="no-referrer" data-fallback>';
    return placeholder();
  }
  function placeholder() { return '<div class="ph" aria-hidden="true">' + I.paw + '<span>Photo coming soon</span></div>'; }
  function wireFallbacks(root) {
    $$('img[data-fallback]', root).forEach(img => { img.addEventListener('error', () => { img.outerHTML = placeholder(); }, { once: true }); });
  }
  function priceLabel(p, label) {
    if (label) return money(variantOf(p, label).price);
    return minPrice(p) === maxPrice(p) ? money(minPrice(p)) : 'From ' + money(minPrice(p));
  }
  function renderGrid() {
    const list = D.products.filter(p => (brand === 'All' || p.brand === brand) && (cat === 'All' || p.category === cat));
    const brandInfo = (D.shop.brands || []).find(b => b.name === brand);
    $('#brand-intro').innerHTML = brandInfo ? '<p>' + esc(brandInfo.blurb) + ' <a href="' + esc(brandInfo.site) + '" target="_blank" rel="noopener">Visit ' + esc(brandInfo.name) + '</a></p>' : '';
    grid.innerHTML = list.length ? list.map(p => {
      const multi = p.variants.length > 1;
      const sel = chosen[p.id];
      return `
      <article class="card product" data-product="${esc(p.id)}">
        <div class="product-img">${tile(p)}</div>
        <span class="cat">${esc(p.brand)} · ${esc(p.category)}</span>
        <h3>${esc(p.name)}</h3>
        <p class="blurb">${esc(p.blurb || '')}</p>
        ${multi ? '<label class="variant"><span>Size / option</span><select data-variant="' + esc(p.id) + '"><option value="">Choose...</option>' + p.variants.map(v => '<option value="' + esc(v.label) + '"' + (sel === v.label ? ' selected' : '') + '>' + esc(v.label) + ' · ' + money(v.price) + '</option>').join('') + '</select></label>' : '<p class="size">' + esc(p.variants[0].label === 'Each' ? '' : p.variants[0].label) + '</p>'}
        <div class="product-foot">
          <b class="price" data-price="${esc(p.id)}">${priceLabel(p, sel)}</b>
          <button type="button" class="btn btn-primary btn-sm" data-add="${esc(p.id)}">Add to basket</button>
        </div>
      </article>`; }).join('') : '<p class="empty">Nothing in this group yet.</p>';
    wireFallbacks(grid);
    $$('[data-variant]', grid).forEach(s => s.addEventListener('change', () => {
      chosen[s.dataset.variant] = s.value || undefined;
      $('[data-price="' + s.dataset.variant + '"]').textContent = priceLabel(byId(s.dataset.variant), s.value || undefined);
    }));
    $$('[data-add]', grid).forEach(b => b.addEventListener('click', e => {
      const p = byId(b.dataset.add);
      let label = p.variants.length > 1 ? chosen[p.id] : p.variants[0].label;
      if (!label) {
        const s = $('[data-variant="' + p.id + '"]', grid);
        s.focus(); s.classList.add('shake'); setTimeout(() => s.classList.remove('shake'), 500);
        if (D.toast) D.toast('Choose a size first');
        return;
      }
      add(keyOf(p.id, label));
      if (D.confetti) D.confetti(e.clientX, e.clientY, 10);
    }));
  }

  /* ---------- Basket ---------- */
  function add(k, n) {
    basket[k] = (basket[k] || 0) + (n || 1);
    if (basket[k] <= 0) delete basket[k];
    save(); renderBasket();
    if (n === undefined && D.toast) { const { id, label } = parseKey(k); D.toast(byId(id).name + (label !== 'Each' ? ' (' + label + ')' : '') + ' added'); }
  }
  function lines() {
    return Object.keys(basket).map(k => { const { id, label } = parseKey(k); const p = byId(id); if (!p) return null; const v = variantOf(p, label); return { k, p, label, qty: basket[k], unit: v.price, total: v.price * basket[k] }; }).filter(Boolean);
  }
  function count() { return Object.values(basket).reduce((a, b) => a + b, 0); }
  function total() { return lines().reduce((t, l) => t + l.total, 0); }

  function message() {
    const out = ['Hi Beyond the Leash! I would like to order:', ''];
    lines().forEach(l => out.push('- ' + l.qty + ' x ' + l.p.name + (l.label !== 'Each' ? ' (' + l.label + ')' : '') + ' by ' + l.p.brand + ' = ' + money(l.total)));
    out.push('', 'Total: ' + money(total()), '', 'Please let me know about collection or delivery and how to pay.', '', 'Sent from the Beyond the Leash website');
    return out.join('\n');
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
      box.innerHTML = lines().map(l => `
        <div class="line">
          <div class="line-img">${tile(l.p)}</div>
          <div class="line-info"><b>${esc(l.p.name)}</b><small>${esc(l.p.brand)}${l.label !== 'Each' ? ' · ' + esc(l.label) : ''} · ${money(l.unit)} each</small></div>
          <div class="qty">
            <button type="button" data-dec="${esc(l.k)}" aria-label="One less">−</button>
            <span>${l.qty}</span>
            <button type="button" data-inc="${esc(l.k)}" aria-label="One more">+</button>
          </div>
          <b class="line-total">${money(l.total)}</b>
        </div>`).join('');
      wireFallbacks(box);
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
  $('#clear-basket').addEventListener('click', () => { basket = {}; save(); renderBasket(); });
  $('#order-wa').addEventListener('click', e => {
    if (count() === 0) { e.preventDefault(); if (D.toast) D.toast('Your basket is empty'); return; }
    if (D.toast) D.toast('Opening WhatsApp with your order');
  });

  renderChips();
  renderGrid();
  renderBasket();
})();
