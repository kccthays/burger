/* Ofício — comportamento comum às páginas */
(function () {
  const { config } = window.OFICIO;
  const root = document.documentElement;

  /* dados de contato (provisórios) vindos de data.js */
  document.querySelectorAll('[data-tel]').forEach(a => { a.textContent = config.telefone; a.href = 'tel:+' + config.whatsapp; });
  document.querySelectorAll('[data-email]').forEach(a => { a.textContent = config.email; a.href = 'mailto:' + config.email; });
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = 'https://wa.me/' + config.whatsapp; });
  document.querySelectorAll('[data-insta]').forEach(a => { a.href = 'https://instagram.com/' + config.instagram; });
  document.querySelectorAll('[data-endereco]').forEach(el => { if (el.tagName !== 'DIV') el.textContent = config.endereco; });
  document.querySelectorAll('[data-bairro]').forEach(el => { el.textContent = config.bairro; });

  /* menu móvel */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    const set = open => {
      root.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', () => set(!root.classList.contains('menu-open')));
    menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  /* botões "+" fora do cardápio (destaques da Home) */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b || !window.Cart) return;
    window.Cart.add(b.dataset.add);
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  });

  /* contadores do carrinho com pequeno "pulo" */
  if (window.Cart) {
    let last = window.Cart.count();
    window.Cart.subscribe(() => {
      const n = window.Cart.count();
      if (n > last) document.querySelectorAll('.cartpill__n').forEach(el => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); });
      last = n;
    });
  }
})();
