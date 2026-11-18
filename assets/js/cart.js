/* Ofício — carrinho compartilhado (Home + Cardápio).
   Estado salvo no localStorage do navegador; finalização via WhatsApp. */
(function () {
  const { itens, config } = window.OFICIO;
  const KEY = 'oficio-cart-v1';
  const byId = Object.fromEntries(itens.map(i => [i.id, i]));
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  let state = { items: {}, form: { modo: 'entrega', nome: '', endereco: '', pagamento: 'Pix', obs: '' } };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.items) state = { items: saved.items, form: { ...state.form, ...saved.form } };
  } catch (e) { /* storage indisponível: segue só em memória */ }
  // descarta ids que não existem mais no cardápio
  Object.keys(state.items).forEach(id => { if (!byId[id] || state.items[id] < 1) delete state.items[id]; });

  const subs = new Set();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function emit(changedId) { save(); subs.forEach(fn => fn(changedId)); }

  const Cart = {
    brl,
    qty: id => state.items[id] || 0,
    count: () => Object.values(state.items).reduce((a, b) => a + b, 0),
    total: () => Object.entries(state.items).reduce((s, [id, q]) => s + byId[id].preco * q, 0),
    lines: () => Object.entries(state.items).map(([id, q]) => ({ item: byId[id], q })),
    set(id, q) {
      if (!byId[id]) return;
      q = Math.max(0, Math.min(99, q | 0));
      if (q) state.items[id] = q; else delete state.items[id];
      emit(id);
    },
    add(id) { Cart.set(id, Cart.qty(id) + 1); },
    subscribe(fn) { subs.add(fn); fn(); return () => subs.delete(fn); },
    form: state.form
  };
  window.Cart = Cart;

  /* ---------- UI do painel ---------- */
  const panel = document.querySelector('[data-cart]');
  if (!panel) return;
  const listEl = panel.querySelector('[data-cart-list]');
  const emptyEl = panel.querySelector('[data-cart-empty]');
  const formEl = panel.querySelector('[data-cart-form]');
  const countEls = document.querySelectorAll('[data-cart-count]');
  const totalEls = document.querySelectorAll('[data-cart-total]');
  const errEl = panel.querySelector('[data-cart-error]');
  const docked = panel.classList.contains('cart--docked');

  function render() {
    const lines = Cart.lines();
    listEl.innerHTML = lines.map(({ item, q }) => `
      <li class="ci">
        <h4 class="ci__name">${item.nome}</h4>
        <span class="ci__price">${brl(item.preco * q)}</span>
        <div class="ci__ctrl">
          <div class="stepper stepper--sm" role="group" aria-label="Quantidade de ${item.nome}">
            <button type="button" data-dec="${item.id}" aria-label="Diminuir">−</button>
            <output aria-live="polite">${q}</output>
            <button type="button" data-inc="${item.id}" aria-label="Aumentar">+</button>
          </div>
          <button type="button" class="ci__rm" data-rm="${item.id}">remover</button>
        </div>
      </li>`).join('');
    const has = lines.length > 0;
    emptyEl.hidden = has;
    formEl.hidden = !has;
    const n = Cart.count();
    countEls.forEach(el => { el.textContent = n; });
    totalEls.forEach(el => { el.textContent = brl(Cart.total()); });
    document.documentElement.classList.toggle('has-cart-items', has);
  }

  listEl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.inc) Cart.add(b.dataset.inc);
    if (b.dataset.dec) Cart.set(b.dataset.dec, Cart.qty(b.dataset.dec) - 1);
    if (b.dataset.rm) Cart.set(b.dataset.rm, 0);
  });

  /* formulário: restaura e persiste */
  const f = formEl;
  f.elements.modo.value = state.form.modo;
  f.elements.pagamento.value = state.form.pagamento;
  f.elements.nome.value = state.form.nome;
  f.elements.endereco.value = state.form.endereco;
  f.elements.obs.value = state.form.obs;
  function syncModo() {
    const entrega = f.elements.modo.value === 'entrega';
    panel.querySelector('[data-endereco]').hidden = !entrega;
    f.elements.endereco.required = entrega;
    panel.querySelector('[data-pag-label]').textContent = entrega ? 'Pagamento na entrega' : 'Pagamento na retirada';
  }
  syncModo();
  f.addEventListener('input', () => {
    Object.assign(state.form, {
      modo: f.elements.modo.value, pagamento: f.elements.pagamento.value,
      nome: f.elements.nome.value, endereco: f.elements.endereco.value, obs: f.elements.obs.value
    });
    syncModo(); save();
    if (errEl.textContent) errEl.textContent = '';
  });

  f.addEventListener('submit', e => {
    e.preventDefault();
    if (!Cart.count()) return;
    if (!f.checkValidity()) {
      const bad = f.querySelector(':invalid');
      errEl.textContent = bad && bad.name === 'endereco' ? 'Informe o endereço para a entrega.' : 'Informe seu nome para o pedido.';
      bad && bad.focus();
      return;
    }
    const s = state.form;
    const linhas = Cart.lines().map(({ item, q }) => `• ${q}x ${item.nome} — ${brl(item.preco * q)}`);
    const msg = [
      'Olá, Ofício! Quero fazer um pedido:', '', ...linhas, '',
      `*Total: ${brl(Cart.total())}*`, '',
      `Nome: ${s.nome.trim()}`,
      s.modo === 'entrega' ? `Entrega em: ${s.endereco.trim()}` : 'Vou retirar no balcão.',
      `Pagamento: ${s.pagamento}`,
      s.obs.trim() ? `Observações: ${s.obs.trim()}` : ''
    ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n').trim();
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  /* abrir / fechar (overlay no desktop da Home, bottom sheet no mobile) */
  const backdrop = document.querySelector('[data-cart-backdrop]');
  let lastFocus = null;
  function isOverlay() { return !docked || window.matchMedia('(max-width: 1099px)').matches; }
  function open() {
    if (!isOverlay()) { panel.querySelector('h2').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return; }
    lastFocus = document.activeElement;
    document.documentElement.classList.add('cart-open');
    panel.setAttribute('aria-hidden', 'false');
    setTimeout(() => panel.querySelector('[data-cart-close]').focus(), 50);
  }
  function close() {
    document.documentElement.classList.remove('cart-open');
    if (isOverlay()) panel.setAttribute('aria-hidden', 'true');
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  function syncAria() { panel.setAttribute('aria-hidden', isOverlay() && !document.documentElement.classList.contains('cart-open') ? 'true' : 'false'); }
  syncAria(); window.addEventListener('resize', syncAria);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); open(); }
    if (e.target.closest('[data-cart-close]')) close();
  });
  backdrop && backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.documentElement.classList.contains('cart-open')) close(); });

  Cart.subscribe(render);
  Cart.open = open;
})();
