#!/usr/bin/env python3
"""Turn the designer's single-page app (app.js) into assets/site.js.

The design builds every page in the browser and switches pages with #hash
links. For brikito.com we pre-render each page to real HTML (tools/build-pages.py)
so Google sees every page at its own clean URL. This script applies the
changes that needs, and keeps the live site's real content:

  * links:     #about -> /about, #home -> /, #journal -> /blog
  * images:    img/x.jpg -> /img/x.webp (compressed), mascot PNG -> WebP
  * journal:   each card links to its real article page
  * about:     real founder photo instead of the placeholder
  * demo form: the live form fields + Google Sheet submission
  * privacy:   the full live policy text (tools/privacy-content.html)
  * runtime:   on pre-rendered pages the script only adds interactions
               (reveal on scroll, menus, tabs, filters, form); in build mode
               (window.__BUILD_ROUTE__) it renders the page for capture.

Usage: python3 tools/patch-redesign.py <path to designer app.js>
"""
import re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(sys.argv[1], encoding="utf-8").read()
s = src

def sub(old, new, count=1):
    global s
    n = s.count(old)
    if n != count:
        sys.exit(f"expected {count} x {old[:70]!r}, found {n}")
    s = s.replace(old, new)

ROUTES = ["home", "console", "brik-ai", "brikchat", "brikvision", "brikdocs", "how-it-works",
          "pricing", "journal", "about", "book-a-demo", "privacy"]
def url(r):
    return "/" if r == "home" else "/blog" if r == "journal" else "/" + r

# ---- clean URLs ----------------------------------------------------------
sub("let gid = 0;", "let gid = 0;\nconst U = r => r === 'home' ? '/' : r === 'journal' ? '/blog' : '/' + r;")
s, n = re.subn(r'href="#(%s)"' % "|".join(map(re.escape, ROUTES)), lambda m: f'href="{url(m.group(1))}"', s)
print("static links:", n)
sub('href="#${r}"', 'href="${U(r)}"', 2)
sub('href="#${p[0]}"', 'href="${U(p[0])}"', 2)
sub('href="#${r[0]}"', 'href="${U(r[0])}"', 1)
# in-page jump buttons get a real anchor so they work without JS too
s, n = re.subn(r'<a class="btn btn-s" data-scroll="([a-z]+)">', r'<a class="btn btn-s" href="#\1" data-scroll="\1">', s)
print("jump buttons:", n)

# ---- images ----------------------------------------------------------------
sub("img/${img}.jpg", "/img/${img}.webp", 2)
sub("img/${f[0]}.jpg", "/img/${f[0]}.webp", 1)
sub("img/cam-ppe.jpg", "/img/cam-ppe.webp", 1)
sub("img/brik-o.png", "/img/brik-o.webp", 3)
# Home page BrikVision card: real site photos too
sub("${camTile('cam-gate', 'CAM 01 · GATE', [[13, 37, 6, 13, 'person .97'], [48, 62, 6, 14, 'person .95']], 'IN 42 · OUT 9')}${camTile('cam-crew', 'CAM 03 · OCCUPANCY', [[18, 36, 7, 17, 'person'], [46, 26, 7, 20, 'person']], 'HEADCOUNT 16')}",
    "${realCam('cam-real-activity', 'CAM 01 · SITE ACTIVITY', 'AI CCTV view of active construction work and workers', 'CREW ACTIVE')}${realCam('cam-real-occupancy', 'CAM 03 · OCCUPANCY', 'AI CCTV counting construction workers on site', 'HEADCOUNT 16')}")
# BrikVision: the four real site camera photos from the original page
sub("const camGrid = () => `<div class=\"cams\">${camTile('cam-gate', 'CAM 01 · SITE ACTIVITY'",
    "const realCam = (img, label, alt, foot) => `<div class=\"cam real\"><img src=\"/img/${img}.webp\" alt=\"${alt}\" loading=\"lazy\"><span class=\"lbl\">${label}</span><span class=\"rec\">REC</span><span class=\"foot\">${foot}</span></div>`;\n"
    "const camGrid = () => `<div class=\"cams\">${realCam('cam-real-activity', 'CAM 01 · SITE ACTIVITY', 'AI CCTV view of active construction work and workers', 'CREW ACTIVE')}"
    "${realCam('cam-real-zone', 'CAM 02 · WORK ZONE', 'AI CCTV view of a formwork work zone', 'FORMWORK ACTIVE')}"
    "${realCam('cam-real-occupancy', 'CAM 03 · OCCUPANCY', 'AI CCTV counting construction workers on site', 'HEADCOUNT 16')}"
    "${realCam('cam-real-ppe', 'CAM 04 · SAFETY / PPE', 'AI CCTV detecting workers and safety helmets', 'HELMET DETECTION')}</div>`;\nconst camGridOld = () => `<div class=\"cams\">${camTile('cam-gate', 'CAM 01 · SITE ACTIVITY'")

