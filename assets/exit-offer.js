/* Exit-intent offer popup: "First 10 demos get 1 month free".
 * Desktop: shows when the mouse leaves through the top of the window (going to close/change tab).
 * Mobile: shows when the visitor scrolls back up fast after reading for a while.
 * Shows at most once every 7 days per visitor, never on Book a demo / Privacy,
 * and never while the Brik chat is open. Loaded on every page by assets/site.js.
 * To change the offer, edit OFFER below. To switch it off, set ON = false.
 */
(function () {
  if (window.__exitOffer) return; window.__exitOffer = true;
  var ON = true;
  var OFFER = {
    tag: '🎁 Only 10 spots',
    kicker: 'Wait, before you go',
    title: 'Run your next month on site <span>free.</span>',
    text: 'Book a 45-minute demo and we’ll set your team up on one live project, with site chat, Brik AI and reports running the same day. The first 10 teams keep it <b>free for a full month</b>.',
    points: ['No more chasing updates across WhatsApp groups', 'Daily reports drafted from what your crew already sends', 'Voice notes in Tamil, Hindi or English, turned into records'],
    cta: 'Claim my free month',
    href: '/book-a-demo?offer=free-month',
    no: 'Maybe later',
    fine: 'For the first 10 teams who book a demo. No pressure, no obligation. We confirm your spot on the call.'
  };
  var KEY = 'brikExitOffer.v1', WEEK = 7 * 864e5, MIN_TIME = 8000;
  var path = location.pathname.replace(/\.html$/, '');
  var t0 = Date.now(), shown = false;

  function get() { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } }
  function set() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  function track(n) { try { if (window.gtag) gtag('event', n, { offer: 'free_month' }); } catch (e) {} }

  /* Book a demo page: confirm the offer above the form */
  if (/book-a-demo/.test(path)) {
    var trial = /offer=7-day-trial/.test(location.search);
    if (trial || /offer=free-month/.test(location.search)) {
      var go = function () {
        var form = document.getElementById('demoRequestForm'); if (!form) return;
        var b = document.createElement('div');
        b.setAttribute('role', 'status');
        b.style.cssText = 'display:flex;gap:10px;align-items:center;margin:0 0 18px;padding:12px 16px;border-radius:14px;background:linear-gradient(135deg,rgba(123,47,224,.09),rgba(58,142,246,.09));border:1px solid rgba(84,98,240,.22);font-size:14.5px;line-height:1.45;color:#1D1D1F';
        b.innerHTML = trial ? '<span style="font-size:20px">🎁</span><span><b>7-day free trial offer applied.</b> The first 10 teams to book a demo get a 7-day free trial of Brikito.</span>' : '<span style="font-size:20px">🎁</span><span><b>Free month offer applied.</b> The first 10 teams to book a demo get their first month free.</span>';
        form.parentNode.insertBefore(b, form);
      };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
    }
    return;
  }
  if (!ON || /privacy|404/.test(path) || Date.now() - get() < WEEK) return;

  var css = '' +
    '.xo-back{position:fixed;inset:0;z-index:9995;background:rgba(11,11,15,.45);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:grid;place-items:center;padding:16px;animation:xoF .25s ease both}' +
    '@keyframes xoF{from{opacity:0}to{opacity:1}}@keyframes xoU{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}' +
    '.xo{position:relative;width:min(760px,100%);display:grid;grid-template-columns:260px 1fr;background:#fff;border-radius:26px;overflow:hidden;box-shadow:0 40px 100px -20px rgba(11,11,15,.5);font-family:Inter,system-ui,sans-serif;animation:xoU .35s cubic-bezier(.2,.8,.2,1) both}' +
    '.xo-art{position:relative;background:linear-gradient(160deg,#7B2FE0,#5462F0 55%,#3A8EF6);display:flex;align-items:flex-end;justify-content:center;padding:28px 18px 24px;overflow:hidden}' +
    '.xo-art:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:28px 28px}' +
    '.xo-art img{position:relative;width:190px;height:auto;filter:drop-shadow(0 20px 30px rgba(0,0,0,.3))}' +
    '.xo-tag{position:absolute;top:18px;left:18px;background:#fff;color:#3A3FC7;font-size:12.5px;font-weight:700;letter-spacing:.02em;padding:6px 11px;border-radius:999px}' +
    '.xo-body{padding:36px 36px 30px}' +
    '.xo-k{font-size:13px;font-weight:600;color:#5462F0;text-transform:uppercase;letter-spacing:.08em;margin:0 0 10px}' +
    '.xo h2{margin:0;font-size:clamp(26px,3.4vw,34px);line-height:1.08;letter-spacing:-.025em;color:#0B0B0F;font-weight:700}' +
    '.xo h2 span{white-space:nowrap;background:linear-gradient(90deg,#7B2FE0,#3A8EF6);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.xo p{margin:14px 0 0;font-size:15.5px;line-height:1.55;color:#55555C}' +
    '.xo p b{color:#0B0B0F;font-weight:600}.xo ul{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:7px}.xo li{font-size:14.5px;color:#1D1D1F;display:flex;gap:9px;align-items:baseline}.xo li:before{content:"✓";color:#5462F0;font-weight:700}' +
    '.xo-cta{display:inline-flex;align-items:center;gap:8px;margin-top:22px;background:#0B0B0F;color:#fff;text-decoration:none;font-weight:600;font-size:15.5px;padding:14px 22px;border-radius:999px;transition:transform .15s}.xo-cta:hover{transform:translateY(-1px)}' +
    '.xo-no{display:inline-block;margin:22px 0 0 14px;background:none;border:0;font:inherit;font-size:14px;color:#8E8E93;cursor:pointer;text-decoration:underline;text-underline-offset:3px}' +
    '.xo-fine{margin-top:16px!important;font-size:12px!important;color:#9A9AA0!important}' +
    '.xo-x{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(11,11,15,.06);color:#1D1D1F;font-size:17px;cursor:pointer}.xo-x:hover{background:rgba(11,11,15,.12)}' +
    '@media (max-width:640px){.xo{grid-template-columns:1fr}.xo-art{height:150px;padding:12px 0 10px;align-items:flex-end}.xo-art img{width:78px}.xo-body{padding:24px 22px 22px}.xo-x{background:rgba(255,255,255,.85)}}';

  function show(trigger) {
    if (shown || Date.now() - t0 < MIN_TIME) return;
    var chat = document.querySelector('.bc-panel');
    if (chat && !chat.hidden) return;
    try { var c = JSON.parse(sessionStorage.getItem('brikChat.v1') || '{}'); if (c.done) return; } catch (e) {}
    shown = true; set(); track('exit_offer_shown');
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var back = document.createElement('div'); back.className = 'xo-back';
    back.innerHTML = '<div class="xo" role="dialog" aria-modal="true" aria-labelledby="xo-h">' +
      '<div class="xo-art"><span class="xo-tag">' + OFFER.tag + '</span><img src="/img/brik-o.webp" alt="Brik, the Brikito mascot"></div>' +
      '<div class="xo-body"><button class="xo-x" type="button" aria-label="Close">✕</button>' +
      '<p class="xo-k">' + OFFER.kicker + '</p><h2 id="xo-h">' + OFFER.title + '</h2><p>' + OFFER.text + '</p>' +
      '<ul>' + OFFER.points.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '<a class="xo-cta" href="' + OFFER.href + '">' + OFFER.cta + ' <span aria-hidden="true">→</span></a><button class="xo-no" type="button">' + OFFER.no + '</button>' +
      '<p class="xo-fine">' + OFFER.fine + '</p></div></div>';
    document.body.appendChild(back);
    var prev = document.activeElement;
    function close() { back.remove(); document.removeEventListener('keydown', esc); if (prev && prev.focus) prev.focus(); }
    function esc(e) { if (e.key === 'Escape') close(); }
    back.addEventListener('click', function (e) { if (e.target === back || e.target.closest('.xo-x,.xo-no')) close(); });
    back.querySelector('.xo-cta').addEventListener('click', function () { track('exit_offer_click'); });
    document.addEventListener('keydown', esc);
    back.querySelector('.xo-cta').focus();
  }

  /* desktop: mouse heads out through the top of the window */
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 8) show('mouse');
  });
  /* touch devices: a fast scroll back up after reading a while */
  if (matchMedia('(hover: none)').matches) {
    var lastY = scrollY, lastT = Date.now(), maxY = 0;
    addEventListener('scroll', function () {
      var y = scrollY, t = Date.now();
      maxY = Math.max(maxY, y);
      var speed = (lastY - y) / Math.max(1, t - lastT); // px per ms, positive = up
      if (Date.now() - t0 > 20000 && maxY > innerHeight * 1.5 && speed > 2.2 && y > 200) show('scroll');
      lastY = y; lastT = t;
    }, { passive: true });
  }
  window.brikExitOffer = function () { t0 = 0; show('manual'); }; // for testing in the console
})();
