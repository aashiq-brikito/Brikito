/* Free download boxes (lead magnets) for Journal articles.
 * <div data-dpr-kit></div>      DPR Kit, Kit form "DPR Kit download (website)" (ID 10174128)
 * <div data-material-kit></div> Material Tracker, Kit form "Material Tracker download (website)" (ID 10174188)
 * The email goes to the Kit form and the files unlock straight away.
 */
(function () {
  if (window.__dprKit) return; window.__dprKit = true;
  var KITS = {
    dpr: {
      sel: '[data-dpr-kit]', action: 'https://app.kit.com/forms/10174128/subscriptions', key: 'brikDprKit', name: 'DPR Kit', slug: 'dpr_kit',
      img: '/img/dpr-kit-preview.webp', alt: 'Brikito DPR template and 10-point DPR checklist',
      title: 'Get the DPR Kit', text: 'The 10-section DPR format from this guide, ready to use on site tomorrow.',
      bullets: ['Excel DPR template that calculates cumulative %, attendance and stock', 'Red alerts for low stock and open hindrances', 'One-page 10-point checklist to print for engineers'],
      btn: 'Send me the kit', ready: 'Your DPR Kit is ready.',
      files: [['/downloads/Brikito-DPR-Template.xlsx', 'DPR template (Excel)', 'Works in Excel and Google Sheets', 'XLS'], ['/downloads/Brikito-DPR-Checklist.pdf', '10-point DPR checklist (PDF)', 'One page, print it for site', 'PDF']]
    },
    material: {
      sel: '[data-material-kit]', action: 'https://app.kit.com/forms/10174188/subscriptions', key: 'brikMatKit', name: 'Material Tracker', slug: 'material_tracker',
      img: '/img/material-tracker-preview.webp', alt: 'Brikito material reconciliation and BOQ tracker sheet',
      title: 'Get the Material Reconciliation & BOQ Tracker', text: 'Know what was planned, received, used and is left on site for every material, and where it went.',
      bullets: ['BOQ vs received vs used vs stock for each material, calculated for you', 'Wastage % flag against your allowed limit, with the ₹ value lost', 'See how much went to each floor and contractor, plus reorder alerts'],
      btn: 'Send me the tracker', ready: 'Your Material Tracker is ready.',
      files: [['/downloads/Brikito-Material-Tracker.xlsx', 'Material Reconciliation & BOQ Tracker', 'Works in Excel and Google Sheets', 'XLS']]
    }
  };

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

  function unlocked(box, email, k) {
    var right = box.querySelector('.dk-r');
    right.querySelector('form').remove(); right.querySelector('.dk-note').remove();
    var m = right.querySelector('.dk-msg'); m.className = 'dk-msg';
    m.innerHTML = '<b style="color:#15803D">' + k.ready + '</b> ' + (email ? 'We’ve also emailed a link to confirm your subscription to ' + email.replace(/[<>&"]/g, '') + '.' : 'Download below.');
    var dl = document.createElement('div'); dl.className = 'dk-dl';
    dl.innerHTML = k.files.map(function (f) {
      return '<a href="' + f[0] + '" download><span class="dk-ic" style="background:' + (f[3] === 'PDF' ? '#E5484D' : '#1D7A47') + '">' + f[3] + '</span><span><b>' + f[1] + '</b><span class="s">' + f[2] + '</span></span><i>↓</i></a>';
    }).join('');
    right.appendChild(dl);
    dl.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a) try { if (window.gtag) gtag('event', 'file_download', { file_name: a.getAttribute('href'), lead_magnet: k.slug }); } catch (x) {} });
  }

  var n = 0;
  function build(slot, k) {
    var id = 'dk-h' + (n++);
    var box = document.createElement('aside'); box.className = 'dk'; box.setAttribute('aria-labelledby', id);
    box.innerHTML = '<img src="' + k.img + '" alt="' + k.alt + '" loading="lazy" width="1200" height="760">' +
      '<div class="dk-r"><span class="dk-k">Free download</span><h3 id="' + id + '">' + k.title + '</h3>' +
      '<p class="dk-t">' + k.text + '</p>' +
      '<ul>' + k.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul>' +
      '<form novalidate><label class="dk-hp" aria-hidden="true">Leave empty<input name="hp_site" tabindex="-1" autocomplete="off"></label>' +
      '<input type="email" name="email_address" required autocomplete="email" placeholder="Your work email" aria-label="Your work email"><button type="submit">' + k.btn + '</button></form>' +
      '<p class="dk-msg" role="status" aria-live="polite"></p><p class="dk-note">Free. You’ll also get the Brikito newsletter; unsubscribe anytime.</p></div>';
    slot.replaceWith(box);
    var done; try { done = localStorage.getItem(k.key); } catch (e) {}
    if (done) return unlocked(box, '', k);
    var form = box.querySelector('form'), input = form.querySelector('input[type=email]'), btn = form.querySelector('button'), msg = box.querySelector('.dk-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.className = 'dk-msg bad'; msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      if (form.hp_site.value) return;
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(k.action, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ email_address: email }) })
        .then(function () {
          try { localStorage.setItem(k.key, '1'); } catch (x) {}
          try { if (window.gtag) gtag('event', 'generate_lead', { form: k.slug, lead_magnet: k.slug }); } catch (x) {}
          try { if (window.fbq) fbq('track', 'Lead', { content_name: k.name }); } catch (x) {}
          unlocked(box, email, k);
        })
        .catch(function () { btn.disabled = false; btn.textContent = k.btn; msg.className = 'dk-msg bad'; msg.textContent = 'Sorry, that didn’t go through. Please try again.'; });
    });
  }

  function init() {
    var found = [];
    Object.keys(KITS).forEach(function (id) { document.querySelectorAll(KITS[id].sel).forEach(function (el) { found.push([el, KITS[id]]); }); });
    if (!found.length) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    found.forEach(function (f) { build(f[0], f[1]); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
