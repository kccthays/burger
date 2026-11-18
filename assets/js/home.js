/* Ofício — Home: hero montado pelo scroll, história, destaques, horário */
(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (reduced || !hasGsap) root.classList.add('reduced');

  const hero = document.querySelector('[data-hero]');
  const stage = hero.querySelector('[data-stage]');
  const plate = hero.querySelector('[data-plate]');
  const giant = hero.querySelector('[data-giant]');
  const ings = [...stage.querySelectorAll('[data-ing]')];
  const tags = [...stage.querySelectorAll('[data-tag]')];
  const steps = [...hero.querySelectorAll('[data-progress] li')];
  const counter = hero.querySelector('[data-counter]');
  const caption = hero.querySelector('[data-caption]');
  const header = document.querySelector('[data-header]');
  const CAPTIONS = [
    'Pão de baixo, tostado na manteiga',
    'Alface americana, colhida no dia',
    'Blend 180g, moído toda manhã',
    'Cheddar inglês, maturado 12 meses',
    'Bacon defumado na casa por 6h',
    'Tomate maduro, fatia grossa',
    'Brioche com gergelim tostado'
  ];

  /* ---------- escala do palco do burger ---------- */
  function fitStage() {
    const vw = window.innerWidth, vh = hero.clientHeight;
    let s;
    if (vw < 700) s = Math.min((vw * 0.84) / 560, (vh * 0.47) / 560);
    else if (vw < 1100) s = Math.min(1, (vw * 0.72) / 560, (vh * 0.42) / 560);
    else s = Math.min(1, (vh - 110) / 680, (vw / 2 - 56 - 340 - 28) / 280);
    stage.style.setProperty('--s', s.toFixed(3));
    // legenda (telas menores) logo abaixo do prato
    const r = stage.getBoundingClientRect(), hr = hero.getBoundingClientRect();
    const plateBottom = (r.top - hr.top) + (735 / 760) * r.height;
    caption.style.top = Math.round(plateBottom + 14) + 'px';
    caption.style.bottom = 'auto';
  }
  fitStage();

  function setStep(n) { // n = quantidade de camadas montadas (1..7)
    steps.forEach((li, i) => li.classList.toggle('on', i < n));
    counter.firstChild.nodeValue = String(n);
    caption.textContent = CAPTIONS[Math.max(0, n - 1)];
    const done = n >= 7, building = n > 1 && !done;
    hero.classList.toggle('is-building', building);
    if (done !== hero.classList.contains('is-done')) {
      hero.classList.toggle('is-done', done);
      hero.querySelector('.hero__state--b').setAttribute('aria-hidden', !done);
      hero.querySelector('.hero__state--b .btn').tabIndex = done ? 0 : -1;
    }
    const aHidden = done || building;
    hero.querySelector('.hero__state--a').setAttribute('aria-hidden', aHidden);
    hero.querySelector('.hero__state--a .btn').tabIndex = aHidden ? -1 : 0;
  }

  /* ---------- cabeçalho: transparente no hero, sólido depois ---------- */
  const firstAfterHero = document.querySelector('#historia');
  function headerState() {
    const solid = firstAfterHero.getBoundingClientRect().top <= header.offsetHeight;
    header.classList.toggle('is-solid', solid);
  }
  window.addEventListener('scroll', headerState, { passive: true });
  headerState();

  /* ---------- horário de funcionamento ---------- */
  (function hours() {
    const { horarios } = window.OFICIO.config;
    const nomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const fmt = h => (h === 24 ? '00h' : h + 'h');
    // agora em São Paulo
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find(p => p.type === 'weekday').value);
    const hh = +parts.find(p => p.type === 'hour').value % 24 + (+parts.find(p => p.type === 'minute').value) / 60;
    // agrupa ter–qui como no design
    const rows = [[1], [2, 3, 4], [5], [6], [0]];
    document.querySelector('[data-hours]').innerHTML = rows.map(days => {
      const h = horarios[days[0]];
      const label = days.length > 1 ? `${nomes[days[0]]} a ${nomes[days[days.length - 1]].toLowerCase()}` : nomes[days[0]];
      const today = days.includes(wd);
      return `<li class="${today ? 'today' : ''}"><span>${label}${today ? ' (hoje)' : ''}</span><span>${h ? fmt(h[0]) + ' – ' + fmt(h[1]) : 'Fechado'}</span></li>`;
    }).join('');
    const h = horarios[wd];
    const st = document.querySelector('[data-status]');
    if (h && hh >= h[0] && hh < h[1]) {
      st.textContent = `Aberto agora · fecha às ${fmt(h[1])}`; st.classList.add('is-open');
    } else {
      // próxima abertura
      let next = '';
      for (let i = 0; i < 7; i++) {
        const d = (wd + i) % 7, hd = horarios[d];
        if (hd && (i > 0 || hh < hd[0])) { next = i === 0 ? `hoje às ${fmt(hd[0])}` : i === 1 ? `amanhã às ${fmt(hd[0])}` : `${nomes[d].toLowerCase()} às ${fmt(hd[0])}`; break; }
      }
      st.textContent = `Fechado agora · abre ${next}`; st.classList.add('is-closed');
    }
  })();

  /* ---------- sem animação: mostra tudo montado ---------- */
  if (reduced || !hasGsap) {
    setStep(7);
    window.addEventListener('resize', fitStage);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- HERO ---------- */
  // distância de queda: do topo da tela até a posição final
  const dropFrom = el => -(parseFloat(el.style.top) + el.offsetHeight + 120) - window.innerHeight * 0.4 / (parseFloat(getComputedStyle(stage).getPropertyValue('--s')) || 1);
  gsap.set(ings.slice(1), { y: (i, el) => dropFrom(el), rotation: i => (i % 2 ? -10 : 8), opacity: 1 });
  tags.forEach(t => {
    gsap.set(t.querySelector('.tag__line'), { scaleX: 0 });
    gsap.set(t.querySelector('.tag__dot'), { scale: 0 });
    gsap.set([...t.children].filter(c => !c.matches('i')), { opacity: 0, y: 8 });
  });

  // intro: prato e pão de baixo chegam sozinhos
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from(giant, { yPercent: 20, opacity: 0, duration: 1.2 }, 0)
       .from(plate, { scale: .55, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, .1)
       .from(ings[0], { y: -window.innerHeight, rotation: 6, duration: .9, ease: 'bounce.out' }, .35)
       .from('.hero__state--a > *', { y: 24, opacity: 0, stagger: .08, duration: .8 }, .3)
       .from('.hero__progress li, .hero__count, .hero__hint', { opacity: 0, x: 12, stagger: .04, duration: .6 }, .6);
  setStep(1);

  // scroll: cada ingrediente cai e a ficha técnica se desenha no pouso
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  const landAt = [0];
  ings.slice(1).forEach((el, k) => {
    const i = k + 1, at = k * 1.1;
    tl.to(el, { y: 0, duration: 1, ease: 'power2.in' }, at)
      .to(el, { rotation: 0, duration: .9, ease: 'power1.out' }, at)
      .to(el, { y: -14, duration: .12, ease: 'power1.out' }, at + 1)       // quique
      .to(el, { y: 0, duration: .14, ease: 'power1.in' }, at + 1.12);
    landAt[i] = at + 1;
    const tag = tags.find(t => +t.dataset.tag === i);
    if (tag) {
      tl.to(tag.querySelector('.tag__line'), { scaleX: 1, duration: .35, ease: 'power2.out' }, at + 1)
        .to(tag.querySelector('.tag__dot'), { scale: 1, duration: .2, ease: 'back.out(3)' }, at + 1.25)
        .to([...tag.children].filter(c => !c.matches('i')), { opacity: 1, y: 0, stagger: .05, duration: .3 }, at + 1.1);
    }
  });
  tl.to({}, { duration: .8 }); // respiro com o burger montado
  tl.to(giant, { yPercent: -18, duration: tl.duration(), ease: 'none' }, 0);

  tl.eventCallback('onUpdate', () => {
    const t = tl.time();
    let n = 1; for (let i = 1; i < landAt.length; i++) if (t >= landAt[i] - .02) n = i + 1;
    setStep(n);
  });
  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 3.2),
    pin: true, scrub: .7, animation: tl, invalidateOnRefresh: true
  });

  /* ---------- HISTÓRIA: palavras acendem com o scroll ---------- */
  const words = document.querySelector('[data-words]');
  (function split(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) split(n);
    });
  })(words);
  gsap.to(words.querySelectorAll('.w'), {
    opacity: 1, stagger: .12, ease: 'none',
    scrollTrigger: { trigger: words, start: 'top 80%', end: 'bottom 45%', scrub: true }
  });

  /* ---------- DESTAQUES: scroll horizontal (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const sec = document.querySelector('[data-destaques]');
    const track = sec.querySelector('[data-track]');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + (dist() + window.innerHeight * .5), pin: true, scrub: .6, invalidateOnRefresh: true }
    });
    gsap.fromTo('[data-bar]', { scaleX: .15 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + (dist() + window.innerHeight * .5), scrub: true, invalidateOnRefresh: true }
    });
    gsap.from(track.querySelectorAll('.dish__pic'), {
      scale: .6, rotation: -20, opacity: 0, stagger: .12, duration: .9, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: sec, start: 'top 70%' }
    });
  });

  /* ---------- INSTAGRAM: faixa corre com o scroll ---------- */
  gsap.fromTo('[data-marquee]', { xPercent: 0 }, {
    xPercent: -28, ease: 'none',
    scrollTrigger: { trigger: '.insta', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.from('.insta__grid a', {
    yPercent: 30, opacity: 0, stagger: .06, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '.insta__grid', start: 'top 90%' }
  });

  /* ---------- RODAPÉ: palavra gigante desliza ---------- */
  gsap.fromTo('[data-footword]', { xPercent: 12 }, {
    xPercent: -4, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
  });

  /* ---------- resize ---------- */
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { fitStage(); ScrollTrigger.refresh(); }, 150);
  });
  window.addEventListener('load', () => { fitStage(); ScrollTrigger.refresh(); });
})();
