/* Ofício — Cardápio: lista, categorias fixas, botões de quantidade e burger que segue o cursor.
   Carregado ANTES de cart.js: renderiza o HTML; liga os botões quando o Cart existir. */
(function () {
  const { categorias, itens } = window.OFICIO;
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(',00', '');
  const menu = document.querySelector('[data-menu]');
  const cats = document.querySelector('[data-cats]');

  let n = 0;
  menu.innerHTML = categorias.map(c => {
    const list = itens.filter(i => i.cat === c.id);
    return `<section class="msec" id="${c.id}" aria-labelledby="t-${c.id}">
      <div class="msec__title"><h2 id="t-${c.id}">${c.nome}</h2><span>${String(list.length).padStart(2, '0')} itens</span></div>
      <ul>${list.map(i => `
        <li class="item" data-item="${i.id}" ${c.id === 'burgers' ? 'data-burger' : ''}>
          <span class="item__n">${String(++n).padStart(2, '0')}</span>
          <div><h3>${i.nome}${i.selo ? ` <span class="badge">${i.selo}</span>` : ''}</h3><p>${i.desc}</p></div>
          <span class="price">${brl(i.preco)}</span>
          <div class="item__act" data-act="${i.id}"></div>
        </li>`).join('')}
      </ul></section>`;
  }).join('');
  cats.innerHTML = categorias.map(c => `<a href="#${c.id}">${c.nome}<sup>${itens.filter(i => i.cat === c.id).length}</sup></a>`).join('');

  const byId = Object.fromEntries(itens.map(i => [i.id, i]));
  function renderAct(id) {
    const box = menu.querySelector(`[data-act="${id}"]`);
    const q = window.Cart.qty(id), nome = byId[id].nome;
    const isStepper = !!box.querySelector('.stepper');
    if (q > 0 && isStepper) { box.querySelector('output').textContent = q; return; }
    const hadFocus = box.contains(document.activeElement);
    box.innerHTML = q > 0
      ? `<div class="stepper" role="group" aria-label="Quantidade de ${nome}"><button type="button" data-minus aria-label="Diminuir ${nome}">−</button><output aria-live="polite">${q}</output><button type="button" data-plus aria-label="Aumentar ${nome}">+</button></div>`
      : `<button class="addbtn" type="button" data-plus aria-label="Adicionar ${nome} ao pedido">+</button>`;
    if (hadFocus) box.querySelector('[data-plus]').focus();
  }

  menu.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const id = b.closest('[data-act]').dataset.act;
    if (b.hasAttribute('data-plus')) window.Cart.add(id);
    if (b.hasAttribute('data-minus')) window.Cart.set(id, window.Cart.qty(id) - 1);
  });

  // cart.js é carregado em seguida; espera ele existir
  document.addEventListener('DOMContentLoaded', () => {
    window.Cart.subscribe(changed => {
      if (changed) renderAct(changed); else itens.forEach(i => renderAct(i.id));
    });
  });

  /* categoria ativa durante o scroll */
  const links = [...cats.querySelectorAll('a')];
  const secs = [...menu.querySelectorAll('.msec')];
  function activeCat() {
    const line = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 90) + 90;
    let cur = secs[0];
    secs.forEach(s => { if (s.getBoundingClientRect().top <= line) cur = s; });
    links.forEach(a => {
      const on = a.hash === '#' + cur.id;
      if (on && !a.classList.contains('on')) a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      a.classList.toggle('on', on);
      on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', activeCat, { passive: true });
  activeCat();

  /* burger que segue o cursor nos itens da categoria Burgers */
  const f = document.querySelector('[data-follower]');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!f || !fine || reduced || !window.gsap) return;
  gsap.set(f, { xPercent: -50, yPercent: -50 });
  const qx = gsap.quickTo(f, 'x', { duration: .45, ease: 'power3' });
  const qy = gsap.quickTo(f, 'y', { duration: .45, ease: 'power3' });
  const qr = gsap.quickTo(f, 'rotation', { duration: .6, ease: 'power3' });
  let lastX = 0, shown = false;
  window.addEventListener('mousemove', e => {
    qx(e.clientX + 150); qy(e.clientY - 40);
    qr(Math.max(-18, Math.min(18, (e.clientX - lastX) * .6)) - 6);
    lastX = e.clientX;
  });
  menu.addEventListener('mouseover', e => {
    const on = !!e.target.closest('[data-burger]');
    if (on === shown) return;
    shown = on;
    gsap.to(f, { opacity: on ? 1 : 0, scale: on ? 1 : .6, duration: .35, ease: on ? 'back.out(2)' : 'power2.in' });
  });
  menu.addEventListener('mouseleave', () => { shown = false; gsap.to(f, { opacity: 0, scale: .6, duration: .25 }); });
})();
