/* Brik chat: the Brikito website assistant.
 * A free, scripted chat (no paid AI service). Brik greets visitors, answers
 * common questions about Brikito, recommends a plan and collects demo leads
 * into the same "Brikito – Demo Requests" Google Sheet as the demo form.
 * Loaded on every page by assets/site.js. Edit the answers in ANSWERS below.
 */
(function () {
  if (window.__brikChat) return; window.__brikChat = true;

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxxAiBit98TmUJIy03P_ACF01zgZFdtxMUm5bkmi3zpIEyyrWDuqpKLVZmYCkmEvUzf/exec';
  var AVATAR = '/img/brik-head-v2.webp';
  var KEY = 'brikChat.v1';

  /* ---------- what Brik says ---------- */
  var MAIN = ['What is Brikito?', 'Products', 'Pricing', 'Free trial / pilot', 'Book a demo'];
  var ANSWERS = {
    about: { say: ['Brikito is one app that runs your construction site: chat, attendance, drawings, meetings, mail and a live dashboard, with me (Brik AI) on every screen.', 'Your crews keep working the way they already do, in their own language. Every message becomes a record, an approval or a report for the office.'], chips: ['Products', 'Who is it for?', 'Book a demo'] },
    products: { say: ['Everything lives inside <b>Brikito Console</b>, one login for every project. On top of it:', '<b>Brik AI</b>: answers from live project data and drafts indents, POs and replies.<br><b>BrikChat</b>: site chat like WhatsApp, where every message is tagged and routed.<br><b>BrikVision</b>: AI on the CCTV you already have, for headcount, deliveries, PPE and progress.<br><b>BrikDocs</b>: DPR, DLR, BOQ, BBS and more in one tap.'], chips: ['Brik AI', 'BrikChat', 'BrikVision', 'BrikDocs', 'Pricing'] },
    brikai: { say: ['That’s me 👷 I read every message, voice note, photo and PDF on your project, in 7 Indian languages.', 'Ask “What’s waiting for my approval on Tower B?” and I answer from live data, with sources. I draft indents, POs and replies, but a person always approves. I never send anything on my own.'], chips: ['Pricing', 'Book a demo'], link: ['/brik-ai', 'See Brik AI'] },
    brikchat: { say: ['BrikChat feels like WhatsApp, but it’s built for a site. Every message is auto-tagged as an update, attendance, enquiry or ticket and routed to the right person.', 'Voice notes are transcribed in 7 languages, and groups can be set up by block, trade or contractor. It’s in development, with early access open.'], chips: ['Book a demo', 'Products'], link: ['/brikchat', 'See BrikChat'] },
    brikvision: { say: ['BrikVision adds AI to the CCTV cameras you already have. It counts people, logs deliveries, checks helmets and vests, and tracks progress around the clock, on your phone.', 'Pilots are available on request.'], chips: ['Request a pilot', 'Pricing'], link: ['/brikvision', 'See BrikVision'] },
    brikdocs: { say: ['BrikDocs builds every report your project needs from the work your team already logged: DPR, DLR, BOQ, BBS, estimates, schedules, GRN, stock and more, in one tap.', 'DPR and DLR are available now, and the full suite is in pilot.'], chips: ['Book a demo', 'Pricing'], link: ['/brikdocs', 'See BrikDocs'] },
    pricing: { say: ['We price to your projects and team, so there’s no fixed rate card. There are three plans:', '<b>Standard</b>: up to 2 projects and 25 users, with a free trial.<br><b>Professional</b>: up to 5 projects and 75 users, plus planning, contractor oversight and the full Brik AI.<br><b>Enterprise</b>: unlimited projects, plus BrikVision, BrikDocs, integrations and a dedicated team.', 'Tell me a little about your projects and I’ll get you a quote within one working day.'], chips: ['Get a quote', 'Free trial / pilot', 'Compare plans'] },
    compare: { say: ['Here is the full plan comparison.'], chips: ['Get a quote', 'Book a demo'], link: ['/pricing', 'Compare plans'] },
    trial: { say: ['Yes! The <b>Standard</b> plan has a free trial. Larger teams on <b>Enterprise</b> can start with a pilot on one live project.', 'Shall I set that up for you?'], chips: ['Start a free trial', 'Request a pilot', 'Pricing'] },
    who: { say: ['Brikito is built for contractors, real estate developers, PMCs and general contractors: teams that execute their own work or oversee contractors.', 'It’s running today on live residential, metro and logistics sites.'], chips: ['Pricing', 'Book a demo'] },
    lang: { say: ['Yes. Crews can type or send voice notes in Tamil, Hindi, English and other Indian languages. I understand them and turn them into structured records.'], chips: ['Book a demo', 'Products'] },
    ai_safe: { say: ['Never on its own. I draft; a person always confirms. Nothing is sent, ordered or published until someone on your team approves it.'], chips: ['Book a demo', 'Pricing'] },
    privacy: { say: ['Your data stays yours. Answers come only from your own project, access is role-based, and selfie check-in confirms presence only. It isn’t surveillance.'], chips: ['Book a demo'], link: ['/privacy', 'Privacy policy'] },
    attendance: { say: ['Workers check in with a selfie at the gate, so you get a live headcount and hours. There’s no register and no month-end reconciliation. Geofencing, labour lists, OT and labour bills are included.'], chips: ['Book a demo', 'Pricing'] },
    human: { say: ['Happy to connect you with our team. You can email <a href="mailto:hey@brikito.com">hey@brikito.com</a>, or leave your details here and we’ll reach out within one working day.'], chips: ['Leave my details', 'Book a demo'] },
    thanks: { say: ['You’re welcome! Anything else I can help with?'], chips: MAIN },
    fallback: { say: ['Good question. I’m still learning that one 🙂 Our team can answer it properly.', 'Want me to take your details so they can reach out?'], chips: ['Leave my details', 'Pricing', 'Products'] }
  };
  /* typed text → answer (first match wins) */
  var INTENTS = [
    [/demo|meeting|call me|show me/i, 'lead:demo'],
    [/quote|price|pricing|cost|charge|rate|plan|how much|₹|rs\b|inr/i, 'pricing'],
    [/trial|free|pilot|test/i, 'trial'],
    [/compare/i, 'compare'],
    [/whatsapp|brikchat|chat app|group/i, 'brikchat'],
    [/cctv|camera|vision|ppe|helmet|headcount|surveillance/i, 'brikvision'],
    [/dpr|dlr|boq|bbs|report|docs|estimate/i, 'brikdocs'],
    [/attendance|labou?r|selfie|check.?in|worker/i, 'attendance'],
    [/language|tamil|hindi|telugu|kannada|malayalam|voice/i, 'lang'],
    [/privacy|secure|security|data|safe/i, 'privacy'],
    [/approve|auto|without|on its own|replace/i, 'ai_safe'],
    [/brik ?ai|assistant|\bai\b/i, 'brikai'],
    [/product|feature|module|console/i, 'products'],
    [/who|contractor|developer|builder|pmc|suitable|for me/i, 'who'],
    [/what is|about|brikito/i, 'about'],
    [/human|person|team|contact|email|phone|talk|sales/i, 'human'],
    [/\b(thank|thanks|thx|great|cool|ok(ay)?)\b/i, 'thanks'],
    [/\b(hi|hello|hey|hlo|vanakkam|namaste)\b/i, 'hello']
  ];
  var CHIP = {
    'What is Brikito?': 'about', 'Products': 'products', 'Pricing': 'pricing', 'Compare plans': 'compare',
    'Free trial / pilot': 'trial', 'Who is it for?': 'who', 'Brik AI': 'brikai', 'BrikChat': 'brikchat',
    'BrikVision': 'brikvision', 'BrikDocs': 'brikdocs', 'Talk to a human': 'human',
    'Book a demo': 'lead:demo', 'Get a quote': 'lead:quote', 'Start a free trial': 'lead:trial',
    'Request a pilot': 'lead:pilot', 'Leave my details': 'lead:contact'
  };
  var GOAL = { demo: 'Book a demo', quote: 'Get a quote', trial: 'Free trial', pilot: 'Pilot request', contact: 'Contact request' };

  /* lead questions, asked one at a time */
  var STEPS = [
    { k: 'role', q: 'Great! First, which best describes you?', chips: ['Contractor', 'Real estate developer', 'PMC / consultant', 'Other'] },
    { k: 'projects', q: 'How many active projects do you run?', chips: ['1–2', '3–5', '6 or more'] },
    { k: 'region', q: 'Where are your sites?', chips: ['India', 'UAE', 'Singapore', 'Sri Lanka', 'Other'] },
    { k: 'name', q: 'What’s your name?', ph: 'Your full name' },
    { k: 'email', q: 'And your work email, so our team can send the details?', ph: 'you@company.com', type: 'email' },
    { k: 'phone', q: 'A phone or WhatsApp number? It’s optional. Type “skip” if you’d rather not.', ph: '+91 98xxx xxxxx', type: 'tel' },
    { k: 'company', q: 'Last one: your company name?', ph: 'Company name' }
  ];

  /* ---------- state ---------- */
  var st = load() || { open: false, msgs: [], step: -1, lead: {}, goal: '', done: false, greeted: false, chips: null, ph: '' };
  function load() { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch (e) { return null; } }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function track(name, p) { try { if (window.gtag) gtag('event', name, p || {}); } catch (e) {} }

  /* ---------- styles ---------- */
  var css = '' +
    '.bc-launch{position:fixed;right:22px;bottom:22px;z-index:9990;display:flex;align-items:center;gap:10px;border:0;background:none;padding:0;cursor:pointer;font:inherit}' +
    '.bc-launch .bc-av{width:62px;height:62px;border-radius:50%;box-shadow:0 10px 30px -6px rgba(36,41,120,.45),0 0 0 3px #fff;background:#F3ECE2;transition:transform .25s}' +
    '.bc-launch:hover .bc-av{transform:translateY(-2px) scale(1.04)}' +
    '.bc-launch .bc-dot{position:absolute;right:2px;bottom:4px;width:14px;height:14px;border-radius:50%;background:#22C55E;border:2.5px solid #fff}' +
    '.bc-launch .bc-pill{background:#0B0B0F;color:#fff;font-size:14px;font-weight:600;padding:10px 16px;border-radius:999px;box-shadow:0 8px 24px -8px rgba(11,11,15,.5)}' +
    '.bc-tease{position:fixed;right:22px;bottom:98px;z-index:9990;max-width:280px;background:#fff;border-radius:18px 18px 4px 18px;padding:14px 38px 14px 16px;font-size:14.5px;line-height:1.45;color:#1D1D1F;box-shadow:0 18px 50px -12px rgba(11,11,15,.28),0 0 0 1px rgba(11,11,15,.06);cursor:pointer;animation:bcUp .4s ease both}' +
    '.bc-tease b{display:block;margin-bottom:2px}.bc-tease .bc-x{position:absolute;right:8px;top:8px}' +
    '.bc-x{border:0;background:none;width:26px;height:26px;border-radius:50%;cursor:pointer;color:#6E6E73;font-size:18px;line-height:1}.bc-x:hover{background:rgba(11,11,15,.06)}' +
    '.bc-panel{position:fixed;right:22px;bottom:22px;z-index:9991;width:384px;height:min(620px,calc(100vh - 44px));display:flex;flex-direction:column;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(11,11,15,.4),0 0 0 1px rgba(11,11,15,.06);font-family:Inter,system-ui,sans-serif;animation:bcUp .3s ease both}' +
    '@keyframes bcUp{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}' +
    '.bc-head{display:flex;align-items:center;gap:12px;padding:16px 14px 16px 16px;background:linear-gradient(135deg,#7B2FE0,#5462F0 55%,#3A8EF6);color:#fff}' +
    '.bc-head img{width:44px;height:44px;border-radius:50%;background:#F3ECE2;box-shadow:0 0 0 2px rgba(255,255,255,.5)}' +
    '.bc-head b{display:block;font-size:16px}.bc-head span{font-size:12.5px;opacity:.9}.bc-head span:before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#4ADE80;margin-right:6px;vertical-align:1px}' +
    '.bc-head .bc-x{margin-left:auto;color:#fff}.bc-head .bc-x:hover{background:rgba(255,255,255,.18)}' +
    '.bc-body{flex:1;overflow-y:auto;padding:18px 14px 8px;background:#F5F5F7;display:flex;flex-direction:column;gap:8px;overscroll-behavior:contain}' +
    '.bc-m{display:flex;gap:8px;align-items:flex-end;max-width:88%}.bc-m p{margin:0;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.5;color:#1D1D1F}' +
    '.bc-m.bot p{background:#fff;border-bottom-left-radius:5px;box-shadow:0 1px 2px rgba(11,11,15,.06)}.bc-m.bot img{width:26px;height:26px;border-radius:50%;flex:none;background:#F3ECE2}' +
    '.bc-m.bot.cont img{visibility:hidden}.bc-m.me{align-self:flex-end}.bc-m.me p{background:#0B0B0F;color:#fff;border-bottom-right-radius:5px}' +
    '.bc-m a{color:#5462F0;font-weight:600}.bc-m.me a{color:#fff}' +
    '.bc-link{margin-left:34px;align-self:flex-start;font-size:14px;font-weight:600;color:#5462F0;text-decoration:none;background:#fff;border:1px solid rgba(84,98,240,.25);padding:7px 12px;border-radius:999px}.bc-link:hover{background:#EEF0FF}' +
    '.bc-typing{display:flex;gap:4px;padding:12px 14px!important}.bc-typing i{width:7px;height:7px;border-radius:50%;background:#B0B0B8;animation:bcB 1s infinite}.bc-typing i:nth-child(2){animation-delay:.15s}.bc-typing i:nth-child(3){animation-delay:.3s}' +
    '@keyframes bcB{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-4px);opacity:1}}' +
    '.bc-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px 10px;background:#F5F5F7}' +
    '.bc-chips button{font:inherit;font-size:13.5px;font-weight:500;color:#3A3FC7;background:#fff;border:1px solid rgba(84,98,240,.3);padding:7px 12px;border-radius:999px;cursor:pointer;transition:background .15s}.bc-chips button:hover{background:#EEF0FF}' +
    '.bc-form{display:flex;gap:8px;padding:10px 12px 12px;border-top:1px solid rgba(11,11,15,.07);background:#fff}' +
    '.bc-form input{flex:1;min-width:0;font:inherit;font-size:15px;border:1px solid rgba(11,11,15,.12);border-radius:999px;padding:10px 14px;outline:none}.bc-form input:focus{border-color:#5462F0;box-shadow:0 0 0 3px rgba(84,98,240,.15)}' +
    '.bc-form button{flex:none;width:42px;height:42px;border-radius:50%;border:0;background:#0B0B0F;color:#fff;cursor:pointer;display:grid;place-items:center}.bc-form button:disabled{opacity:.35;cursor:default}' +
    '.bc-foot{font-size:11px;color:#8E8E93;text-align:center;padding:0 0 10px;background:#fff}' +
    '@media (max-width:560px){.bc-panel{right:0;bottom:0;width:100%;height:100%;max-height:100dvh;border-radius:0}.bc-launch{right:14px;bottom:14px}.bc-launch .bc-pill{display:none}.bc-tease{right:14px;bottom:86px;max-width:calc(100% - 28px)}}' +
    '.bc-panel[hidden],.bc-launch[hidden]{display:none!important}' +
    '@media print{.bc-launch,.bc-panel,.bc-tease{display:none}}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  /* ---------- DOM ---------- */
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var launch = el('button', 'bc-launch');
  launch.type = 'button'; launch.setAttribute('aria-label', 'Chat with Brik, the Brikito assistant');
  launch.innerHTML = '<span class="bc-pill">Ask Brik</span><span style="position:relative"><img class="bc-av" src="' + AVATAR + '" alt=""><span class="bc-dot"></span></span>';
  var panel, body, chips, form, input, sendBtn, tease;

  function build() {
    panel = el('section', 'bc-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Chat with Brik');
    panel.innerHTML = '<div class="bc-head"><img src="' + AVATAR + '" alt=""><div><b>Brik</b><span>Brikito assistant · online</span></div><button class="bc-x" type="button" aria-label="Close chat">✕</button></div>' +
      '<div class="bc-body" aria-live="polite"></div><div class="bc-chips"></div>' +
      '<form class="bc-form"><input type="text" aria-label="Type your message" placeholder="Ask Brik anything…" autocomplete="off"><button type="submit" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>' +
      '<div class="bc-foot">Brik is Brikito’s website assistant. Our team follows up personally.</div>';
    body = panel.querySelector('.bc-body'); chips = panel.querySelector('.bc-chips'); form = panel.querySelector('form');
    input = form.querySelector('input'); sendBtn = form.querySelector('button');
    panel.querySelector('.bc-x').onclick = close;
    form.onsubmit = function (e) { e.preventDefault(); var v = input.value.trim(); if (!v) return; input.value = ''; userSays(v); };
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.body.appendChild(panel);
    st.msgs.forEach(function (m) { paint(m, false); });
    setChips(st.chips); setInput(st.ph);
  }

  function paint(m, animate) {
    var node;
    if (m.link) { node = el('a', 'bc-link', esc(m.link[1]) + ' ›'); node.href = m.link[0]; }
    else {
      node = el('div', 'bc-m ' + m.who); var last = body.lastElementChild;
      if (m.who === 'bot' && last && last.classList.contains('bot')) node.classList.add('cont');
      node.innerHTML = (m.who === 'bot' ? '<img src="' + AVATAR + '" alt="">' : '') + '<p>' + m.html + '</p>';
    }
    body.appendChild(node); body.scrollTop = body.scrollHeight;
  }
  function push(m) { st.msgs.push(m); save(); paint(m, true); }

  var queue = Promise.resolve();
  function botSay(lines, opts) {
    opts = opts || {};
    setChips(null);
    queue = queue.then(function () {
      return lines.reduce(function (p, line) {
        return p.then(function () {
          var t = el('div', 'bc-m bot'); t.innerHTML = '<img src="' + AVATAR + '" alt=""><p class="bc-typing"><i></i><i></i><i></i></p>';
          if (body.lastElementChild && body.lastElementChild.classList.contains('bot')) t.classList.add('cont');
          body.appendChild(t); body.scrollTop = body.scrollHeight;
          var wait = Math.min(1400, 450 + line.replace(/<[^>]+>/g, '').length * 9);
          return new Promise(function (r) { setTimeout(function () { t.remove(); push({ who: 'bot', html: line }); r(); }, wait); });
        });
      }, Promise.resolve()).then(function () {
        if (opts.link) push({ link: opts.link });
        setChips(opts.chips || null); setInput(opts.ph || '', opts.type);
      });
    });
    return queue;
  }
  function setChips(list) {
    st.chips = list; save(); if (!chips) return; chips.innerHTML = '';
    (list || []).forEach(function (c) { var b = el('button', '', esc(c)); b.type = 'button'; b.onclick = function () { userSays(c, true); }; chips.appendChild(b); });
    chips.style.display = list && list.length ? '' : 'none';
  }
  function setInput(ph, type) { st.ph = ph || ''; save(); if (!input) return; input.placeholder = ph || 'Ask Brik anything…'; input.type = type === 'email' ? 'email' : 'text'; input.inputMode = type === 'tel' ? 'tel' : type === 'email' ? 'email' : 'text'; }

  /* ---------- conversation ---------- */
  function greet() {
    st.greeted = true; save();
    var page = location.pathname.replace(/\/$/, '') || '/';
    var hook = /pricing/.test(page) ? 'Looking at plans? I can help you pick one and get a quote.' :
      /brikvision/.test(page) ? 'Curious how AI could watch your site cameras? Ask me anything.' :
      /brik-ai|brikchat|brikdocs|console/.test(page) ? 'Want to see how this works on a real site? Ask me anything.' :
      'I can show you how Brikito runs your site from one app.';
    botSay(['Hi there 👋 I’m <b>Brik</b>, Brikito’s AI site assistant.', hook + ' What would you like to know?'], { chips: MAIN });
  }

  function userSays(text, fromChip) {
    push({ who: 'me', html: esc(text) });
    if (st.step >= 0) return answerStep(text);
    var key = fromChip ? CHIP[text] : null;
    if (!key) { for (var i = 0; i < INTENTS.length; i++) if (INTENTS[i][0].test(text)) { key = INTENTS[i][1]; break; } }
    if (!key && CHIP[text]) key = CHIP[text];
    respond(key || 'fallback', text);
  }

  function respond(key) {
    if (key === 'hello') return botSay(['Hello! 😊 What would you like to know about Brikito?'], { chips: MAIN });
    if (key.indexOf('lead:') === 0) return startLead(key.slice(5));
    var a = ANSWERS[key] || ANSWERS.fallback;
    track('brik_chat_question', { topic: key });
    botSay(a.say, { chips: a.chips, link: a.link });
  }

  function startLead(goal) {
    if (st.done) return botSay(['We already have your details, ' + esc(st.lead.name || '') + '. Our team will be in touch within one working day 🙌', 'Anything else I can help with meanwhile?'], { chips: MAIN });
    st.goal = goal; st.step = 0; save();
    track('brik_chat_lead_start', { goal: goal });
    var intro = goal === 'demo' ? 'Let’s book your demo! I’ll ask a few quick questions so our team can tailor it to your sites.' :
      goal === 'quote' ? 'Let’s get you a quote. A few quick questions about your projects first.' :
      goal === 'trial' ? 'Let’s get your free trial started. A few quick questions first.' :
      goal === 'pilot' ? 'A pilot on one live project is the best way to see it. A few quick questions first.' :
      'Sure, I’ll pass your details to our team.';
    botSay([intro]).then(ask);
  }
  function ask() { var s = STEPS[st.step]; botSay([s.q], { chips: s.chips || (s.k === 'phone' ? ['Skip'] : null), ph: s.ph || 'Type your answer…', type: s.type }); }

  function answerStep(text) {
    var s = STEPS[st.step], v = text.trim();
    if (s.k === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return botSay(['Hmm, that doesn’t look like an email address. Could you check it?'], { ph: s.ph, type: 'email' });
    if (s.k === 'phone' && /^(skip|no|na|n\/a|-)$/i.test(v)) v = '';
    if (s.k === 'phone' && v && !/^[+\d][\d\s()-]{6,}$/.test(v)) return botSay(['That number looks a bit short. Please include the country code, or type “skip”.'], { ph: s.ph, chips: ['Skip'], type: 'tel' });
    if (s.k === 'name' && v.length < 2) return botSay(['Could you type your name?'], { ph: s.ph });
    st.lead[s.k] = v; st.step++; save();
    if (s.k === 'projects') {
      var plan = /6/.test(v) ? 'Enterprise' : /3/.test(v) ? 'Professional' : 'Standard';
      st.lead.plan = plan; save();
      return botSay(['With ' + esc(v) + ' active projects, <b>' + plan + '</b> is likely the right fit' + (plan === 'Standard' ? ', and it comes with a free trial.' : plan === 'Enterprise' ? ', and you can start with a pilot on one live project.' : '.')]).then(ask);
    }
    if (st.step < STEPS.length) return ask();
    submit();
  }

  function submit() {
    st.step = -1; save();
    var L = st.lead, parts = (L.name || '').split(/\s+/);
    var convo = st.msgs.filter(function (m) { return m.who; }).map(function (m) { return (m.who === 'me' ? 'Visitor: ' : 'Brik: ') + m.html.replace(/<br>/g, ' ').replace(/<[^>]+>/g, ''); }).join('\n');
    var data = new URLSearchParams({
      firstName: parts[0] || '', lastName: parts.slice(1).join(' '), workEmail: L.email || '', company: L.company || '',
      role: L.role || '', otherRole: '', teamSize: (L.projects || '') + ' active projects', region: L.region || '', otherRegion: '',
      challenge: '[Brik chat] ' + (GOAL[st.goal] || 'Lead') + ' · suggested plan: ' + (L.plan || '-') + (L.phone ? ' · phone: ' + L.phone : '') + '\n\n' + convo.slice(-3500),
      website: '', page: location.href + ' (Brik chat)'
    });
    botSay(['Thanks, ' + esc(parts[0] || 'there') + '! Sending your details to the team…']).then(function () {
      return fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: data }).then(function () {
        st.done = true; save();
        track('generate_lead', { form: 'brik_chat', goal: st.goal });
        try { if (window.fbq) fbq('track', 'Lead'); } catch (e) {}
        return botSay(['Done ✅ Our team will contact you at <b>' + esc(L.email) + '</b> within one working day' + (st.goal === 'demo' ? ' to fix a demo time.' : '.'), 'Meanwhile, anything else you’d like to know?'], { chips: ['Products', 'Free trial / pilot', 'What is Brikito?'] });
      }).catch(function () {
        return botSay(['Sorry, that didn’t go through. Please try again in a moment, or email <a href="mailto:hey@brikito.com">hey@brikito.com</a>.'], { chips: ['Leave my details'] });
      });
    });
  }

  /* ---------- open / close ---------- */
  function open() {
    if (tease) { tease.remove(); tease = null; }
    if (!panel) build();
    panel.hidden = false; launch.hidden = true; st.open = true; save();
    if (!st.greeted) greet();
    track('brik_chat_open');
    setTimeout(function () { if (matchMedia('(min-width:561px)').matches) input.focus(); }, 60);
  }
  function close() { if (panel) panel.hidden = true; launch.hidden = false; st.open = false; save(); launch.focus(); }
  launch.onclick = open;

  function start() {
    document.body.appendChild(launch);
    if (st.open) return open();
    var seen; try { seen = sessionStorage.getItem(KEY + '.tease'); } catch (e) {}
    if (seen || st.greeted || /book-a-demo/.test(location.pathname)) return;
    setTimeout(function () {
      if (st.open || (panel && !panel.hidden)) return;
      tease = el('div', 'bc-tease', '<b>Hi, I’m Brik 👷</b>Want to see how Brikito runs your site from one app?<button class="bc-x" type="button" aria-label="Dismiss">✕</button>');
      tease.onclick = function (e) { if (e.target.closest('.bc-x')) { tease.remove(); tease = null; return; } open(); };
      document.body.appendChild(tease);
      try { sessionStorage.setItem(KEY + '.tease', '1'); } catch (e) {}
    }, 7000);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
