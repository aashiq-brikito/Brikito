/* Free DPR Kit download box (lead magnet) for Journal articles.
 * Place <div data-dpr-kit></div> where the box should appear. Email goes to Kit form
 * "DPR Kit download (website)" (ID 10174128); the files unlock straight away.
 */
(function () {
  if (window.__dprKit) return; window.__dprKit = true;
  var KIT_ACTION = 'https://app.kit.com/forms/10174128/subscriptions';
  var FILES = [
    ['/downloads/Brikito-DPR-Template.xlsx', 'DPR template (Excel)', 'Works in Excel and Google Sheets'],
    ['/downloads/Brikito-DPR-Checklist.pdf', '10-point DPR checklist (PDF)', 'One page, print it for site']
  ];
  var KEY = 'brikDprKit';

  var css = '' +
    '.dk{display:grid;grid-template-columns:1fr 1.05fr;gap:28px;align-items:center;margin:40px 0;padding:28px;border-radius:22px;background:linear-gradient(135deg,#F3F0FF,#EAF2FF);border:1px solid rgba(84,98,240,.18);font-family:Inter,system-ui,sans-serif;color:#0B0B0F}' +
    '.dk img{width:100%;height:auto;border-radius:14px;display:block}' +
    '.dk-k{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5B3FE0;margin:0 0 8px}' +
    '.dk h3{margin:0;font-size:24px;line-height:1.15;letter-spacing:-.015em}' +
    '.dk p.dk-t{margin:8px 0 0;font-size:15px;line-height:1.55;color:#3A3A40}' +
    '.dk ul{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:5px}.dk li{font-size:14px;display:flex;gap:8px}.dk li:before{content:"✓";color:#5462F0;font-weight:700}' +
    '.dk form{display:flex;gap:8px;margin-top:16px;background:#fff;border:1px solid rgba(11,11,15,.12);border-radius:999px;padding:5px}' +
    '.dk input[type=email]{flex:1;min-width:0;border:0;outline:none;font:inherit;font-size:15px;padding:10px 14px;background:none}' +
    '.dk form:focus-within{border-color:#5462F0;box-shadow:0 0 0 3px rgba(84,98,240,.18)}' +
    '.dk button{flex:none;border:0;border-radius:999px;background:#0B0B0F;color:#fff;font:inherit;font-weight:600;font-size:14.5px;padding:11px 18px;cursor:pointer}.dk button:disabled{opacity:.6}' +
    '.dk-note{margin:8px 4px 0;font-size:12px;color:#6E6E73}.dk-msg{margin:8px 4px 0;font-size:14px}.dk-msg.bad{color:#B91C1C}.dk-msg:empty{display:none}' +
    '.dk-dl{display:grid;gap:8px;margin-top:14px}.dk-dl a{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(11,11,15,.1);border-radius:14px;padding:12px 14px;text-decoration:none;color:#0B0B0F}' +
    '.dk-dl a:hover{border-color:#5462F0}.dk-dl b{display:block;font-size:14.5px}.dk-dl span.s{font-size:12.5px;color:#6E6E73}.dk-dl i{margin-left:auto;font-style:normal;font-weight:700;color:#5462F0}' +
    '.dk-ic{flex:none;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:800}' +
    '.dk-hp{position:absolute!important;left:-9999px!important}' +
    '@media (max-width:760px){.dk{grid-template-columns:1fr;padding:22px}.dk h3{font-size:21px}}' +
    '@media (max-width:420px){.dk form{flex-direction:column;border-radius:16px}.dk button{width:100%}}';

  function unlocked(box, email) {
    var right = box.querySelector('.dk-r');
    right.querySelector('form').remove(); right.querySelector('.dk-note').remove();
    var m = right.querySelector('.dk-msg'); m.className = 'dk-msg';
    m.innerHTML = '<b style="color:#15803D">Your DPR Kit is ready.</b> ' + (email ? 'We’ve also emailed a link to confirm your subscription to ' + email.replace(/[<>&"]/g, '') + '.' : 'Download both files below.');
    var dl = document.createElement('div'); dl.className = 'dk-dl';
    dl.innerHTML = FILES.map(function (f, i) {
      return '<a href="' + f[0] + '" download><span class="dk-ic" style="background:' + (i ? '#E5484D' : '#1D7A47') + '">' + (i ? 'PDF' : 'XLS') + '</span><span><b>' + f[1] + '</b><span class="s">' + f[2] + '</span></span><i>↓</i></a>';
    }).join('');
    right.appendChild(dl);
    dl.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a) try { if (window.gtag) gtag('event', 'file_download', { file_name: a.getAttribute('href'), lead_magnet: 'dpr_kit' }); } catch (x) {} });
  }

  function build(slot) {
    var box = document.createElement('aside'); box.className = 'dk'; box.setAttribute('aria-labelledby', 'dk-h');
    box.innerHTML = '<img src="/img/dpr-kit-preview.webp" alt="Brikito DPR template and 10-point DPR checklist" loading="lazy" width="1200" height="760">' +
      '<div class="dk-r"><span class="dk-k">Free download</span><h3 id="dk-h">Get the DPR Kit</h3>' +
      '<p class="dk-t">The 10-section DPR format from this guide, ready to use on site tomorrow.</p>' +
      '<ul><li>Excel DPR template that calculates cumulative %, attendance and stock</li><li>Red alerts for low stock and open hindrances</li><li>One-page 10-point checklist to print for engineers</li></ul>' +
      '<form novalidate><label class="dk-hp" aria-hidden="true">Leave empty<input name="hp_site" tabindex="-1" autocomplete="off"></label>' +
      '<input type="email" name="email_address" required autocomplete="email" placeholder="Your work email" aria-label="Your work email"><button type="submit">Send me the kit</button></form>' +
      '<p class="dk-msg" role="status" aria-live="polite"></p><p class="dk-note">Free. You’ll also get the Brikito newsletter; unsubscribe anytime.</p></div>';
    slot.replaceWith(box);
    var done; try { done = localStorage.getItem(KEY); } catch (e) {}
    if (done) return unlocked(box, '');
    var form = box.querySelector('form'), input = form.querySelector('input[type=email]'), btn = form.querySelector('button'), msg = box.querySelector('.dk-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.className = 'dk-msg bad'; msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      if (form.hp_site.value) return;
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(KIT_ACTION, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ email_address: email }) })
        .then(function () {
          try { localStorage.setItem(KEY, '1'); } catch (x) {}
          try { if (window.gtag) gtag('event', 'generate_lead', { form: 'dpr_kit', lead_magnet: 'dpr_kit' }); } catch (x) {}
          try { if (window.fbq) fbq('track', 'Lead', { content_name: 'DPR Kit' }); } catch (x) {}
          unlocked(box, email);
        })
        .catch(function () { btn.disabled = false; btn.textContent = 'Send me the kit'; msg.className = 'dk-msg bad'; msg.textContent = 'Sorry, that didn’t go through. Please try again.'; });
    });
  }

  function init() {
    var slots = document.querySelectorAll('[data-dpr-kit]'); if (!slots.length) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    slots.forEach(build);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