# ---- journal: real article links -----------------------------------------
SLUGS = ["blog-best-ai-construction-management-software", "blog-ai-construction-software-india", "blog-ai-construction-software-uae-singapore", "blog-ai-construction-site-chat", "blog-ai-cctv-construction-site-monitoring",
         "blog-construction-document-control", "blog-construction-site-safety-and-quality",
         "blog-construction-management-software", "blog-construction-site-communication",
         "blog-construction-site-documentation", "blog-construction-labour-management",
         "blog-daily-progress-report-construction", "blog-building-construction-process",
         "blog-construction-material-management", "blog-construction-cost-control",
         "blog-construction-scheduling", "blog-construction-market-guide", "blog-boq-cost-overruns",
         "blog-seven-site-updates", "blog-ai-construction", "blog-drawing-revisions",
         "blog-rework-coordination", "blog-where-time-goes"]
for slug in SLUGS + ["blog-construction-information-management"]:
    if not os.path.exists(os.path.join(ROOT, slug + ".html")):
        sys.exit("missing article " + slug)
sub("const coverFor = (cat, i) => {",
    "const SLUGS = %s;\nconst coverFor = (cat, i) => {" % repr(SLUGS).replace("'", "'"))
sub('<a class="rv" href="https://www.brikito.com/blog" style="display:grid',
    '<a class="rv feat-post" href="/blog-construction-information-management" style="display:grid')
sub('<a class="post rv dl${i % 3}" href="https://www.brikito.com/blog"',
    '<a class="post rv dl${i % 3}" href="/${SLUGS[i]}"')

# ---- about: founder photo --------------------------------------------------
old_ph = re.search(r'<div class="rv" style="aspect-ratio:1;border-radius:var\(--r-xl\);background:#0B0B0F;[^"]*">\$\{logo\(90, \'grad\'\)\}<span style="color:#8E8E95;font-size:14px">\[Founder photo\]</span></div>', s)
if not old_ph:
    sys.exit("founder placeholder not found")
s = s.replace(old_ph.group(0),
    '<div class="rv founder-photo"><img src="/images/team/aashiq-ahamed.jpg" width="880" height="1100" '
    'alt="Aashiq Ahamed, Founder of Brikito" loading="lazy" decoding="async"></div>')

# ---- book a demo: the live form ------------------------------------------
fs = s.index('<form class="form rv dl2" data-form novalidate>')
fe = s.index('</form>', fs) + len('</form>')
LIVE_FORM = '''<form class="form rv dl2" id="demoRequestForm" data-form>
<h2 class="full h4" style="font-size:26px">Let’s find the right fit.</h2><p class="full muted" style="margin-top:-6px;font-size:15px">Share a few details. Our team will follow up to schedule.</p>
<div class="hp" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
<label>First name<input id="firstName" name="firstName" required autocomplete="given-name"></label><label>Last name<input id="lastName" name="lastName" required autocomplete="family-name"></label>
<label class="full">Work email<input type="email" id="workEmail" name="workEmail" required autocomplete="email"></label>
<label>Company<input id="company" name="company" required autocomplete="organization"></label>
<label>Your role<select id="role" name="role" required><option value="">Select</option><option>Project Manager</option><option>Real Estate Owner</option><option>Contractor</option><option>Other</option></select></label>
<label class="full" id="otherRoleField" hidden>Please specify your role<input id="otherRole" name="otherRole" autocomplete="organization-title"></label>
<label>Team size<select id="teamSize" name="teamSize"><option value="">Select</option><option>1–10</option><option>11–50</option><option>51–200</option><option>201–500</option><option>500+</option></select></label>
<label>Country / region<select id="region" name="region"><option value="">Select</option><option>India</option><option>United Arab Emirates</option><option>Singapore</option><option>Other</option></select></label>
<label class="full" id="otherRegionField" hidden>Please specify your country / region<input id="otherRegion" name="otherRegion" autocomplete="country-name"></label>
<label class="full">What would you like to improve?<textarea id="challenge" name="challenge" placeholder="Material tracking, daily reports, contractor oversight…"></textarea></label>
<button class="btn btn-p full" type="submit" style="justify-content:center">Request my demo</button>
<p class="full form-msg" id="formMessage" role="status" aria-live="polite"></p>
<p class="full note">By submitting, you agree Brikito may contact you about your request. See our <a class="link" href="/privacy">privacy policy</a>.</p></form>'''
s = s[:fs] + LIVE_FORM + s[fe:]

