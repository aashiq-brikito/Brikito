/* ============================================================
   Brikito · "How it works" scroll module
   Scoped to #how.bkt-hiw · no globals · native scroll only.
   Beats are cumulative classes at1..atN set from scroll progress,
   so every scene plays forward AND backward.
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('how');
  if (!root || !root.classList.contains('bkt-hiw')) return;

  var scenes = [].slice.call(root.querySelectorAll('.bkt-sc'));
  var ringFg = root.querySelector('#bkRing');
  var ringPct = root.querySelector('#bkRingPct');
  var wks = root.querySelector('#bkWks');
  var RING_C = 163.4;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function finishAll() {
    scenes.forEach(function (s) {
      var n = parseInt(s.getAttribute('data-beats'), 10) || 0;
      for (var i = 1; i <= n; i++) s.classList.add('at' + i);
    });
    if (ringPct) ringPct.textContent = '53';
    if (ringFg) ringFg.style.strokeDashoffset = String(RING_C * (1 - 0.53));
    if (wks) wks.textContent = '6';
  }

  /* pause decorative loops until a scene is near the viewport */
  if ('IntersectionObserver' in window) {
    var liveIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('live', e.isIntersecting); });
    }, { rootMargin: '60% 0px 60% 0px' });
    scenes.forEach(function (s) { liveIO.observe(s); });
  } else {
    scenes.forEach(function (s) { s.classList.add('live'); });
  }

  if (reduced) {
    finishAll();
  } else {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight || 800;
      scenes.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var total = r.height - vh;
        var p = total > 40 ? clamp01(-r.top / total) : (r.top < vh * 0.55 ? 1 : 0);
        var n = parseInt(s.getAttribute('data-beats'), 10) || 0;
        for (var i = 1; i <= n; i++) s.classList.toggle('at' + i, p >= i / (n + 1));
        var id = s.getAttribute('data-scene');
        if (id === '2' && ringFg && ringPct) {
          var a = 2 / (n + 1), b = 3 / (n + 1);
          var q = clamp01((p - a) / (b - a));
          ringPct.textContent = String(Math.round(53 * q));
          ringFg.style.strokeDashoffset = String(RING_C * (1 - 0.53 * q));
        }
        if (id === '5' && wks) {
          var a5 = 5 / (n + 1), b5 = 6 / (n + 1);
          wks.textContent = String(Math.round(6 * clamp01((p - a5) / (b5 - a5))));
        }
      });
    };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(update);
        /* fallback: rAF can starve in throttled/hidden frames */
        window.setTimeout(function () { if (ticking) update(); }, 120);
      } else {
        window.setTimeout(update, 33);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* mosaic reveal */
  var cards = [].slice.call(root.querySelectorAll('.bkt-mcard'));
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    cards.forEach(function (c) { io.observe(c); });
  } else {
    cards.forEach(function (c) { c.classList.add('in'); });
  }
})();
