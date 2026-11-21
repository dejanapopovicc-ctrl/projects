(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero background drifts from paper to mist while scrolling through the hero */
  var hero = document.querySelector('.hero');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var p = Math.min(Math.max(window.scrollY / (hero.offsetHeight || 1), 0), 1);
      hero.style.setProperty('--p', p.toFixed(3));
      ticking = false;
    });
  }
  if (!reduce) window.addEventListener('scroll', onScroll, { passive: true });

  /* breathing cue: 4s in, 6s out, same rhythm as the orb */
  var breathText = document.getElementById('breathText');
  if (breathText && !reduce) {
    var inhale = true;
    (function loop() {
      breathText.textContent = inhale ? 'Breathe in' : 'Breathe out';
      setTimeout(function () { inhale = !inhale; loop(); }, inhale ? 4000 : 6000);
    })();
  } else if (breathText) {
    breathText.textContent = 'Take a breath';
  }

  /* hide the sticky mobile button while the booking section is on screen */
  var sticky = document.getElementById('stickyCta');
  var booking = document.getElementById('booking');
  if (sticky && booking && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      sticky.classList.toggle('hide', e[0].isIntersecting);
    }, { threshold: 0.15 }).observe(booking);
  }

  /* simulated booking flow: pick service, pick time, confirm, watch messages arrive */
  var serviceChips = document.querySelectorAll('#serviceChips .chip');
  var timeChips = document.querySelectorAll('#timeChips .chip');
  var timeSet = document.querySelector('[data-step="2"]');
  var confirmBtn = document.getElementById('confirmBtn');
  var resetBtn = document.getElementById('resetBtn');
  var phone = document.getElementById('phone');
  var msgs = document.getElementById('msgs');
  var empty = document.getElementById('empty');
  var service = null, time = null, timers = [];

  function pick(chips, btn) {
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'); });
    return btn.getAttribute('data-value');
  }
  function refresh() { confirmBtn.disabled = !(service && time); }

  serviceChips.forEach(function (c) {
    c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', function () {
      service = pick(serviceChips, c);
      timeSet.disabled = false;
      refresh();
    });
  });
  timeChips.forEach(function (c) {
    c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', function () { time = pick(timeChips, c); refresh(); });
  });

  function addMsg(label, text) {
    if (empty) { empty.remove(); empty = null; }
    var d = document.createElement('div');
    d.className = 'msg';
    var s = document.createElement('small');
    s.textContent = label;
    var p = document.createElement('span');
    p.textContent = text;
    d.appendChild(s); d.appendChild(p);
    msgs.appendChild(d);
  }
  function later(fn, ms) { timers.push(setTimeout(fn, reduce ? 0 : ms)); }

  confirmBtn.addEventListener('click', function () {
    confirmBtn.disabled = true;
    resetBtn.hidden = false;
    if (!reduce) { phone.classList.remove('buzz'); void phone.offsetWidth; phone.classList.add('buzz'); }
    addMsg('Calm Harbour · now', 'You are booked: ' + service + ', ' + time + '. Need to change it? Use the link in this message.');
    later(function () {
      addMsg('Calm Harbour · same day, 08:00', 'Reminder: your ' + service.toLowerCase() + ' is today. See you soon.');
      if (!reduce) { phone.classList.remove('buzz'); void phone.offsetWidth; phone.classList.add('buzz'); }
    }, 2600);
    later(function () {
      addMsg('Calm Harbour · after your session', 'Thank you for coming. You can book your next session here whenever you are ready.');
    }, 5200);
  });

  resetBtn.addEventListener('click', function () {
    timers.forEach(clearTimeout); timers = [];
    msgs.innerHTML = '';
    empty = document.createElement('p');
    empty.className = 'empty'; empty.id = 'empty';
    empty.textContent = 'Messages will appear here after you confirm.';
    msgs.appendChild(empty);
    service = time = null;
    serviceChips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    timeChips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    timeSet.disabled = true;
    confirmBtn.disabled = true;
    resetBtn.hidden = true;
  });
})();