hs = s.index("  // form\n  const form = root.querySelector('[data-form]');")
he = s.index("  onScroll();\n}", hs)
LIVE_SUBMIT = r'''  // form: the live demo-request form, saved to the "Brikito – Demo Requests" Google Sheet
  const form = root.querySelector('#demoRequestForm');
  if (form) {
    const $ = id => form.querySelector('#' + id), msg = $('formMessage');
    const sync = (sel, field, input) => () => { const o = $(sel).value === 'Other'; $(field).hidden = !o; $(input).required = o; if (!o) $(input).value = ''; };
    const syncRole = sync('role', 'otherRoleField', 'otherRole'), syncRegion = sync('region', 'otherRegionField', 'otherRegion');
    $('role').addEventListener('change', syncRole); $('region').addEventListener('change', syncRegion); syncRole(); syncRegion();
    const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxxAiBit98TmUJIy03P_ACF01zgZFdtxMUm5bkmi3zpIEyyrWDuqpKLVZmYCkmEvUzf/exec';
    const btn = form.querySelector('button[type="submit"]'), label = btn.innerHTML;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new URLSearchParams(new FormData(form)); data.append('page', location.href);
      btn.disabled = true; btn.textContent = 'Sending…'; msg.className = 'full form-msg';
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
        .then(() => {
          form.reset(); syncRole(); syncRegion();
          msg.textContent = 'Thanks! Your demo request has been received. Our team will contact you within one working day.'; msg.className = 'full form-msg ok';
          if (window.gtag) gtag('event', 'generate_lead', { form: 'book_a_demo' });
          if (window.fbq) fbq('track', 'Lead');
        })
        .catch(() => { msg.textContent = 'Sorry, something went wrong. Please try again, or email us at marketing@brikito.com.'; msg.className = 'full form-msg bad'; })
        .finally(() => { btn.disabled = false; btn.innerHTML = label; });
    });
  }
'''
s = s[:hs] + LIVE_SUBMIT + s[he:]

# ---- privacy: the full live policy ---------------------------------------
ps = s.index("<section class=\"sec-sm\"><div class=\"wrap\"><div class=\"prose\" style=\"margin:0 auto\">", s.index("P.privacy = () =>"))
pe = s.index("</div></div></section>`;", ps) + len("</div></div></section>`;")
s = s[:ps] + '<section class="sec-sm"><div class="wrap"><div class="prose" style="margin:0 auto">${window.__PRIVACY_HTML__ || \'\'}</div></div></section>`;' + s[pe:]
sub('<p class="lead rv dl2">Last updated: <span class="ph">[date]</span></p>',
    '<p class="lead rv dl2">Brikito is a site-management app for construction companies. This policy explains what we collect, why, and your rights under India’s DPDP Act, 2023.</p><p class="rv dl3" style="margin-top:14px"><span class="chip">Last updated: <span class="ph">[ date ]</span></span> <span class="chip">India · DPDP Act, 2023</span></p>')

# ---- 404 page in the same design -----------------------------------------
sub("const ROUTES = [", """P.notfound = () => `
<section class="hero" style="padding-bottom:40px"><div class="wrap"><div class="copy"><p class="eyebrow rv">Error 404</p><h1 class="d1 rv dl1">This page has moved off site.</h1><p class="lead rv dl2">The page you’re looking for doesn’t exist or has a new address. Try one of these instead.</p><div class="btns rv dl3" style="justify-content:center">${go('home', 'Go to the homepage')}${go('book-a-demo', 'Book a demo', 'btn btn-s')}</div></div></div></section>
${explore('')}`;
const ROUTES = [""")

# ---- runtime: pre-rendered pages ------------------------------------------
sub("document.querySelectorAll('.nav .links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + route));",
    "document.querySelectorAll('.nav .links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === U(route)));")
