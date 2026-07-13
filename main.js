/* ============================================================
   BEAUFORT — interactions
   Progressive enhancement: the page reads fully without JS.
   Signature: an inline-SVG sea chart whose compass needle (and a
   fixed tell-tale) rotate to track scroll progress — a heading
   that changes as you sail down the page. Zero dependencies.
   ============================================================ */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;

  /* ---------- theme toggle ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const syncTheme = () => {
    const dark = root.dataset.theme !== 'light';
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(dark));
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0b1622' : '#f1ead6');
  };
  syncTheme();
  themeBtn?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('beaufort-theme', root.dataset.theme); } catch (e) {}
    syncTheme();
  });

  /* ---------- hero intro ---------- */
  const hero = document.querySelector('.hero');
  requestAnimationFrame(() => { if (hero) hero.classList.add('loaded'); });

  /* run the water shimmer only while the chart is on screen (pause offscreen) */
  if (hero && !reduce) {
    const heroIO = new IntersectionObserver((es) => {
      hero.classList.toggle('sailing', es[0].isIntersecting);
    }, { threshold: 0 });
    heroIO.observe(hero);
  }

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- animated counters ---------- */
  const fmt = (n, dec) => {
    const s = n.toFixed(dec);
    return dec ? s : Number(s).toLocaleString('en-GB');
  };
  const cio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target, to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
      cio.unobserve(el);
      if (reduce || to === 0) { el.textContent = fmt(to, dec); continue; }
      const dur = 1500, t0 = performance.now();
      const tick = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(to * eased, dec);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll('.c-num').forEach(el => cio.observe(el));

  /* ============================================================
     Compass heading — needle tracks scroll progress.
     bearing sweeps 20° → 320° across the whole page, like a slow
     change of course as you sail down it.
     ============================================================ */
  const needle = document.getElementById('roseNeedle');       // hero rose
  const ttNeedle = document.getElementById('ttNeedle');       // fixed tell-tale
  const ttDeg = document.getElementById('ttDeg');
  const telltale = document.getElementById('telltale');
  const ROSE_CX = 468, ROSE_CY = 158;
  const TT_CX = 20, TT_CY = 20;
  const START = 20, SWEEP = 300;

  const setHeading = (deg) => {
    if (needle) needle.setAttribute('transform', `rotate(${deg.toFixed(1)} ${ROSE_CX} ${ROSE_CY})`);
    if (ttNeedle) ttNeedle.setAttribute('transform', `rotate(${deg.toFixed(1)} ${TT_CX} ${TT_CY})`);
    if (ttDeg) ttDeg.textContent = String(Math.round(((deg % 360) + 360) % 360)).padStart(3, '0') + '°';
  };

  if (reduce) {
    setHeading(42);                                   // one fixed, intentional bearing
  } else {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const p = clamp(window.scrollY / max, 0, 1);
      setHeading(START + p * SWEEP);
      if (telltale && window.scrollY > 40) telltale.classList.add('show');
      else if (telltale) telltale.classList.remove('show');
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
  }

  /* ---------- book-a-passage demo form (no backend, see README) ---------- */
  const form = document.getElementById('bookForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#bName'), email = form.querySelector('#bEmail');
      if (!name.checkValidity()) { name.reportValidity(); return; }
      if (!email.checkValidity()) { email.reportValidity(); return; }
      form.innerHTML =
        '<div class="book-done"><strong>You’re in the log.</strong>' +
        '<span class="mono">demo only — no message sent. we’d normally reply within a day, ' +
        'once the tide serves and we’re back alongside.</span></div>';
    });
  }
})();
