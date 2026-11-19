/* Dr Marković, zajednička skripta (jezik, meni, animacije, forma) */
(function () {
  var doc = document.documentElement;

  /* ---- jezik ---- */
  function setLang(l) {
    doc.lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === l);
      b.setAttribute('aria-pressed', b.dataset.lang === l);
    });
    // atributi sa prevodom (option, placeholder, title...)
    document.querySelectorAll('[data-sr]').forEach(function (el) {
      var v = el.getAttribute('data-' + l);
      if (!v) return;
      if (el.tagName === 'IMG') el.alt = v; else el.textContent = v;
    });
    var t = doc.getAttribute('data-title-' + l);
    if (t) document.title = t;
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });
  setLang(doc.lang === 'en' ? 'en' : 'sr');

  /* ---- mobilni meni ---- */
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  /* ---- animacija pri skrolu ---- */
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- kontakt forma ---- */
  var form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('name'), p = document.getElementById('phone');
      var okN = n.value.trim().length > 1;
      var okP = /^[+\d][\d\s\-\/()]{5,}$/.test(p.value.trim());
      n.nextElementSibling.style.display = okN ? 'none' : 'block';
      p.nextElementSibling.style.display = okP ? 'none' : 'block';
      if (okN && okP) {
        /* ZAMENI: poveži sa Formspree / Netlify Forms da forma stvarno šalje mejl */
        document.getElementById('ok').style.display = 'block';
        form.reset();
      }
    });
  }
})();
