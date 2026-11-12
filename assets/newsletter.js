/* Newsletter sign-up band at the top of the site footer (every page, including Journal articles).
 * Subscribers go to Kit (kit.com) form "Brikito website newsletter (footer)", ID 10173986.
 * Kit then emails them a confirmation link (double opt-in). Loaded on every page by assets/site.js.
 */
(function () {
  if (window.__brikNewsletter) return; window.__brikNewsletter = true;
  var KIT_ACTION = 'https://app.kit.com/forms/10173986/subscriptions';

  var css = '' +
    '.nl{position:relative;overflow:hidden;display:grid;grid-template-columns:1.1fr 1fr;gap:28px 48px;align-items:center;margin:0 0 56px;padding:40px 44px;border-radius:24px;background:#0B0B0F;color:#fff;font-family:Inter,system-ui,sans-serif}' +
    '.nl:before{content:"";position:absolute;right:-120px;top:-160px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,rgba(123,47,224,.55),rgba(58,142,246,.25) 45%,transparent 70%);pointer-events:none}' +
    '.nl>*{position:relative}' +
    '.nl-k{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#B9BCFF;margin:0 0 12px}' +
    '.nl h3{margin:0;font-size:clamp(24px,2.6vw,32px);line-height:1.12;letter-spacing:-.02em;font-weight:700;color:#fff}' +
    '.nl p.nl-t{margin:10px 0 0;font-size:15px;line-height:1.55;color:rgba(255,255,255,.68)}' +
    '.nl form{display:flex;gap:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:6px}' +
    '.nl input[type=email]{flex:1;min-width:0;background:none;border:0;outline:none;color:#fff;font:inherit;font-size:15px;padding:10px 16px}' +
    '.nl input[type=email]::placeholder{color:rgba(255,255,255,.5)}' +
    '.nl form:focus-within{border-color:rgba(185,188,255,.7);box-shadow:0 0 0 3px rgba(84,98,240,.3)}' +
    '.nl button{flex:none;border:0;border-radius:999px;background:#fff;color:#0B0B0F;font:inherit;font-size:15px;font-weight:600;padding:12px 22px;cursor:pointer;transition:transform .15s}' +
    '.nl button:hover{transform:translateY(-1px)}.nl button:disabled{opacity:.6;cursor:default;transform:none}' +
    '.nl-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}' +
    '.nl-note{margin:10px 4px 0;font-size:12.5px;color:rgba(255,255,255,.5)}' +
    '.nl-msg{margin:10px 4px 0;font-size:14px;line-height:1.5}.nl-msg.ok{color:#86EFAC}.nl-msg.bad{color:#FCA5A5}' +
    '.nl-msg:empty{display:none}' +
    'body:has(#demoRequestForm) .nl{display:none}' +
    '@media (max-width:860px){.nl{grid-template-columns:1fr;padding:30px 24px;margin-bottom:44px}}' +
    '@media (max-width:480px){.nl form{flex-direction:column;border-radius:18px}.nl button{width:100%}}';

  function build() {
    if (/book-a-demo/.test(location.pathname)) return; // keep the demo page focused on the form
    var wrap = document.querySelector('footer .wrap');
    if (!wrap || wrap.querySelector('.nl')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('section');
    box.className = 'nl'; box.setAttribute('aria-labelledby', 'nl-h');
    box.innerHTML =
      '<div><p class="nl-k">✉️ The Brikito newsletter</p>' +
      '<h3 id="nl-h">Site lessons, straight to your inbox.</h3>' +
      '<p class="nl-t">Practical ideas on cutting delays, rework and paperwork on construction sites, plus Brikito product news. Unsubscribe anytime.</p></div>' +
      '<div><form novalidate>' +
      '<label class="nl-hp" aria-hidden="true">Leave empty<input name="company_site" tabindex="-1" autocomplete="off"></label>' +
      '<input type="email" name="email_address" required autocomplete="email" placeholder="Your work email" aria-label="Your work email">' +
      '<button type="submit">Subscribe</button></form>' +
      '<p class="nl-msg" role="status" aria-live="polite"></p>' +
      '<p class="nl-note">Join contractors, developers and PMCs. No spam, ever.</p></div>';
    wrap.insertBefore(box, wrap.firstChild);

    var form = box.querySelector('form'), input = form.querySelector('input[type=email]'),
        btn = form.querySelector('button'), msg = box.querySelector('.nl-msg'), note = box.querySelector('.nl-note');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      msg.className = 'nl-msg';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; msg.className = 'nl-msg bad'; input.focus(); return; }
      if (form.company_site.value) return; // bot trap
      btn.disabled = true; btn.textContent = 'Subscribing…';
      fetch(KIT_ACTION, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ email_address: email }) })
        .then(function () {
          form.hidden = true; note.hidden = true;
          msg.className = 'nl-msg ok';
          msg.textContent = 'Almost there! We’ve sent a confirmation link to ' + email + '. Click it to start receiving the newsletter.';
          try { if (window.gtag) gtag('event', 'sign_up', { method: 'newsletter' }); } catch (x) {}
          try { if (window.fbq) fbq('trackCustom', 'NewsletterSignup'); } catch (x) {}
        })
        .catch(function () {
          msg.className = 'nl-msg bad';
          msg.textContent = 'Sorry, that didn’t go through. Please try again in a moment.';
        })
        .then(function () { btn.disabled = false; btn.textContent = 'Subscribe'; });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