start = s.index("document.getElementById('shell').innerHTML = nav();")
end = s.index("addEventListener('hashchange', navigate);\nnavigate();")
handlers = s[start + len("document.getElementById('shell').innerHTML = nav();"):end]
BOOT = r'''const BUILD = window.__BUILD_ROUTE__;
if (BUILD) {
  // build mode: render one page so tools/build-pages.py can save it as HTML
  document.getElementById('shell').innerHTML = nav();
  const app = document.getElementById('app');
  app.innerHTML = P[BUILD]() + footer();
  const h = app.querySelector('.hero'); if (h && !h.querySelector('.aurora')) h.insertAdjacentHTML('afterbegin', '<div class="aurora" aria-hidden="true"></div>');
  document.querySelectorAll('.nav .links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === U(BUILD)));
  window.__BUILT__ = true;
  return;
}
// live pages: the HTML is already there; add tracking and interactions
try { const p = location.pathname; if (/\.html$/.test(p)) history.replaceState(null, '', p.replace(/\/index\.html$/, '/').replace(/\.html$/, '') + location.search + location.hash); } catch (e) {}
if (!document.querySelector('script[data-tracking]')) { const t = document.createElement('script'); t.src = '/components/tracking.js'; t.dataset.tracking = '1'; document.head.appendChild(t); }
''' + handlers + r'''
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="/"]'); if (!a || e.metaKey || e.ctrlKey || a.target) return;
  const bar = document.querySelector('.progress'); if (bar) { bar.style.opacity = 1; bar.style.width = '70%'; }
});
addEventListener('pageshow', () => { const bar = document.querySelector('.progress'); if (bar) { bar.style.opacity = 0; bar.style.width = 0; } });
wire(document.getElementById('app') || document.body);
'''
s = s[:start] + BOOT + s[end + len("addEventListener('hashchange', navigate);\nnavigate();"):]

# Brik chat assistant (assets/brik-chat.js) on every page
TRK = "if (!document.querySelector('script[data-tracking]')) { const t = document.createElement('script'); t.src = '/components/tracking.js'; t.dataset.tracking = '1'; document.head.appendChild(t); }"
assert TRK in s, "tracking loader not found"
s = s.replace(TRK, TRK + "\nif (!document.querySelector('script[data-brikchat]')) { const c = document.createElement('script'); c.src = '/assets/brik-chat.js?v=20261110c'; c.defer = true; c.dataset.brikchat = '1'; document.head.appendChild(c); }\nif (!document.querySelector('script[data-exitoffer]')) { const x = document.createElement('script'); x.src = '/assets/exit-offer.js?v=20261110c'; x.defer = true; x.dataset.exitoffer = '1'; document.head.appendChild(x); }\nif (!document.querySelector('script[data-newsletter]')) { const n = document.createElement('script'); n.src = '/assets/newsletter.js?v=20261111a'; n.defer = true; n.dataset.newsletter = '1'; document.head.appendChild(n); }", 1)

# Book a demo: round Brik head beside the "Brik will be in the demo" note
s = s.replace('<img src="/img/brik-o.webp" alt="" style="width:64px;height:auto;flex:none">', '<img src="/img/brik-head-v2.webp" alt="" style="width:56px;height:56px;border-radius:50%;flex:none">')

# Book a demo form: WhatsApp number next to work email
s = s.replace('<label class="full">Work email<input type="email" id="workEmail" name="workEmail" required autocomplete="email"></label>', '<label>Work email<input type="email" id="workEmail" name="workEmail" required autocomplete="email"></label><label>WhatsApp number<input type="tel" id="whatsapp" name="whatsapp" required autocomplete="tel" inputmode="tel" placeholder="+91 98765 43210" pattern="[+]?[0-9][0-9 ]{6,18}" title="Number with country code, digits only, e.g. +91 98765 43210"></label>')

# Top menu: launch offer pill before Book a demo, and in the mobile menu
s = s.replace('<a class="btn btn-p btn-sm" href="/book-a-demo">Book a demo</a>', '<a class="nav-offer" href="/book-a-demo?offer=free-month" title="Launch offer: first 10 teams get 1 month free"><span class="nav-offer-dot" aria-hidden="true"></span>Launch offer · 10 spots</a><a class="btn btn-p btn-sm" href="/book-a-demo">Book a demo</a>')
s = s.replace('.map(r => `<a href="${U(r[0])}">${r[1]}</a>`).join(\'\')}<a href="https://ap', '.map(r => `<a href="${U(r[0])}">${r[1]}</a>`).join(\'\')}<a class="sheet-offer" href="/book-a-demo?offer=free-month">🎁 Launch offer · 10 spots</a><a href="https://ap')

# Sign in opens the Brikito app in a new tab
n = s.count('href="https://app.brikito.com/signup"')
s = s.replace('href="https://app.brikito.com/signup"', 'href="https://app.brikito.com/signup" target="_blank" rel="noopener"')
print("app links opening in new tab:", n)

out = os.path.join(ROOT, "assets", "site.js")
open(out, "w", encoding="utf-8").write("/* Brikito website: design + interactions. Built by tools/patch-redesign.py */\n" + s)
left = re.findall(r'href="#(?:\$\{|[a-z-]+")', s)
print("written", out, len(s), "bytes; hash links left:", left)
