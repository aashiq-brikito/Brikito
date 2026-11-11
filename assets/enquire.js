/* "Enquire" popup on the Pricing page: two choices, Talk on WhatsApp or Book a meeting.
 * Opens from every "Enquire now" / "Enquire for pricing" button on /pricing and remembers which plan was clicked.
 * WhatsApp opens a chat with WHATSAPP_NUMBER with a ready message; Book a meeting goes to
 * /book-a-demo?plan=<plan>, where the plan is pre-filled in "What would you like to improve?".
 * Loaded on every page by assets/site.js.
 */
(function () {
  if (window.__brikEnquire) return; window.__brikEnquire = true;
  var WHATSAPP_NUMBER = '__WHATSAPP__'; // country code + number, digits only, e.g. 919876543210
  var path = location.pathname.replace(/\.html$/, '');

  function track(name, p) { try { if (window.gtag) gtag('event', name, p || {}); } catch (e) {} }

  /* Book a demo page: pre-fill the plan they enquired about */
  if (/book-a-demo/.test(path)) {
    var plan = new URLSearchParams(location.search).get('plan');
    if (plan) {
      var fill = function () {
        var t = document.getElementById('challenge');
        if (t && !t.value) t.value = 'I’m interested in the ' + plan.replace(/[<>]/g, '') + ' plan and would like pricing for my projects. ';
      };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
    }
    return;
  }
  if (!/^\/pricing\/?$/.test(path)) return;

  var css = '' +
    '.eq-back{position:fixed;inset:0;z-index:9996;background:rgba(11,11,15,.45);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:grid;place-items:center;padding:16px;animation:eqF .2s ease both}' +
    '@keyframes eqF{from{opacity:0}to{opacity:1}}@keyframes eqU{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}' +
    '.eq{position:relative;width:min(560px,100%);background:#fff;border-radius:24px;padding:32px;box-shadow:0 40px 100px -20px rgba(11,11,15,.5);font-family:Inter,system-ui,sans-serif;animation:eqU .3s cubic-bezier(.2,.8,.2,1) both}' +
    '.eq-chip{display:inline-block;font-size:12.5px;font-weight:600;color:#3A3FC7;background:#EEF0FF;padding:6px 11px;border-radius:999px}' +
    '.eq h2{margin:14px 0 0;font-size:26px;line-height:1.15;letter-spacing:-.02em;color:#0B0B0F}' +
    '.eq>p{margin:8px 0 0;font-size:15px;line-height:1.5;color:#55555C}' +
    '.eq-opts{display:grid;gap:12px;margin-top:22px}' +
    '.eq-o{display:flex;align-items:center;gap:16px;padding:18px;border-radius:18px;border:1px solid rgba(11,11,15,.1);text-decoration:none;color:#0B0B0F;background:#fff;transition:border-color .15s,box-shadow .15s,transform .15s}' +
    '.eq-o:hover{border-color:rgba(84,98,240,.5);box-shadow:0 12px 30px -14px rgba(36,41,120,.35);transform:translateY(-1px)}' +
    '.eq-o:focus-visible{outline:3px solid rgba(84,98,240,.4);outline-offset:2px}' +
    '.eq-ic{flex:none;width:48px;height:48px;border-radius:14px;display:grid;place-items:center}' +
    '.eq-o b{display:block;font-size:16.5px}.eq-o span.eq-d{display:block;font-size:14px;color:#6E6E73;margin-top:3px;line-height:1.45}' +
    '.eq-o .eq-arrow{margin-left:auto;font-size:20px;color:#9A9AA0}' +
    '.eq-x{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(11,11,15,.06);font-size:17px;cursor:pointer;color:#1D1D1F}.eq-x:hover{background:rgba(11,11,15,.12)}' +
    '.eq-fine{margin-top:16px!important;font-size:12.5px!important;color:#9A9AA0!important}' +
    '@media (max-width:480px){.eq{padding:26px 20px}.eq h2{font-size:23px}}';

  var WA_ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';
  var CAL_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8.5 14.5l2 2 4-4"/></svg>';
  var styled = false;

  function open(plan, from) {
    if (!styled) { var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); styled = true; }
    var label = plan ? plan + ' plan' : 'Brikito pricing';
    var text = 'Hi Brikito, I’m interested in the ' + (plan ? plan + ' plan' : 'Brikito platform') + '. Could you share pricing for my projects? (from brikito.com/pricing)';
    var wa = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    var meet = '/book-a-demo' + (plan ? '?plan=' + encodeURIComponent(plan) : '');
    var back = document.createElement('div'); back.className = 'eq-back';
    back.innerHTML = '<div class="eq" role="dialog" aria-modal="true" aria-labelledby="eq-h">' +
      '<button class="eq-x" type="button" aria-label="Close">✕</button>' +
      '<span class="eq-chip">' + label + '</span>' +
      '<h2 id="eq-h">How would you like to talk to us?</h2>' +
      '<p>We price to your projects and team. Pick whatever is easier for you.</p>' +
      '<div class="eq-opts">' +
      '<a class="eq-o" data-k="whatsapp" href="' + wa + '" target="_blank" rel="noopener"><span class="eq-ic" style="background:#25D366">' + WA_ICON + '</span>' +
      '<span><b>Talk on WhatsApp</b><span class="eq-d">Message our team now for a quick answer on pricing.</span></span><span class="eq-arrow" aria-hidden="true">›</span></a>' +
      '<a class="eq-o" data-k="meeting" href="' + meet + '"><span class="eq-ic" style="background:linear-gradient(135deg,#7B2FE0,#3A8EF6)">' + CAL_ICON + '</span>' +
      '<span><b>Book a meeting</b><span class="eq-d">A 45-minute session set up on one of your live projects, with a quote within one working day.</span></span><span class="eq-arrow" aria-hidden="true">›</span></a>' +
      '</div><p class="eq-fine">No pressure, no obligation.</p></div>';
    document.body.appendChild(back);
    var prev = document.activeElement;
    function close() { back.remove(); document.removeEventListener('keydown', esc); if (prev && prev.focus) prev.focus(); }
    function esc(e) { if (e.key === 'Escape') close(); }
    back.addEventListener('click', function (e) {
      var o = e.target.closest('.eq-o');
      if (o) {
        if (o.dataset.k === 'whatsapp') { track('contact', { method: 'whatsapp', plan: plan || '' }); try { if (window.fbq) fbq('track', 'Contact'); } catch (x) {} }
        else track('enquire_meeting_click', { plan: plan || '' });
        setTimeout(close, 50);
        return;
      }
      if (e.target === back || e.target.closest('.eq-x')) close();
    });
    document.addEventListener('keydown', esc);
    back.querySelector('.eq-o').focus();
    track('enquire_open', { plan: plan || '', from: from });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var txt = (a.textContent || '').trim().toLowerCase();
    if (txt.indexOf('enquire') !== 0) return;
    e.preventDefault();
    var card = a.closest('.plan'), h = card && card.querySelector('h3');
    open(h ? h.textContent.trim() : '', txt);
  }, true);
})();
