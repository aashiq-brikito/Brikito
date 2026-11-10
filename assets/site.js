/* Brikito website: design + interactions. Built by tools/patch-redesign.py */
(function () {
// ---------------- helpers ----------------
const BACK = 'M25 3.5Q25 0 28.5 0L96.5 0Q100 0 100 3.5L100 71.5Q100 75 96.5 75L75 75L75 28.5Q75 25 71.5 25L25 25Z';
const FRONT = 'M0 28.5Q0 25 3.5 25L25 25L25 71.5Q25 75 28.5 75L75 75L75 96.5Q75 100 71.5 100L3.5 100Q0 100 0 96.5Z';
let gid = 0;
const U = r => r === 'home' ? '/' : r === 'journal' ? '/blog' : '/' + r;
const logo = (s = 24, mode = 'grad') => {
  if (mode === 'black') return `<svg width="${s}" height="${s}" viewBox="0 0 100 100" aria-hidden="true"><path d="${BACK} ${FRONT}" fill="#0B0B0F"/></svg>`;
  if (mode === 'white') return `<svg width="${s}" height="${s}" viewBox="0 0 100 100" aria-hidden="true"><path d="${BACK} ${FRONT}" fill="#fff"/></svg>`;
  const id = 'lg' + (++gid);
  return `<svg width="${s}" height="${s}" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7B2FE0"/><stop offset=".5" stop-color="#5462F0"/><stop offset="1" stop-color="#3A8EF6"/></linearGradient></defs><path d="${BACK} ${FRONT}" fill="url(#${id})"/></svg>`;
};
const IC = {
  chat: 'M4 5h16v11H8l-4 4z', ai: 'M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
  att: 'M8 11a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 21a8 8 0 0 1 16 0', draw: 'M4 4h11l5 5v11H4zM15 4v5h5M8 13h8M8 17h5',
  dash: 'M4 20V10M10 20V4M16 20v-7M22 20H2', doc: 'M7 3h7l5 5v13H7zM14 3v5h5', meet: 'M3 6h12v12H3zM15 10l6-3v10l-6-3',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7', eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  flag: 'M5 21V4h11l-2 4 2 4H5', mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3M5 11a7 7 0 0 0 14 0M12 18v3',
  lang: 'M4 5h8M8 3v2M6 5c0 4 2 7 6 9M10 5c0 3-2 6-6 8M13 21l4-10 4 10M14.5 17h5', check: 'm5 12 5 5 9-10',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M21 21l-5-5', users: 'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 20v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  truck: 'M2 6h12v10H2zM14 10h4l4 3v3h-8M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4', hat: 'M3 18h18M5 18v-3a7 7 0 0 1 14 0v3M10 8V5h4v3',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5', clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 3', lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  rupee: 'M6 4h12M6 9h12M9 4c6 0 6 10 0 10H6l8 7', link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1',
  cam: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8', send: 'M4 12l16-8-6 16-3-7z', bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
};
const ic = (n, s = 22, c = 'currentColor', w = 1.7) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const chev = '<span class="ch" aria-hidden="true">›</span>';
const go = (r, label, cls = 'btn btn-p') => `<a class="${cls}" href="${U(r)}">${label}</a>`;
const lk = (r, label) => `<a class="link" href="${U(r)}">${label} ${chev}</a>`;
const status = s => ({
  live: '<span class="chip"><span class="dot live"></span>Live on pilot sites</span>',
  dev: '<span class="chip"><span class="dot dev"></span>In development · early access</span>',
  pilot: '<span class="chip"><span class="dot pilot"></span>Pilots on request</span>',
  docs: '<span class="chip"><span class="dot"></span>DPR &amp; DLR available · full suite in pilot</span>',
})[s];
const head = (eyebrow, title, lead, cls = '') => `<div class="secthead ${cls} rv">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h2 class="d2">${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const faq = items => `<div class="faq rv">${items.map(([q, a]) => `<details><summary>${q}</summary><div class="ans">${a}</div></details>`).join('')}</div>`;
const boxes = (items, cols = 'g3') => `<div class="${cols}">${items.map((it, i) => `<div class="box rv dl${i % 3}"><span class="ico">${ic(it[0])}</span><h3>${it[1]}</h3><p>${it[2]}</p>${it[3] ? `<div class="chips">${it[3].split('·').map(x => `<span>${x.trim()}</span>`).join('')}</div>` : ''}</div>`).join('')}</div>`;
const pfs = items => items.map(([p, pd, f]) => `<div class="pf rv"><div class="p"><small>The problem</small><h4>${p}</h4><p>${pd}</p></div><div class="f"><small>With Brikito</small><p style="color:#2B2B31">${f}</p></div></div>`).join('');
const steps = items => `<div class="steps">${items.map((s, i) => `<div class="step rv dl${i % 3}"><b>0${i + 1}</b><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}</div>`;
const cta = (title, lead, b1 = ['book-a-demo', 'Book a demo'], b2 = ['pricing', 'See pricing']) => `<section class="sec dark"><div class="wrap center"><div class="rv" style="display:flex;justify-content:center;margin-bottom:30px">${logo(56, 'grad')}</div><h2 class="d2 rv">${title}</h2><p class="lead rv">${lead}</p><div class="btns rv">${go(b1[0], b1[1])}${go(b2[0], b2[1], 'btn btn-s')}</div></div></section>`;
const explore = except => {
  const all = [['brik-ai', 'Brik AI', 'The AI assistant built for construction.', 'ai'], ['brikchat', 'BrikChat', 'Site chat that turns messages into work.', 'chat'], ['brikvision', 'BrikVision', 'AI on your site CCTV, around the clock.', 'eye'], ['brikdocs', 'BrikDocs', 'DPR, BOQ, BBS and more in one tap.', 'doc']].filter(x => x[0] !== except);
  return `<section class="sec-sm alt"><div class="wrap">${head('Part of one app', 'Explore the rest of Brikito.')}<div class="g3">${all.map((p, i) => `<a class="box rv dl${i}" href="${U(p[0])}" style="display:block"><span class="ico">${ic(p[3])}</span><h3>${p[1]}</h3><p>${p[2]}</p><p style="margin-top:18px"><span class="link">Explore ${p[1]} ${chev}</span></p></a>`).join('')}</div></div></section>`;
};

const flow = (items) => `<div class="flow sm rv">${items.map((it, i) => `${i ? '<div class="fline"><i></i></div>' : ''}<div class="fnode ${it[3] || ''}"><span class="fi ${it[3] === 'ok' ? 'ok' : ''}">${it[0] === 'brik' ? logo(20, 'white') : ic(it[0], 20, it[3] === 'ok' ? '#fff' : 'currentColor', it[3] === 'ok' ? 2.4 : 1.7)}</span><b>${it[1]}</b><small>${it[2]}</small></div>`).join('').replace(/fnode ok/g, 'fnode')}</div>`;
// ---------------- device mockups ----------------
const phone = (title, sub, body, compose = 'Message Site Team…') => `<div class="phone"><div class="island"></div><div class="scr"><div class="sbar"><span>9:41</span><span>●●● ▮</span></div>
<div class="apphead"><span class="av">${logo(18, 'black')}</span><div><b>${title}</b><small>${sub}</small></div></div><div class="chat">${body}</div><div class="compose"><i>${compose}</i><b>${ic('mic', 16, '#fff', 2)}</b></div></div></div>`;
const m = (who, time, text, tag, me) => `<div class="msg ${me ? 'me' : ''}"><div class="who"><span>${who}</span><span>${time}</span></div>${text}${tag ? `<div><span class="tag ${tag[1]}">${tag[0]}</span></div>` : ''}</div>`;
const brik = html => `<div class="brikmsg"><span class="bav">${logo(13, 'white')}</span><div class="msg" style="max-width:88%">${html}</div></div>`;
const indentCard = `<div class="card-in"><div class="row"><b>Indent IND-2041</b><span class="tag t-en" style="margin:0">Awaiting PM</span></div><div class="row"><span>Material</span><b>OPC 53 cement</b></div><div class="row"><span>Quantity</span><b>50 bags</b></div><div class="row"><span>Location</span><b>Block B · slab</b></div><div class="row"><span>On hand</span><b>12 bags</b></div><div class="acts"><i>Reject</i><i>Edit</i><i class="pr">Approve</i></div></div>`;
const heroPhone = phone('Skyline Residency · Tower B', 'Site Team · 24 members',
  m('Rajesh · Engineer', '8:42', 'Slab L7 cast, 142 cum. Cubes taken.', ['UPDATE', 't-up']) +
  m('Suresh · Contractor', '9:18', 'Need 50 bags OPC 53 for Block B by Friday', ['TICKET', 't-tk']) +
  brik('<b>Indent drafted</b> from Suresh’s message. Stock runs out tomorrow.') + indentCard);


const laptop = (img, alt) => `<div class="laptop"><div class="lscr"><img src="/img/${img}.webp" alt="${alt}" loading="lazy"></div><div class="lbase"><i></i></div></div>`;
const STACK = [['ai', 'Brik AI', 'Your project agent'], ['chat', 'BrikChat', 'Site chat'], ['doc', 'BrikDocs', 'Reports in a tap'], ['eye', 'BrikVision', 'AI on site cameras'], ['mail', 'BrikMail', 'Project mailbox'], ['bolt', 'Brikbots', 'Coming later', 'future']];
const stack = () => `<div class="stack rv"><div class="stop">${STACK.map(p => `<div class="sapp ${p[3] || ''}"><span class="ico">${ic(p[0], 20)}</span><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</div>
<div class="sbase"><span class="sb-l">${logo(30, 'grad')}<span><b>Brikito Console</b><small>The base platform · one login · every project</small></span></span><span class="sb-r">${['Projects', 'Teams & roles', 'Approvals', 'Records', 'Subcontractors', 'Client'].map(x => `<i>${x}</i>`).join('')}</span></div>
<div class="sground"><span>Your projects</span><span>Your team</span><span>Your subcontractors</span><span>Your clients</span></div></div>`;

// ---------------- pages ----------------
const P = {};

P.home = () => `
<section class="hero home-hero"><div class="aurora" aria-hidden="true"></div><div class="gridbg" aria-hidden="true"></div><div class="wrap"><div class="copy">
<div class="rv">${status('live')}</div>
<h1 class="d1 rv dl1 hero-h">Intelligent construction,<br><span class="gt">same site habits.</span></h1>
<p class="lead rv dl2">One app for chat, attendance, drawings, meetings, mail and a live dashboard, with Brik AI on every screen. Your crews keep working the way they do. Your office stays in control.</p>
<div class="btns rv dl3" style="justify-content:center">${go('book-a-demo', 'Book a demo')}${go('how-it-works', 'See how it works', 'btn btn-s')}</div></div>
<div class="stage zoom" id="stage">
<div class="glow" aria-hidden="true"></div>
<div style="position:absolute;left:50%;top:0;transform:translateX(-50%)" data-par="0">${heroPhone}</div>
<div class="float" style="left:4%;top:90px" data-par="-40"><span class="muted">On site now</span><b>48 / 51</b><span class="muted">selfie check-in</span></div>
<div class="float" style="left:9%;top:360px" data-par="30"><span class="muted">L4 plumbing layout</span><b>Rev 2</b><span style="color:var(--ok);font-weight:600">● Latest on site</span></div>
<div class="float" style="right:5%;top:120px" data-par="-25"><span class="muted">Schedule</span><b>62% / 68%</b><span style="color:var(--bad);font-weight:600">9 days behind · caught day one</span></div>
<div class="float" style="right:8%;top:400px" data-par="45"><span class="muted">Drafts today</span><b>4 drafted · 0 auto-sent</b><span class="muted">every action approved by a person</span></div>
</div></div></section>

<section class="sec"><div class="wrap"><p class="eyebrow rv">The platform</p><p class="statement" data-statement>The operating system for your construction site. Every message becomes a record, an approval, a report and a live view. Nobody on site has to change how they work.</p>
<div class="flow rv" aria-label="How one voice note becomes an approved indent">
<div class="fnode"><span class="fi">${ic('mic', 20)}</span><b>Tamil voice note</b><small>Suresh · 9:18</small></div>
<div class="fline"><i></i></div>
<div class="fnode brikn"><span class="fi">${logo(20, 'white')}</span><b>Brik understands</b><small>50 bags OPC 53 · Block B</small></div>
<div class="fline"><i></i></div>
<div class="fnode"><span class="fi">${ic('doc', 20)}</span><b>Indent IND-2041</b><small>Stock checked · PO drafted</small></div>
<div class="fline"><i></i></div>
<div class="fnode"><span class="fi ok">${ic('check', 20, '#fff', 2.4)}</span><b>Approved</b><small>Priya (PM) · one tap</small></div>
</div></div></section>

<section class="sec alt consec"><div class="wrap">
<div class="secthead center rv"><p class="eyebrow grad">Brikito Console</p><h2 class="d2">One platform.<br>Every product on top.</h2><p class="lead">Brikito Console is the base everyone signs in to. BrikChat, Brik AI, BrikDocs, BrikVision, BrikMail and the Brikbots to come all live inside it, on the same projects, people and records.</p><div class="btns" style="justify-content:center">${go('console', 'Explore the Console')}${go('book-a-demo', 'Book a demo', 'btn btn-s')}</div></div>
<div class="zoom" style="margin-top:20px">${laptop('console-home', 'Brikito Console home screen for Skyline Residency Tower B on day 258')}</div>
<div style="margin-top:110px">${stack()}</div></div></section>
<section class="sec-sm"><div class="wrap"><div class="split">
<div class="mascot zoom"><span class="mglow" aria-hidden="true"></span><img src="/img/brik-o.webp" alt="Brik, the Brikito AI mascot, in his Brik hard hat"><span class="mshadow" aria-hidden="true"></span></div>
<div><p class="eyebrow rv grad">Meet Brik</p><h2 class="d2 rv">The AI that knows your whole project.</h2>
<p class="lead rv">Brik lives inside Brikito. It reads every message, voice note and drawing, answers from live project data, and drafts the paperwork. You stay the checker.</p>
<ul class="list rv">
<li>${ic('chat')}<span><b>Reads everything.</b> Text, voice notes, photos and PDFs in 7 Indian languages.</span></li>
<li>${ic('search')}<span><b>Answers with sources.</b> Progress, stock, attendance and approvals, linked to the record.</span></li>
<li>${ic('shield')}<span><b>Drafts, never sends.</b> Indents, POs and replies wait for a person to approve.</span></li></ul>
<div class="btns rv">${go('brik-ai', 'Explore Brik AI', 'btn btn-s')}</div></div></div></div></section>

<section class="sec-sm"><div class="wrap">
${head('', 'Four products. One login.', 'Each one is useful on its own. Together they replace WhatsApp groups, registers, drawing folders, email and spreadsheets.', 'center')}
<div class="tiles">
<a class="tile dk rv" href="/brik-ai">${status('live')}<h3>Brik AI</h3><p class="muted">The assistant built for construction sites. Ask in plain language, get answers from live project data.</p><span class="link">Learn more ${chev}</span>
<div class="vis"><div class="win" style="width:92%;max-width:440px;border-radius:18px 18px 0 0;background:#141417;border-color:#2A2A30"><div style="padding:18px;display:flex;flex-direction:column;gap:10px;font-size:13px">
<div class="msg me" style="align-self:flex-end;background:#2A2A30">What’s waiting for my approval on Tower B?</div>
<div class="msg" style="background:#1D1D22;color:#E5E5EA;max-width:100%"><b>3 items need you today.</b> The cement PO is urgent: 12 bags on hand, about 14 used a day.</div>
<div class="card-in" style="background:#1D1D22;border-color:#2A2A30;color:#fff"><div class="row"><b>PO-2291 · UltraTech</b><span>50 bags OPC 53</span></div><div class="acts"><i style="background:#2A2A30;color:#fff">Show other 2</i><i class="pr" style="background:#fff;color:#000">Approve PO</i></div></div></div></div></div></a>
<a class="tile rv dl1" href="/brikchat">${status('dev')}<h3>BrikChat</h3><p class="muted">Familiar like WhatsApp. Built for a construction site. Every message is tagged and routed.</p><span class="link">Learn more ${chev}</span>
<div class="vis"><div style="width:92%;max-width:420px;display:flex;flex-direction:column;gap:8px;padding-bottom:30px">
${m('Kumar · Safety', '11:02', 'Open edge at L6 stairwell, photo attached', ['TICKET → Priya (PM)', 't-tk'])}${m('Fatima · Architect', '11:20', 'Is Rev 2 of the L4 plumbing layout on site?', ['ENQUIRY · Rev 2 linked', 't-en'])}${m('Rajesh · Engineer', '12:05', 'L6 blockwork 70%', ['UPDATE → Dashboard', 't-up'])}</div></div></a>
<a class="tile rv" href="/brikvision">${status('pilot')}<h3>BrikVision</h3><p class="muted">AI on the CCTV you already have. Headcount, deliveries, PPE and progress, around the clock.</p><span class="link">Learn more ${chev}</span>
<div class="vis"><div class="cams" style="width:100%;margin-bottom:-2px">${realCam('cam-real-activity', 'CAM 01 · SITE ACTIVITY', 'AI CCTV view of active construction work and workers', 'CREW ACTIVE')}${realCam('cam-real-occupancy', 'CAM 03 · OCCUPANCY', 'AI CCTV counting construction workers on site', 'HEADCOUNT 16')}</div></div></a>
<a class="tile dk rv dl1" href="/brikdocs">${status('docs')}<h3>BrikDocs</h3><p class="muted">Every report your project needs, built from work the team already logged. One tap each.</p><span class="link">Learn more ${chev}</span>
<div class="vis"><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:440px;padding-bottom:40px">${['DPR', 'DLR', 'BOQ', 'BBS', 'EST', 'SCH', 'FAB', 'GRN', 'STK'].map(c => `<span style="width:76px;height:76px;border-radius:18px;background:#1D1D22;border:1px solid #2A2A30;display:flex;align-items:center;justify-content:center;font-family:var(--ui);font-weight:600;letter-spacing:.06em">${c}</span>`).join('')}</div></div></a>
</div></div></section>

<section class="sec alt"><div class="wrap">
${head('One app, every surface', 'Six tabs. One login.', 'Everything the site does, in one place, from the first chat of the morning to the approved day.', 'center')}
<div class="tabs rv" role="tablist" data-tabs>${TABS.map((t, i) => `<button role="tab" class="${i ? '' : 'on'}" data-i="${i}">${t[0]}</button>`).join('')}</div>
<div id="tabpanel" class="rv">${tabPanel(0)}</div></div></section>

<section class="sec"><div class="wrap">
${head('What changes on site', 'The same day. Without the chasing.', 'Real moments from a working site, and what happens to them in Brikito.')}
<div class="cases">${[
  ['Chats', '<b>A spoken material request</b> becomes a structured indent, approved in one tap.'],
  ['Attendance', '<b>A gate selfie</b> gives live headcount and hours. No register, no month-end reconciliation.'],
  ['Documents', '<b>L4 plumbing Rev 2</b> is tagged as the latest, so crews stop building from superseded prints.'],
  ['Dashboard', '<b>A schedule slip</b> of 62% actual vs 68% planned, 9 days behind, is caught on day one.'],
  ['Brik AI', '<b>Three pending approvals</b>, an indent, overtime and a drawing sign-off, actioned inline.'],
  ['Meet', '<b>Minutes of the meeting</b> are drafted by Brik when the call ends, with owners and dates.'],
  ['Mail', '<b>Vendor replies and POs</b> are drafted from live data and wait in Drafts for approval.'],
  ['Safety', '<b>Missing edge protection at L7</b> and honeycombing at L6 are flagged straight from chat.'],
].map((c, i) => `<div class="case rv dl${i % 2}" style="background:var(--alt)"><small>${c[0]}</small><p>${c[1]}</p></div>`).join('')}</div></div></section>

<section class="sec dark"><div class="wrap">
<div class="secthead rv"><p class="eyebrow">Pilot · 2026</p><h2 class="d2">One app in place of six.</h2><p class="lead">Running today on live residential, metro and logistics sites.</p></div>
<div class="stats">${[['6→1', 'WhatsApp, registers, drawings, email and spreadsheets in one app'], ['3', 'live projects, residential, metro and logistics, on one login'], ['92%', 'on-site attendance captured by selfie check-in'], ['9 days', 'of schedule slip surfaced live, on day one']].map((s, i) => `<div class="stat rv dl${i}"><b data-count="${s[0]}">${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
<div class="rv" style="margin-top:90px;display:flex;gap:22px;align-items:center;border-top:1px solid #2A2A30;padding-top:40px">
<span style="width:56px;height:56px;border-radius:50%;background:#1D1D22;display:flex;align-items:center;justify-content:center;font-family:var(--ui);font-weight:600;flex:none">SR</span>
<div><p style="font-family:var(--ui);font-size:clamp(20px,2.2vw,28px);letter-spacing:-.02em;line-height:1.3">At Gofar Group, the day’s indents are approved from the Brikito app.</p><p class="muted" style="margin-top:8px">SR Ilangovan · Director, Gofar Group</p></div></div>
</div></section>

<section class="sec dark" style="padding-top:0"><div class="wrap">
<div class="secthead rv"><p class="eyebrow">Our commitments</p><h2 class="d2">Four non-negotiables, written before the code.</h2></div>
<div class="vals">${VALS.map((v, i) => `<div class="val rv dl${i}"><small>${['i', 'ii', 'iii', 'iv'][i]}. ${v[0]}</small><h4>${v[1]}</h4><p>${v[2]}</p></div>`).join('')}</div></div></section>

<section class="sec"><div class="wrap">
${head('What’s next', 'Building the AI operating system for real estate development.', '')}
${roadmap()}</div></section>
${cta('Put your next project on Brikito.', 'A 45-minute session. Your team set up on one live project, the same day.', ['book-a-demo', 'Book a demo'], ['how-it-works', 'See how it works'])}`;

const TABS = [
  ['Chats', 'Group chats, DMs and Brik in one inbox.', ['Auto-tagged messages: update, attendance, enquiry, ticket', 'Voice notes transcribed in 7 languages', 'Polls and project groups by block, trade or contractor'], () => phone('Tower B · Site Team', '142 messages today', m('Anil · Supervisor', '8:46', '▶ 0:21 Tamil voice note', ['ATTENDANCE · 48 present', 't-at']) + m('Rajesh', '8:42', 'Slab L7 cast, 142 cum', ['UPDATE', 't-up']) + m('Fatima', '11:20', 'Rev 2 for L4 plumbing?', ['ENQUIRY', 't-en']) + brik('Rev 2 is the latest. Linked in thread.'))],
  ['Brik AI', 'Ask in plain language. Approve in a tap.', ['Pending approvals with stock, cost and history', 'Drafted replies and POs, never auto-sent', 'Answers scoped to your role, across projects'], () => phone('Brik', 'Your project assistant', m('You', '18:02', 'Pending approvals?', null, true) + brik('<b>3 waiting:</b> cement indent (urgent), overtime for 6 masons, L4 drawing sign-off.') + `<div class="card-in"><div class="row"><b>PO-2291</b><span>UltraTech</span></div><div class="row"><span>50 bags OPC 53</span><b>Tower B</b></div><div class="acts"><i>Edit quantity</i><i class="pr">Approve</i></div></div>`, 'Ask Brik anything…')],
  ['Attendance', 'Selfie check-in at the gate.', ['Geofenced selfie check-in and check-out', 'Live headcount by team and contractor', 'Days, hours and on-site % for every worker'], () => phone('Attendance', 'Tower B · today', `<div class="card-in" style="text-align:center;padding:18px"><span class="muted" style="font-size:12px">On site now</span><div style="font-family:var(--ui);font-size:44px;font-weight:600;letter-spacing:-.03em">48<span style="color:var(--muted2)">/51</span></div><span class="tag t-up">92% ON-SITE THIS MONTH</span></div>` + ['Masons · 18', 'Carpenters · 12', 'Helpers · 15', 'Engineers · 3'].map(x => `<div class="card-in" style="display:flex;justify-content:space-between"><span>${x.split('·')[0]}</span><b>${x.split('·')[1]}</b></div>`).join(''))],
  ['Dashboard', 'Progress vs plan, live.', ['Days behind, open tickets and manpower trend', 'Material status and stock alerts', 'Safety and quality flags from chat'], () => `<div class="win" style="width:100%;max-width:560px"><div class="bar"><i></i><i></i><i></i><span>Admin Console · Skyline Tower B</span></div><div style="padding:22px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px">${[['Progress', '62%', 'plan 68%'], ['Behind', '9 days', 'L7 slab'], ['Manpower', '48', 'of 51']].map(k => `<div style="background:var(--alt);border-radius:14px;padding:14px"><span class="muted" style="font-size:12px">${k[0]}</span><div style="font-family:var(--ui);font-size:26px;font-weight:600;letter-spacing:-.02em">${k[1]}</div><span class="muted" style="font-size:12px">${k[2]}</span></div>`).join('')}<div style="grid-column:1/-1;background:var(--alt);border-radius:14px;padding:16px">${sCurve(true)}</div></div></div>`],
  ['Documents', 'The latest revision, always tagged.', ['Drawings, structural plans, BOQ, agreements, certificates', 'Every revision tracked, the latest tagged on site', 'Linked straight into chat threads'], () => `<div class="win" style="width:100%;max-width:560px"><div class="bar"><i></i><i></i><i></i><span>Documents · Tower B</span></div><div style="padding:14px 18px">${[['Rev 2', 'L4 plumbing layout', 'LATEST', 'p-ok'], ['Rev 1', 'L4 plumbing layout', 'SUPERSEDED', 'p-lg'], ['Rev 3', 'L4 slab reinforcement · BBS 12.4 t', 'LATEST', 'p-ok'], ['v1', 'Plumbing contract', 'AGREEMENT', 'p-lg']].map(r => `<div style="display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;padding:13px 0;border-bottom:1px solid var(--line);font-size:14px"><b style="font-family:var(--ui)">${r[0]}</b><span>${r[1]}</span><span class="pill ${r[3]}">${r[2]}</span></div>`).join('')}</div></div>`],
  ['Meet & Mail', 'Minutes and mail, drafted by Brik.', ['Video calls with AI minutes of meeting', 'A project mailbox, not personal inboxes', 'Vendor replies drafted from live data'], () => `<div class="win" style="width:100%;max-width:560px"><div class="bar"><i></i><i></i><i></i><span>Minutes · Weekly review · 18:30</span></div><div style="padding:22px;display:flex;flex-direction:column;gap:12px;font-size:14px"><b style="font-family:var(--ui);font-size:18px">Drafted by Brik when the call ended</b>${[['Pump backup for L7 pour', 'Rajesh', 'Thu'], ['Issue Rev 2 to plumbing crew', 'Fatima', 'Today'], ['Approve overtime for 6 masons', 'Priya', 'Today']].map(a => `<div style="display:flex;justify-content:space-between;background:var(--alt);border-radius:12px;padding:12px 14px"><span>${a[0]}</span><span class="muted">${a[1]} · ${a[2]}</span></div>`).join('')}<span class="muted">Sent to attendees after Priya approves.</span></div></div>`],
];
function tabPanel(i) {
  const t = TABS[i];
  return `<div class="tabpanel fadein"><div><h3 class="d3">${t[1]}</h3><ul>${t[2].map(x => `<li>${x}</li>`).join('')}</ul></div><div style="display:flex;justify-content:center">${t[3]()}</div></div>`;
}
const VALS = [['Authority', 'Your PM is the checker. Always.', 'Brik drafts. Nothing is sent, ordered or published until a person approves it.'], ['Grounding', 'Answers from your project. Nothing else.', 'Every figure comes from live project data, linked to its source.'], ['Adoption', 'Built for the site, not the office.', 'Made for site crews first, in the languages they speak.'], ['Privacy', 'Presence, not surveillance.', 'Selfie check-in confirms presence only. Role-based access per project. Data hosted in India and exportable on demand.']];
const roadmap = () => `<div class="road">${[['01', 'Brik Agent', 'Brik goes from answering to doing the work, with your approval', true], ['02', 'BrikChat', 'In development', false], ['03', 'BrikDocs', 'Next', false], ['04', 'BrikVision', 'On the runway · pilots on request', false], ['05', 'Brikbots', 'The long-term vision', false]].map((r, i) => `<div class="rv dl${i}"><span class="pin ${r[3] ? 'on' : ''}">${r[0]}</span><h4>${r[1]}</h4><p class="muted">${r[2]}</p></div>`).join('')}</div>`;
function camTile(img, label, boxes, foot, red = []) {
  return `<div class="cam"><img src="/img/${img}.webp" alt="Simulated ${label.toLowerCase()} camera view" loading="lazy"><span class="lbl">${label}</span><span class="rec">REC</span>${boxes.map((b, i) => `<span class="bbox ${red.includes(i) ? 'r' : ''}" style="left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%"><i>${b[4]}</i></span>`).join('')}<span class="foot">${foot}</span></div>`;
}
function sCurve(small) {
  return `<svg viewBox="0 0 520 ${small ? 150 : 260}" width="100%" role="img" aria-label="Planned, earned and spent curves; earned value trails the plan"><defs><linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="#0B0B0F" stop-opacity=".08"/><stop offset="1" stop-color="#0B0B0F" stop-opacity="0"/></linearGradient></defs>
${small ? '' : '<g stroke="#E5E5EA">' + [50, 100, 150, 200].map(y => `<line x1="0" x2="520" y1="${y}" y2="${y}"/>`).join('') + '</g>'}
<path d="M0 ${small ? 140 : 240} C 150 ${small ? 130 : 220}, 260 ${small ? 70 : 120}, 520 ${small ? 10 : 20}" fill="none" stroke="#0B0B0F" stroke-width="2.5"/>
<path d="M0 ${small ? 140 : 240} C 150 ${small ? 135 : 232}, 260 ${small ? 98 : 168}, 330 ${small ? 80 : 140}" fill="none" stroke="#5462F0" stroke-width="2.5"/>
<path d="M0 ${small ? 140 : 240} C 150 ${small ? 128 : 215}, 250 ${small ? 72 : 120}, 330 ${small ? 56 : 96}" fill="none" stroke="#C93A2E" stroke-width="2.5" stroke-dasharray="5 5"/>
<g font-family="Inter" font-size="${small ? 11 : 13}" font-weight="600"><text x="440" y="${small ? 24 : 36}" fill="#0B0B0F">Planned</text><text x="340" y="${small ? 92 : 156}" fill="#5462F0">Earned</text><text x="340" y="${small ? 54 : 92}" fill="#C93A2E">Spent</text></g></svg>`;
}

// ---------------- product pages ----------------
P['brik-ai'] = () => `
<section class="hero"><div class="wrap"><div class="split">
<div><div class="rv">${status('live')}</div><h1 class="d1 rv dl1" style="font-size:clamp(44px,6vw,80px)">The AI assistant built for construction sites.</h1>
<p class="lead rv dl2">Brik reads every message, voice note and document, answers from live project data, and drafts replies, orders and reports. Nothing goes out until a person approves it.</p>
<div class="btns rv dl3">${go('book-a-demo', 'Book a demo')}<a class="btn btn-s" href="#ask" data-scroll="ask">See what you can ask</a></div>
<div class="rv" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:30px">${['7 Indian languages', 'Role-based answers', 'Drafts, never auto-sends'].map(x => `<span class="chip">${x}</span>`).join('')}</div></div>
<div class="zoom" style="display:flex;justify-content:center">${phone('Brik', 'Tower B · online', m('You', '9:20', 'What’s waiting for my approval on Tower B?', null, true) + brik('<b>3 items need you today.</b> The cement PO is urgent: stock runs out tomorrow.') + `<div class="card-in"><div class="row"><b>PO-2291</b><span class="tag t-tk" style="margin:0">URGENT</span></div><div class="row"><span>50 bags OPC 53</span><b>UltraTech</b></div><div class="row"><span>From</span><b>Suresh · Site Team · 9:18</b></div><div class="row"><span>On hand</span><b>12 bags</b></div><div class="row"><span>Daily use</span><b>~14 bags</b></div><div class="acts"><i>Show other 2</i><i>Edit qty</i><i class="pr">Approve</i></div></div>`, 'Ask Brik anything…')}</div></div></div></section>
<section class="sec-sm" style="padding-top:0"><div class="wrap">${flow([['search','“What’s pending on Tower B?”','Priya · PM'],['brik','Brik checks the project','chats · stock · approvals','brikn'],['link','Answer with sources','3 items · cement urgent'],['check','Approved in one tap','PO-2291 · UltraTech','ok']])}</div></section>
<section class="sec"><div class="wrap">${head('Why construction needs its own AI', 'Your project already has the answers. They’re just buried.', 'The information lives across chats, voice notes, photos and calls. Finding it, structuring it and acting on it is where the day goes.')}
${pfs([['The answer is buried in 40 group chats.', '“Did the L4 plumbing drawing reach site?” Someone scrolls for twenty minutes.', 'Brik searches every chat, drawing and record, and links you to the source.'], ['The office retypes site messages.', 'Updates arrive as chat. Someone copies them into Excel at night.', 'Brik tags the intent and turns the message into an indent, attendance count or progress update.'], ['Approvals stall on one phone.', 'The PM is on another site. The cement order waits.', 'Brik surfaces pending items with stock, cost and history, and drafts the PO for one-tap approval.']])}</div></section>
<section class="sec alt"><div class="wrap">${head('What Brik AI does', 'One assistant. Every screen of the project.', 'Brik runs through chat, attendance, documents and the dashboard.', 'center')}
${boxes([['search', 'Answers in plain language', 'Progress, cement stock, attendance, delays and pending approvals, with the source cited.', 'ASK · SEARCH · CITE'], ['chat', 'Reads every site message', 'Text, voice notes, photos and PDFs, tagged as update, attendance, enquiry or ticket. Figures extracted and linked.', 'TAG · EXTRACT · LINK'], ['doc', 'Drafts the paperwork', 'Replies, material indents, POs and client updates, routed to the right person for approval.', 'DRAFT · ROUTE · APPROVE'], ['clock', 'Summarises the day', 'Progress summaries for the PM, the owner or the client.', 'DAILY · WEEKLY · CLIENT'], ['flag', 'Flags what needs attention', 'Low stock, slipping activities, open tickets and safety observations.', 'STOCK · DELAYS · SAFETY'], ['lang', 'Speaks your site’s language', 'English, Hindi, Marathi, Tamil, Telugu, Kannada and Bengali, typed or spoken.', 'EN · HI · MR · TA · TE · KN · BN']])}</div></section>
<section class="sec" id="ask"><div class="wrap"><div class="split">
<div><p class="eyebrow rv">Ask</p><h2 class="d2 rv">Ask the project anything.</h2><p class="lead rv">The questions you used to phone the site about, answered in seconds. Each person sees only what their role allows.</p>
<div class="rv" style="display:flex;flex-direction:column;gap:10px;margin-top:30px">${['How much cement did we use this week?', 'Which activities are behind plan?', 'Is Rev 2 of the L4 layout on site?', 'My attendance last month'].map(q => `<span style="display:inline-flex;align-self:flex-start;padding:12px 18px;border-radius:999px;background:var(--alt);font-size:16px">“${q}”</span>`).join('')}</div></div>
<div class="zoom" style="display:flex;justify-content:center">${phone('Brik', 'Tower B this week', m('You', '18:02', 'How did Tower B do this week?', null, true) + brik('<b>Mostly on plan, two slips:</b><br>• L7 slab 2 days behind (pump breakdown Tue)<br>• L5 blockwork on plan<br>• L3 plumbing 1 day behind, waiting for Rev 2') + m('You', '18:03', 'Draft a client update', null, true) + brik('Drafted. Sent to <b>Priya (PM)</b> for review.'), 'Ask a follow-up…')}</div></div></div></section>
<section class="sec alt"><div class="wrap"><div class="split">
<div class="zoom"><div class="win"><div class="bar"><i></i><i></i><i></i><span>Drafts · Skyline Tower B</span></div><div style="padding:20px;display:flex;flex-direction:column;gap:10px;font-size:14px">
<div style="display:flex;gap:10px"><span class="chip">4 drafts today</span><span class="chip"><span class="dot"></span>0 sent without approval</span></div>
${[['IND-2041', 'Indent · 50 bags OPC 53', 'Priya (PM)'], ['PO-2291', 'Purchase order · UltraTech', 'Priya (PM)'], ['Reply', 'Fatima’s L4 plumbing enquiry', 'Rajesh'], ['Summary', 'Daily progress for the owner', 'Priya (PM)']].map(d => `<div style="display:grid;grid-template-columns:90px 1fr auto;gap:12px;align-items:center;padding:12px 14px;border-radius:12px;background:var(--alt)"><b style="font-family:var(--ui)">${d[0]}</b><span>${d[1]}</span><span class="muted">→ ${d[2]}</span></div>`).join('')}</div></div></div>
<div><p class="eyebrow rv">Draft</p><h2 class="d2 rv">Brik drafts. You decide.</h2><p class="lead rv">“Need 50 bags OPC” becomes a structured indent. Brik checks stock and the usual vendor, and drafts the PO.</p>
<ul class="list rv"><li>${ic('doc')}<span><b>Drafts</b> replies, indents, POs, client updates and summaries.</span></li><li>${ic('send')}<span><b>Routes</b> to the PM, purchase, QS or owner, by your approval rules.</span></li><li>${ic('link')}<span><b>Shows</b> the source message, stock, cost and history.</span></li><li>${ic('lock')}<span><b>Never</b> sends, orders or publishes without confirmation.</span></li></ul></div></div></div></section>
<section class="sec"><div class="wrap">${head('How it works', 'Four steps. One live project on day one.', '')}${steps([['Set up your project', 'Add the team, roles and approval rules. We help you get one live project running on day one.'], ['The site keeps talking', 'Updates, photos and voice notes go into BrikChat, as they do today.'], ['Brik structures it', 'Messages are tagged, figures extracted, and data flows to the dashboard.'], ['Ask, review, approve', 'One-tap approvals, each linked to its source.']])}</div></section>
<section class="sec alt"><div class="wrap">${head('Built for every role', 'Everyone gets their own answers.', '')}
${boxes([['users', 'Project manager', 'Pending approvals, slipping activities and low stock in one answer.'], ['mic', 'Site engineer', 'Report by voice. Brik creates the progress update and the indent.'], ['eye', 'Owner & developer', 'Project status without phone calls, with numbers.'], ['box', 'Purchase & QS', 'Indents with quantities, grades and locations, checked against stock and drafted as POs.']], 'g4')}</div></section>
<section class="sec"><div class="wrap">${head('AI you can sign off on', 'Brik flags. A person decides.', '', 'center')}${boxes([['shield', 'Human approval on every action', 'Nothing leaves Brikito without a person confirming it.'], ['lock', 'Answers scoped by role', 'People only see what their role on that project permits.'], ['link', 'A source behind every answer', 'Each answer links to the message, document or record it came from.']])}</div></section>
<section class="sec alt"><div class="wrap narrow">${head('', 'Brik AI, answered.', '')}${faq([['What is an AI assistant for construction?', 'Software that reads what your project produces, such as chats, voice notes, drawings and records, answers plain-language questions about it, and drafts replies, POs and reports.'], ['How is Brik AI different from ChatGPT?', 'Brik answers from your live Brikito project data (chats, attendance, stock, drawings and approvals), not general knowledge, and every answer links to its source.'], ['Does it send messages or place orders on its own?', 'No. A person always confirms before anything is sent, ordered or published.'], ['Which languages does it understand?', 'English, Hindi, Marathi, Tamil, Telugu, Kannada and Bengali, typed or spoken.'], ['Can it show data people shouldn’t see?', 'No. Answers are scoped by role and by project.'], ['Which plans include Brik AI?', 'Brik AI is in every plan. Standard includes the core assistant; Professional and Enterprise include the full assistant. <a class="link" href="/pricing">See pricing</a>']])}</div></section>
${explore('brik-ai')}${cta('Give your site team an AI that gets construction.', 'A 45-minute demo. We set your team up on one live project and show what Brik can answer that same day.')}`;

P.brikchat = () => `
<section class="hero"><div class="wrap"><div class="split">
<div><div class="rv">${status('dev')}</div><h1 class="d1 rv dl1" style="font-size:clamp(44px,6vw,80px)">The site chat that turns messages into work.</h1>
<p class="lead rv dl2">One project chat in place of scattered WhatsApp groups. Brik reads messages, voice notes, photos and PDFs, tags each one, and routes it to the dashboard or to the PM for approval.</p>
<div class="btns rv dl3">${go('book-a-demo', 'Get early access')}<a class="btn btn-s" href="#vs" data-scroll="vs">BrikChat vs WhatsApp</a></div>
<div class="rv" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:30px">${['Groups · DMs · Voice notes', 'Auto-tagged messages', '7 Indian languages'].map(x => `<span class="chip">${x}</span>`).join('')}</div></div>
<div class="zoom" style="display:flex;justify-content:center">${phone('Skyline Tower B', 'Site Team · 6 of 142 messages', m('Rajesh · Engineer', '8:42', 'Slab L7 cast, 142 cum. Cubes taken.', ['UPDATE', 't-up']) + m('Anil · Supervisor', '8:46', '▶ 0:21 · 48 present, 3 absent', ['ATTENDANCE', 't-at']) + m('Fatima · Architect', '11:20', 'L4 plumbing layout? Rev 2 linked', ['ENQUIRY', 't-en']) + m('Kumar · Safety', '11:02', '📷 Open edge, L6 stairwell', ['TICKET → Priya', 't-tk']) + m('Suresh · Contractor', '9:18', '50 bags OPC 53, Block B', ['TICKET · IND-2041', 't-tk']) + brik('Indent routed to <b>Priya (PM)</b>. 3 approvals waiting.'))}</div></div></div></section>
<section class="sec-sm" style="padding-top:0"><div class="wrap">${flow([['chat','142 messages today','Tower B · Site Team'],['brik','Brik tags each one','update · attendance · enquiry · ticket','brikn'],['dash','Routed automatically','dashboard · PM · documents'],['check','0 retyped','by the office','ok']])}</div></section>
<section class="sec"><div class="wrap">${head('The problem', 'Your site already runs on chat. The chat just doesn’t run anything.', 'Teams use WhatsApp because it’s fast. But a message isn’t a record, a voice note isn’t an indent, and a group thread isn’t an approval.')}
${pfs([['Decisions buried in group threads.', 'Quantities, drawing revisions and go-aheads get lost in the scroll.', 'Every message is tagged and searchable. Actionable items are pulled out and linked.'], ['Voice notes nobody can search.', 'The office listens to them one by one.', 'Voice notes are transcribed, tagged and turned into updates or indents.'], ['Project history on personal phones.', 'When people leave, the context leaves with them.', 'Groups belong to the project. New members see history according to their role.']])}</div></section>
<section class="sec alt"><div class="wrap">${head('What BrikChat does', 'Familiar like WhatsApp. Built for a construction site.', '', 'center')}
${boxes([['chat', 'Project groups & DMs', 'Groups by project, block, trade or contractor, plus private DMs and a private chat with Brik.', 'GROUPS · DMs · BRIK AI'], ['flag', 'Every message auto-tagged', 'Update, attendance, enquiry or ticket, without anyone filling a form.', 'UPDATE · ATTENDANCE · ENQUIRY · TICKET'], ['mic', 'Voice notes, transcribed', 'English, Hindi, Marathi, Tamil, Telugu, Kannada and Bengali.', 'SPEAK · TRANSCRIBE · STRUCTURE'], ['box', 'Material indents from chat', '“Need 50 bags OPC 53 for Block B” becomes an indent with quantity, grade and location.', 'INDENT · APPROVAL · PO'], ['dash', 'Progress to the dashboard', 'Updates, attendance counts and flags flow into the live dashboard.', 'PROGRESS · MANPOWER · FLAGS'], ['draw', 'Drawings, linked in context', '“Has Rev 2 reached site?” returns the latest tagged revision, in the thread.', 'LATEST REVISION · IN THREAD']])}</div></section>
<section class="sec"><div class="wrap"><div class="split">
<div><p class="eyebrow rv">Inside project chats</p><h2 class="d2 rv">142 messages in. Zero retyped.</h2><p class="lead rv">Brik captures voice, photos, video, PDFs and drawings, tags them, and turns them into indents, approvals, progress and flags.</p></div>
<div class="zoom"><div class="win"><div class="bar"><i></i><i></i><i></i><span>Tagged today · Skyline Tower B</span></div><div style="padding:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px">${[['31', 'Updates', 't-up'], ['6', 'Attendance', 't-at'], ['9', 'Enquiries', 't-en'], ['4', 'Tickets', 't-tk'], ['92', 'Chit-chat ignored', ''], ['0', 'Retyped by the office', '']].map(k => `<div style="background:var(--alt);border-radius:14px;padding:16px"><div style="font-family:var(--ui);font-size:34px;font-weight:600;letter-spacing:-.03em">${k[0]}</div><span class="muted" style="font-size:13px">${k[1]}</span></div>`).join('')}</div></div></div></div></div></section>
<section class="sec alt" id="vs"><div class="wrap narrow">${head('BrikChat vs WhatsApp', 'Keep the speed of WhatsApp. Lose the chaos.', '', 'center')}
<div class="vs rv"><div class="h"></div><div class="h">WhatsApp groups</div><div class="h">BrikChat</div>${[['Material requests', 'Retyped by hand', 'Structured indent, routed for approval'], ['Voice notes', 'Listened to one by one', 'Transcribed in 7 languages and tagged'], ['Attendance & progress', 'Copied into Excel', 'Flows to the live dashboard'], ['Drawings', 'Old revisions re-forwarded', 'Latest revision linked in thread'], ['Access', 'Everyone sees everything', 'Role-based, per project'], ['When someone leaves', 'History leaves on their phone', 'History stays with the project'], ['Answers', 'Scroll up and hope', 'Ask Brik, get the source']].map(r => `<div class="k">${r[0]}</div><div class="muted">${r[1]}</div><div class="b">${r[2]}</div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap">${head('How it works', 'From voice note to approved indent. Before lunch.', '')}${steps([['Someone posts', 'A contractor sends a Tamil voice note: 50 bags of OPC 53 for Block B, tomorrow.'], ['Brik reads it', 'Transcribes it, tags it as a ticket, and pulls out quantity, grade and location.'], ['Brik structures it', 'Raises the indent, checks stock, and drafts a PO to the usual vendor.'], ['The PM approves', 'Priya approves in one tap from the source message. The site gets confirmation in chat.']])}</div></section>
<section class="sec alt"><div class="wrap">${head('Who it’s for', 'Everyone on the project, in one chat.', '')}${boxes([['hat', 'Site engineer & supervisor', 'Report the way you already talk. No forms, no end-of-day Excel.'], ['users', 'Project manager', 'See the day structured, with approvals in one place.'], ['truck', 'Contractors & vendors', 'Get answers on indents, approvals and drawings without chasing.'], ['eye', 'Developer & owner', 'A searchable record of every decision, kept with the project.']], 'g4')}</div></section>
<section class="sec"><div class="wrap narrow">${head('', 'BrikChat, answered.', '')}${faq([['Is BrikChat a WhatsApp alternative for construction teams?', 'Yes. It feels familiar, but the chat belongs to the project, and Brik turns messages into structured work.'], ['Why isn’t WhatsApp enough?', 'It scatters decisions, voice notes can’t be searched, nothing becomes a record, and history stays on personal phones.'], ['Does the site team need training?', 'Very little. If they can send a WhatsApp message or a voice note, they can use BrikChat.'], ['Can teams send voice notes in regional languages?', 'Yes, in all seven supported languages, with transcription and tagging.'], ['Does Brik reply or order automatically?', 'No. Brik drafts replies, indents and orders. A person approves before anything is sent.'], ['Is it available now?', 'BrikChat is in active development and is first on the roadmap. Book a demo to join early access.']])}</div></section>
${explore('brikchat')}${cta('Move your site chat onto Brikito.', 'A 45-minute session. Your team on one live project, with messages turning into work the same day.', ['book-a-demo', 'Book a demo'], ['how-it-works', 'How it works'])}`;

const realCam = (img, label, alt, foot) => `<div class="cam real"><img src="/img/${img}.webp" alt="${alt}" loading="lazy"><span class="lbl">${label}</span><span class="rec">REC</span><span class="foot">${foot}</span></div>`;
const camGrid = () => `<div class="cams">${realCam('cam-real-activity', 'CAM 01 · SITE ACTIVITY', 'AI CCTV view of active construction work and workers', 'CREW ACTIVE')}${realCam('cam-real-zone', 'CAM 02 · WORK ZONE', 'AI CCTV view of a formwork work zone', 'FORMWORK ACTIVE')}${realCam('cam-real-occupancy', 'CAM 03 · OCCUPANCY', 'AI CCTV counting construction workers on site', 'HEADCOUNT 16')}${realCam('cam-real-ppe', 'CAM 04 · SAFETY / PPE', 'AI CCTV detecting workers and safety helmets', 'HELMET DETECTION')}</div>`;
const camGridOld = () => `<div class="cams">${camTile('cam-gate', 'CAM 01 · SITE ACTIVITY', [[13, 37, 6, 13, 'person .97'], [48, 62, 6, 14, 'person .95'], [74, 56, 6, 13, 'person .94']], 'CREW ACTIVE')}${camTile('cam-zone', 'CAM 02 · WORK ZONE', [[55, 20, 33, 75, 'formwork active']], 'ZONE B · ACTIVE')}${camTile('cam-crew', 'CAM 03 · OCCUPANCY', [[18, 36, 7, 17, 'person'], [46, 26, 7, 20, 'person'], [37, 53, 9, 18, 'person'], [70, 41, 8, 17, 'person']], 'HEADCOUNT 16')}${camTile('cam-ppe', 'CAM 04 · SAFETY / PPE', [[44, 12, 10, 24, 'no helmet']], '1 FLAG · ZONE B', [0])}</div>`;
P.brikvision = () => `
<section class="hero" style="padding-bottom:40px"><div class="wrap"><div class="copy">
<div class="rv">${status('pilot')}</div><h1 class="d1 rv dl1">See your site<br>without standing on it.</h1>
<p class="lead rv dl2">BrikVision adds AI to the CCTV you already have. It counts people, logs deliveries, checks helmets and vests, and tracks progress around the clock, on your phone.</p>
<div class="btns rv dl3" style="justify-content:center">${go('book-a-demo', 'Request a pilot')}<a class="btn btn-s" href="#watch" data-scroll="watch">What it watches</a></div></div>
<div class="zoom" style="max-width:1000px;margin:70px auto 0"><div class="win" style="background:#0B0B0F;border-color:#1D1D22"><div class="bar" style="background:#141417;border-color:#1D1D22"><i style="background:#2A2A30"></i><i style="background:#2A2A30"></i><i style="background:#2A2A30"></i><span style="color:#8E8E95">Skyline Tower B · 4 cameras · 14:32 · Simulated views</span></div>
<div style="padding:12px">${camGrid()}<div class="feed" style="margin-top:10px">${[['14:31', 'Headcount 16 matches attendance', 'OK', 'p-ok'], ['14:18', '1 worker without a helmet · Zone B', 'FLAGGED', 'p-fl'], ['13:52', 'Truck in at gate · steel delivery logged', 'LOGGED', 'p-lg']].map(e => `<div style="background:#141417;color:#E5E5EA"><time>${e[0]}</time><span>${e[1]}</span><span class="pill ${e[3]}">${e[2]}</span></div>`).join('')}</div></div></div></div></div></section>
<section class="sec-sm" style="padding-top:0"><div class="wrap">${flow([['cam','Your existing CCTV','4 cameras · Tower B'],['brik','Brik watches 24/7','people · PPE · deliveries','brikn'],['flag','Alert with the frame','CAM 04 · 14:18 · Zone B'],['check','A person decides','Kumar · Safety','ok']])}</div></section>
<section class="sec"><div class="wrap">${head('Why cameras aren’t enough', 'Your site has cameras. Nobody has time to watch them.', 'Sites record all day. The footage only gets opened after something goes wrong.')}
${pfs([['Site visits just to check.', 'Managers drive across the city to confirm crews and slab work.', 'Live headcount, active zones and progress for every site, in one view.'], ['Hours of footage, zero answers.', 'Disputes and incidents mean scrubbing video.', 'Every delivery, entry and safety event is logged with camera, time and frame.'], ['Headcounts that don’t add up.', 'The register says 48. The contractor bills for 52.', 'Camera headcount by the hour sits beside attendance.']])}</div></section>
<section class="sec alt" id="watch"><div class="wrap">${head('What it watches', 'Six things BrikVision watches for you.', 'On every camera, every hour. Numbers, logs and alerts go to BrikChat and the project dashboard.', 'center')}
${boxes([['users', 'Live headcount', 'Counts per site and zone, hour by hour, compared with attendance and contractor bills.', 'LABOUR · BY ZONE · BY HOUR'], ['truck', 'Deliveries & material movement', 'Logs gate entries and exits, reads delivery notes and checks receipts against POs.', 'GATE · DELIVERY NOTES · GRN'], ['shield', 'PPE & safety checks', 'Detects missing helmets and vests and people in restricted zones. The frame goes to the safety lead.', 'HELMET · VEST · ZONES'], ['dash', 'Progress monitoring', 'Shows which zones are active and how visible work is moving.', 'ACTIVE ZONES · PROGRESS'], ['cam', 'Photo quality checks', 'Checks site photos posted in chat for quality and PPE issues.', 'PHOTOS · QUALITY · PPE'], ['layers', 'Every site, one screen', 'A multi-site view on your phone, with searchable events.', 'MULTI-SITE · 24/7 · SEARCH']])}</div></section>
<section class="sec"><div class="wrap"><div class="split">
<div><p class="eyebrow rv">Answers, not footage</p><h2 class="d2 rv">Ask how many are on site. Get a number.</h2><p class="lead rv">Alerts arrive in BrikChat with the frame attached. Questions get answers with proof.</p></div>
<div class="zoom" style="display:flex;justify-content:center">${phone('Brik', 'Tower B', m('You', '14:33', 'How many on site right now?', null, true) + brik('<b>49 on camera</b> across 4 zones. 48 checked in. Steel delivery logged at the gate at 13:52.') + `<div class="card-in"><div class="row"><b>Safety · CAM 04 · 14:18</b><span class="tag t-tk" style="margin:0">FLAG</span></div><p style="margin:6px 0;font-size:12px">1 worker without a helmet in Zone B. Sent to Kumar (Safety) with the frame.</p><div class="cam" style="border-radius:10px"><img src="/img/cam-ppe.webp" alt="Frame from camera 4"><span class="bbox r" style="left:44%;top:12%;width:10%;height:24%"><i>no helmet</i></span></div></div>`, 'Ask about your site…')}</div></div></div></section>
<section class="sec alt"><div class="wrap">${head('How it works', 'Your cameras. Brik’s eyes.', '')}${steps([['Connect your CCTV', 'Our team connects your existing cameras and checks coverage of the gate, work zones and stores.'], ['Mark your zones', 'Define work zones, restricted areas and the gate, and choose who gets which alert.'], ['Brik watches 24/7', 'Every feed is analysed continuously for people, PPE, deliveries and activity.'], ['You get answers', 'Counts, logs and alerts reach BrikChat and the dashboard, each with proof frames.']])}</div></section>
<section class="sec"><div class="wrap">${head('Who it’s for', 'Oversight for every site. Without the drive.', '')}${boxes([['eye', 'Developer & owner', 'Check every site from one screen: active, staffed and safe.'], ['users', 'Project manager', 'Fewer trips, faster decisions. Confirm progress and deliveries remotely.'], ['shield', 'Safety officer', 'See the gap while it’s happening. Alerts arrive with the frame.'], ['box', 'Stores & purchase', 'Every delivery on record. Gate logs and delivery notes settle disputes.']], 'g4')}</div></section>
<section class="sec dark"><div class="wrap">${head('Responsible site AI', 'Brik flags. A person decides.', '')}<div class="vals" style="grid-template-columns:repeat(3,1fr)">${[['Evidence', 'Proof with every alert.', 'Each count, log and flag carries the camera, time and frame.'], ['Review', 'Reviewed before it counts.', 'Nothing is reported against a worker or contractor until a person reviews the evidence.'], ['Access', 'Access by role.', 'Who sees which feeds and events is set up with our team.']].map((v, i) => `<div class="val rv dl${i}"><small>${v[0]}</small><h4>${v[1]}</h4><p>${v[2]}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap narrow">${head('', 'BrikVision, answered.', '')}${faq([['What is AI CCTV monitoring for construction sites?', 'Software that analyses your site camera feeds to count people, log deliveries, check PPE and track visible progress, then sends numbers and alerts instead of footage.'], ['Do I need new cameras?', 'Usually not. Our team connects your existing cameras and checks coverage of the gate, work zones and stores.'], ['What can it detect?', 'People and headcount by zone, gate entries and deliveries, missing helmets and vests, people in restricted zones, and active work zones.'], ['How does it improve site safety?', 'PPE and zone alerts reach the safety lead while the gap is happening, with the frame attached.'], ['Does a person review alerts?', 'Yes. Nothing is reported against a worker or contractor until a person has reviewed the evidence.'], ['Is BrikVision available now?', 'BrikVision is on the roadmap and part of the Enterprise plan. Pilots are available on request. <a class="link" href="/book-a-demo">Request a pilot</a>']])}</div></section>
${explore('brikvision')}${cta('Put AI on your site cameras.', 'Tell us about your sites and cameras. We’ll scope a BrikVision pilot on one live project.', ['book-a-demo', 'Request a pilot'], ['pricing', 'See plans'])}`;

const REPORTS = [['DPR', 'Daily Progress Report', 'Updates, attendance, GRN'], ['DLR', 'Daily Labour Report', 'Selfie check-in and voice counts: attendance, hours and OT by team and contractor'], ['BOQ', 'Bill of Quantities', 'Drawings and measurements'], ['BBS', 'Bar Bending Schedule', 'Structural drawings: bar marks, shapes, diameters, cut lengths, weights'], ['EST', 'Estimation', 'BOQ, rates and consumption'], ['SCH', 'Schedule', 'Weekly plans and progress: plan vs actual and slippage'], ['FAB', 'Fabrication Drawing', 'Drawing library, latest revision tagged'], ['GRN', 'Goods Received Note', 'POs, gate and store entries'], ['STK', 'Stock Statement', 'GRN, issues and indents: opening, received, issued, closing']];
P.brikdocs = () => `
<section class="hero"><div class="wrap"><div class="split">
<div><div class="rv">${status('docs')}</div><h1 class="d1 rv dl1" style="font-size:clamp(44px,6vw,80px)">Every construction report, generated in a tap.</h1>
<p class="lead rv dl2">Reports are built from work your team already logged in Brikito. No late nights in Excel. Drawings are version-controlled, with the latest revision tagged on site.</p>
<div class="btns rv dl3">${go('book-a-demo', 'Book a demo')}<a class="btn btn-s" href="#reports" data-scroll="reports">See every report</a></div>
<div class="rv" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:30px">${['Ready in seconds', 'Built from logged work', 'Share or print as PDF'].map(x => `<span class="chip">${x}</span>`).join('')}</div></div>
<div class="zoom"><div class="win"><div class="bar"><i></i><i></i><i></i><span>DPR-0612 · Skyline Tower B</span></div><div style="padding:22px;font-size:14px">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div style="display:flex;gap:10px;align-items:center">${logo(26, 'black')}<b style="font-family:var(--ui);font-size:18px">Daily Progress Report</b></div><span class="pill p-fl">2 DAYS BEHIND</span></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">${[['Manpower', '48/51'], ['Concrete', '142 cum'], ['Steel received', '4.2 t']].map(k => `<div style="background:var(--alt);border-radius:12px;padding:12px"><span class="muted" style="font-size:12px">${k[0]}</span><div style="font-family:var(--ui);font-size:22px;font-weight:600">${k[1]}</div></div>`).join('')}</div>
${[['Slab casting L7', '100%', '100%'], ['Blockwork L6', '+15%', '70%'], ['Steel received', '4.2 t', '38.6 t']].map(r => `<div style="display:grid;grid-template-columns:1fr 70px 70px;padding:10px 0;border-bottom:1px solid var(--line)"><span>${r[0]}</span><span class="muted">${r[1]}</span><b>${r[2]}</b></div>`).join('')}
<p class="muted" style="margin-top:14px;font-size:12.5px">Prepared by Brik AI at 18:05 from 5 site messages · Approved by Priya (PM)</p></div></div></div></div></div></section>
<section class="sec-sm" style="padding-top:0"><div class="wrap">${flow([['chat','The site logs the work','chat · voice · photos'],['brik','Brik structures it','figures linked to source','brikn'],['doc','Tap for the DPR','DPR-0612 · 18:05'],['check','Approved PDF','Priya (PM) · share or print','ok']])}</div></section>
<section class="sec"><div class="wrap">${head('The problem', 'The site did the work once. The office types it up three times.', '')}
${pfs([['Late nights in Excel.', 'The DPR is compiled from chats and memory.', 'The DPR is generated from the day’s updates, attendance and material entries.'], ['The wrong revision on site.', 'An outdated drawing gets forwarded on WhatsApp.', 'Every drawing is version-controlled, with the latest tagged.'], ['Reports that don’t agree.', 'The DPR says 4 t of steel. The stock statement says 3.6 t.', 'Every report draws on the same logged records.']])}</div></section>
<section class="sec alt" id="reports"><div class="wrap">${head('Report library', 'Every report your project needs. One tap each.', '', 'center')}
<div class="reports">${REPORTS.map((r, i) => `<div class="rep rv dl${i % 3}"><span class="code">${r[0]}</span><h4>${r[1]}</h4><p>${r[2]}</p></div>`).join('')}</div>
<p class="center muted rv" style="margin-top:30px">Also: Indent · Purchase order · Measurement book · Inspection · Snag list · Expense · and more</p></div></section>
<section class="sec"><div class="wrap"><div class="split">
<div><p class="eyebrow rv">Drawings & documents</p><h2 class="d2 rv">One library. The latest revision, always tagged.</h2><p class="lead rv">Drawings, structural plans, BOQs, agreements and certificates. Every revision tracked, the site’s latest tagged automatically, and linked into BrikChat threads.</p></div>
<div class="zoom">${TABS[4][3]()}</div></div></div></section>
<section class="sec alt"><div class="wrap"><div class="split">
<div class="zoom" style="display:flex;justify-content:center">${phone('Ask your documents', 'Specs · approvals · minutes', m('You', '10:12', 'Curing period for the L7 slab per spec?', null, true) + brik('<b>7 days moist curing</b> for OPC slabs.<br><span style="color:var(--muted)">Spec-CW-03, p.14</span>') + m('You', '10:13', 'Was the tile change approved?', null, true) + brik('<b>Yes</b>, approved by the client on 02 Jun.<br><span style="color:var(--muted)">APR-117</span>'), 'Ask about a spec…')}</div>
<div><p class="eyebrow rv">Ask your documents</p><h2 class="d2 rv">Get the page, not a guess.</h2><p class="lead rv">Search specs, method statements and approvals in plain language. Meeting minutes become action items with owners and dates.</p></div></div></div></section>
<section class="sec"><div class="wrap">${head('How it works', 'Logged once. Reported everywhere.', '')}${steps([['The site logs the work', 'Updates, attendance and material entries, as chat and voice.'], ['Brik structures it', 'Figures are extracted and linked to their source.'], ['Tap to generate', 'Pick the report and the period.'], ['Review and share', 'Approve, then share or print as PDF.']])}</div></section>
<section class="sec alt"><div class="wrap">${head('Who it’s for', 'Less typing. More building.', '')}${boxes([['hat', 'Site engineer', 'Your evening back. Review the DPR, don’t write it.'], ['rupee', 'Quantity surveyor', 'Quantities that tie out across BOQ, BBS, GRN and stock.'], ['users', 'Project manager', 'Client-ready, branded PDFs for any period, on request.'], ['eye', 'Developer & owner', 'One version of the truth: drawings, approvals and reports, current and searchable.']], 'g4')}</div></section>
<section class="sec"><div class="wrap narrow">${head('', 'BrikDocs, answered.', '')}${faq([['What is a DPR?', 'A Daily Progress Report records the day’s work, manpower, materials, issues and next steps. BrikDocs builds it from what the team logged.'], ['What is a BBS?', 'A Bar Bending Schedule lists every reinforcement bar: mark, shape, diameter, cut length and weight, taken from the structural drawings.'], ['Which reports can BrikDocs generate?', 'DPR, DLR, BOQ, BBS, estimation, schedule, fabrication drawings, GRN and stock statements, plus indents, POs, measurement books, inspections, snag lists and expenses.'], ['Where does each report’s data come from?', 'From records already in Brikito: chat updates, attendance, indents, GRNs, drawings and plans. Each figure links to its source.'], ['How are drawing revisions handled?', 'Every upload is versioned. The latest revision is tagged, older ones are marked superseded.'], ['Is BrikDocs available now?', 'Standard DPR and DLR PDFs are in every plan. Comprehensive and client-ready reports are in Professional. The full suite, with AI document search and drawing revision control, is in Enterprise pilot. <a class="link" href="/pricing">See pricing</a>']])}</div></section>
${explore('brikdocs')}${cta('Close Excel. Tap for the report.', 'In 45 minutes we set up one live project and generate your first DPR from your team’s real messages.')}`;

P['how-it-works'] = () => `
<section class="hero" style="padding-bottom:60px"><div class="wrap"><div class="copy"><p class="eyebrow rv">How it works</p><h1 class="d1 rv dl1">Watch a site<br>run itself.</h1><p class="lead rv dl2">Five real workflows, played out in the app. Scroll at your own pace.</p></div></div></section>
${[
  ['01', 'Chat to approval', 'One message becomes a record.', ['Suresh types a request in the site chat.', 'Brik spots an indent and structures it.', 'The office sees the card immediately.', 'One tap approves it and drafts the PO.'], 'From chat chaos to an audit trail, in one message.', () => phone('Tower B · Site Team', '9:18', m('Suresh', '9:18', 'Need 50 bags of cement for Tower B slab by Friday.', ['TICKET', 't-tk']) + brik('Indent #142 created.') + `<div class="card-in"><div class="row"><b>Indent #142</b><span class="pill p-ok">APPROVED</span></div><div class="row"><span>Material</span><b>OPC 53 cement</b></div><div class="row"><span>Qty</span><b>50 bags</b></div><div class="row"><span>Site</span><b>Tower B · slab</b></div><div class="row"><span>Need by</span><b>Friday</b></div></div>` + brik('Indent #142 approved · PO drafted'))],
  ['02', 'Ask Brik anything', 'The site answers back.', ['Ask in plain language.', 'Get counted, flagged progress.', 'Ask a follow-up, like a conversation.'], 'Your site’s memory, on demand.', () => phone('Brik AI', 'online · always on', m('You', '18:02', 'What was my progress last week?', null, true) + brik('<b>Most of the week’s plan done.</b><br>• L7 slab shuttering finished<br>• Column cages C4 to C9 tied<br>• Block B plumbing first fix started<br><span style="color:var(--bad)">Waterproofing crew 2 days behind</span>') + m('You', '18:03', 'And my attendance last month?', null, true) + brik('<b>24 / 26</b> days present.'), 'Ask a follow-up…')],
  ['03', 'CCTV intelligence', 'Four feeds. One sentence each.', ['Your existing cameras, watched 24/7.', 'People and progress read from the frame.', 'Stock on the shelves counted.', 'Idle time flagged to the minute.'], 'Cameras you already have. Eyes you never did.', () => `<div style="width:100%"><div class="win" style="background:#0B0B0F;border-color:#1D1D22;padding:10px">${camGrid()}</div><div class="feed">${[['Progress', 'Slab shuttering ~60% · Tower B'], ['On site', '42 labour · 3 engineers'], ['Store', 'Cement 134 bags · steel 2.1 t'], ['Crew', 'Pour active 6.2 of 8 hrs · idle 14:10–14:40']].map(e => `<div><time style="font-family:var(--body);font-weight:600;color:var(--ink)">${e[0]}</time><span>${e[1]}</span><span></span></div>`).join('')}</div><p class="muted" style="font-size:13px;margin-top:10px">Simulated camera views.</p></div>`],
  ['04', 'Drawing to paperwork', 'Drop a drawing. Get the takeoff.', ['Drag in a structural drawing.', 'Pick BOQ, BBS or fabrication.', 'Brik reads dimensions from the sheet.', 'Quantities, bar schedule and bending sheet come out.'], 'Upload the drawing. The paperwork builds itself.', () => `<div class="win" style="width:100%"><div class="bar"><i></i><i></i><i></i><span>STR-104.pdf · Septic tank</span></div><div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:13.5px"><div><b style="font-family:var(--ui)">BOQ</b>${[['Cement OPC 53', '80 bags'], ['Steel Fe550 · 10 mm', '752 kg'], ['RCC M25', '8.56 m³'], ['Shuttering', '64 m²'], ['Excavation', '22 m³']].map(r => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line)"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div><div><b style="font-family:var(--ui)">BBS</b>${[['10 mm stirrup · 6" c/c', '412'], ['12 mm straight · 4.8 m', '96'], ['10 mm L-bend · 1.85 m', '124'], ['8 mm crank · 2.1 m', '64']].map(r => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line)"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}<span class="chip" style="margin-top:12px"><span class="dot dev live"></span>Generating cutting plan</span></div></div></div>`],
  ['05', 'Cost, time, progress', 'It sees the slip. Then it plans the save.', ['Planned, earned and spent on one curve.', 'The gap shows cost. The bracket shows time.', 'Brik drafts a recovery plan: re-sequenced finishing, a night pour on L8, steel and cement pre-ordered.'], 'It doesn’t just show the slip. It plans the catch-up.', () => `<div class="win" style="width:100%"><div class="bar"><i></i><i></i><i></i><span>Tower B · cost and schedule</span></div><div style="padding:22px">${sCurve(false)}<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><span class="pill p-fl">~10 WEEKS BEHIND</span><span class="pill p-ok">RECOVERY PLAN READY</span><span class="pill p-lg">HANDOVER 14 MAR → 31 JAN</span></div></div></div>`],
].map((s, i) => `<section class="${i % 2 ? 'alt' : ''}"><div class="wrap"><div class="scene">
<div style="order:${i % 2}"><p class="num rv">Scene ${s[0]} · ${s[1]}</p><h2 class="d2 rv">${s[2]}</h2><ol class="rv">${s[3].map(x => `<li>${x}</li>`).join('')}</ol><p class="tagline rv">${s[4]}</p></div>
<div class="zoom" style="display:flex;justify-content:center">${s[5]()}</div></div></div></section>`).join('')}
<section class="sec"><div class="wrap">${head('And everything else', 'The rest of the toolbelt.', '')}
<div class="toolbelt">${[['Selfie attendance', 'Geofenced check-in, sent to payroll.'], ['Revision control', '“You’re on Rev C” before the wrong wall goes up.'], ['AI meeting minutes', 'Decisions and owners, drafted as the call ends.'], ['Auto DPR', 'Daily progress drafted from site photos and chat.'], ['Safety flags', 'Missing PPE and edge risks raised instantly.'], ['Multi-project', 'Switch projects without switching apps.'], ['Shared workspace', 'Developer and contractor on the same record.'], ['Voice to update', 'Hindi or Tamil voice note in, structured update out.']].map((t, i) => `<div class="rv dl${i % 3}" style="background:var(--alt)"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div></div></section>
${cta('See it on your own project.', 'Book a pilot, and we’ll run these workflows on one of your live sites.', ['book-a-demo', 'Book a pilot'], ['pricing', 'See pricing'])}`;

const PLANS = [
  ['Standard', 'Start here', 'For contractors and developers who execute their own work.', 'On request', '', 'Free trial available', 'Enquire now', '#book-a-demo', ['Up to 2 active projects and 25 users', 'Materials & purchasing: indent → approval → issue → PR → PO → GRN', 'DPR and DLR from chat or voice, with photos', 'Labour & attendance: geofenced check-in, labour list, OT, labour bills', 'Tasks, issues and inquiries assigned and closed from chat', 'AI turns chat and voice into forms, in any Indian language', 'Standard DPR and DLR PDFs', 'Status tab with search and filters', 'Mobile app and Admin Console', 'Email and chat support']],
  ['Professional', 'Most popular', 'For teams that execute their own work and oversee contractors.', 'On request', '', 'Everything in Standard, plus', 'Enquire now', '#book-a-demo', ['Up to 5 active projects and 75 users', 'Contractor oversight: a coordination group per contractor and a performance dashboard', 'Planning and plan vs actual: schedule upload, voice weekly plans, day-by-day comparison', 'Delay and lag tracking: slippage, PPC, schedule and cost performance, forecast finish', 'Comprehensive DPR tied to the weekly plan, with work marked on drawings', 'Detailed DLR: team-wise attendance, trends, OT and exceptions', 'Quality and safety: inspections, snags, RFIs and non-conformities', 'RFQ and quote comparison', 'Branded, client-ready PDFs', 'Full Brik AI assistant', 'Management dashboard', 'Priority support']],
  ['Enterprise', 'Custom setup', 'For large real estate developers and general contractors.', 'On request', '', 'Pilot available on request', 'Enquire now', '#book-a-demo', ['Unlimited projects and users', 'BrikVision: AI photo checks for quality and PPE, delivery-note reading, receipt verification', 'BrikDocs: AI search across specs, method statements and approvals; minutes to action items', 'AI verification and risk: cross-checks against drawings, POs, deliveries, inspections and schedule', 'Quality systems: ITP library, NCR register, drawing revision control', 'Labour compliance: worker master, camera attendance, PF/ESI checks', 'Material control: long-lead alerts, specification checks, supplier performance', 'Custom AI workflows, report formats and ERP, accounting and camera integrations', 'SSO, advanced roles and data controls', 'Dedicated implementation team, on-site training, SLA-backed support']],
];
P.pricing = () => `
<section class="hero" style="padding-bottom:40px"><div class="wrap"><div class="copy"><p class="eyebrow rv">Pricing</p><h1 class="d1 rv dl1">Pick the plan that fits how you build.</h1><p class="lead rv dl2">From your first project to a full portfolio. Tell us about your projects and we’ll send you a quote.</p></div></div></section>
<section class="sec-sm" style="padding-top:40px"><div class="wrap"><div class="plans">${PLANS.map((p, i) => `<div class="plan ${i === 1 ? 'hi' : ''} rv dl${i}"><div class="top"><h3 class="h4" style="font-size:26px">${p[0]}</h3><span class="chip" style="${i === 1 ? 'background:#2A2A30;color:#fff' : ''}">${p[1]}</span></div><p class="muted" style="margin-top:10px;font-size:15px">${p[2]}</p><div class="price">${p[3]}<small> ${p[4]}</small></div><p class="muted" style="font-size:14px">${p[5]}</p><ul>${p[8].map(f => `<li>${f}</li>`).join('')}</ul><a class="btn ${i === 1 ? 'btn-p' : 'btn-s'}" href="${p[7]}" ${i === 1 ? 'style="background:#fff;color:#000"' : ''}>${p[6]}</a></div>`).join('')}</div>
<div class="enq rv"><div><h3 class="h4" style="font-size:24px">Pricing that fits your projects.</h3><p class="muted" style="margin-top:6px">Every company builds differently, so we price to your projects and team. Call or write to us, and we’ll send a quote within one working day.</p></div><div class="btns" style="margin-top:0">${go('book-a-demo', 'Enquire for pricing')}<a class="btn btn-s" href="mailto:hey@brikito.com">hey@brikito.com</a></div></div></div></section>
<section class="sec alt"><div class="wrap">${head('Compare', 'Compare plans.', '', 'center')}<div class="cmpwrap rv"><table class="cmp"><thead><tr><th></th><th>Standard</th><th>Professional</th><th>Enterprise</th></tr></thead><tbody>${[
  ['Best for', 'Executors', 'Executors and overseers', 'Large developers and GCs'], ['Free trial', 'Yes', '—', 'Pilot on request'], ['Projects / users', '2 / 25', '5 / 75', 'Unlimited'], ['Materials & purchasing', 'Y', 'Y', 'Y'], ['DPR & DLR', 'Standard', 'Comprehensive', 'Custom formats'], ['Labour & attendance', 'Basic', 'Basic', 'Adds PF/ESI and camera'], ['Tasks, issues & inquiries', 'Y', 'Y', 'Y'], ['Planning & plan vs actual', '—', 'Y', 'Y'], ['Delay & lag analysis', '—', 'Y', 'Adds risk prediction'], ['Contractor oversight', '—', 'Y', 'Y'], ['Quality & safety', '—', 'Y', 'Adds ITP, NCR and AI checks'], ['RFQ & quote comparison', '—', 'Y', 'Y'], ['Brik AI assistant', 'Core', 'Full', 'Full + custom'], ['BrikVision & BrikDocs suite', '—', '—', 'Y'], ['Integrations & SSO', '—', '—', 'Y'], ['Support', 'Email and chat', 'Priority', 'Dedicated team'],
].map(r => `<tr>${r.map((c, j) => `<td>${j && c === 'Y' ? '<span class="yes" aria-label="Included"></span>' : j && c === '—' ? '<span class="no">—</span>' : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div></section>
<section class="sec"><div class="wrap narrow">${head('FAQs', 'Before you get started.', '')}${faq([['How much does Brikito cost?', 'Pricing depends on your projects, team size and the plan you choose. Enquire through the form or write to hey@brikito.com and we’ll send a quote within one working day.'], ['Can I upgrade later?', 'Yes. Move to Professional at any time. Your data and groups stay as they are.'], ['Is there a free trial?', 'Yes, on Standard. Enterprise teams can start with a pilot on one live project.'], ['Does the AI create anything without us?', 'No. Brik drafts; a person always confirms.'], ['Do you work in regional languages?', 'Yes: Tamil, Hindi, English and other Indian languages.']])}</div></section>
${cta('Ready to run your sites from one app?', 'Tell us about your projects and your team. We’ll recommend a setup.', ['book-a-demo', 'Talk to us'], ['how-it-works', 'How it works'])}`;

P.about = () => `
<section class="hero" style="padding-bottom:40px"><div class="wrap"><div class="copy"><p class="eyebrow rv">Construction made simple</p><h1 class="d1 rv dl1">We’re building the operating system for construction.</h1><div class="btns rv dl2" style="justify-content:center">${go('book-a-demo', 'Talk to our team')}<a class="btn btn-s" href="#founder" data-scroll="founder">Meet the founder</a></div></div></div></section>
<section class="sec-sm"><div class="wrap"><div class="stats">${[['1', 'app in place of WhatsApp, registers, drawings, email and Excel'], ['4', 'products: Brik AI, BrikChat, BrikVision and BrikDocs'], ['7', 'Indian languages crews can speak or type in'], ['2026', 'pilot on live residential, metro and logistics sites']].map((s, i) => `<div class="stat rv dl${i}"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div></div></section>
<section class="sec alt"><div class="wrap"><div class="split">
<div><p class="eyebrow rv">Our story</p><h2 class="d2 rv">Construction runs on chat. Its software never did.</h2><p class="lead rv">Site work is spread across WhatsApp groups, paper registers, drawing folders, email and spreadsheets. Most construction software fails for one reason: the site never adopts it. Brikito is simple enough for the crew, and Brik AI structures everything for the office.</p></div>
<div class="mascot zoom"><span class="mglow" aria-hidden="true"></span><img src="/img/brik-o.webp" alt="Brik, the Brikito mascot"><span class="mshadow" aria-hidden="true"></span></div></div></div></section>
<section class="sec"><div class="wrap"><div class="g2">
<div class="box rv" style="background:var(--alt);border:0;padding:44px"><p class="eyebrow">Our mission</p><h3 class="d3" style="margin:0">Make construction simple to run, for every site team.</h3></div>
<div class="box rv dl1" style="background:#0B0B0F;color:#fff;border:0;padding:44px"><p class="eyebrow" style="color:#8E8E95">Our vision</p><h3 class="d3" style="margin:0">The AI operating system for real estate development.</h3></div></div></div></section>
<section class="sec dark"><div class="wrap"><div class="secthead rv"><p class="eyebrow">What we stand for</p><h2 class="d2">Four non-negotiables, written before the code.</h2></div>
<div class="vals">${VALS.map((v, i) => `<div class="val rv dl${i}"><small>0${i + 1} · ${v[0]}</small><h4>${v[1]}</h4><p>${v[2]}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap">${head('Pilot · 2026', 'Already running on live sites.', '')}
<div class="stats">${[['6→1', 'tools consolidated into one app'], ['3', 'live projects from one login'], ['92%', 'on-site attendance captured by selfie'], ['9 days', 'schedule slip surfaced live']].map((s, i) => `<div class="stat rv dl${i}"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
<p class="muted rv" style="margin-top:50px">Piloting with Gofar Group. SR Ilangovan, Director, approves the day’s indents from the Brikito app.</p>
<div style="margin-top:80px">${roadmap()}</div></div></section>
<section class="sec alt" id="founder"><div class="wrap"><div class="split">
<div class="rv founder-photo"><img src="/images/team/aashiq-ahamed.jpg" width="880" height="1100" alt="Aashiq Ahamed, Founder of Brikito" loading="lazy" decoding="async"></div>
<div><p class="eyebrow rv">Meet the founder</p><h2 class="d2 rv">Aashiq Ahamed</h2><p class="lead rv">Founder, Brikito. Construction tech and AI entrepreneur.</p>
<p class="rv" style="margin-top:20px;font-size:17px;color:#2B2B31;max-width:520px">Before Brikito, Aashiq ran a construction company for nine years, delivering residential, commercial and industrial projects and his own real estate developments. Brikito is the tool he wanted on his own sites.</p>
<div class="btns rv">${go('book-a-demo', 'Talk to Aashiq’s team')}<a class="btn btn-s" href="https://www.instagram.com/brikitoai/">Instagram</a></div></div></div></div></section>
<section class="sec"><div class="wrap center">${head('', 'Want to build the future of construction with us?', 'We’re hiring builders, engineers and designers who care about sites as much as software. Write to hey@brikito.com.', 'center')}<div class="btns rv"><a class="btn btn-p" href="mailto:hey@brikito.com">Get in touch</a></div></div></section>
${cta('Let’s build your next project together.', 'hey@brikito.com', ['book-a-demo', 'Book a demo'], ['pricing', 'See pricing'])}`;

const POSTS = [
  ['Best AI Construction Management Software in 2026: How to Choose', 'Technology & AI', 8, '7 Nov 2026', 'What AI construction software does, 8 criteria, the top AI construction tools by type, and how to choose one.'],
  ['AI Construction Management Software in India: Chennai, Bengaluru and Coimbatore', 'Technology & AI', 7, '7 Nov 2026', 'How AI construction software works on Indian sites, with city guides for Chennai, Bengaluru and Coimbatore.'],
  ['AI Construction Management Software in the UAE and Singapore', 'Technology & AI', 5, '7 Nov 2026', 'How AI helps contractors in Dubai, the UAE, Singapore and Sri Lanka with multilingual crews, safety and reporting.'],
  ['AI Construction Site Chat: The WhatsApp Alternative That Turns Messages Into Work', 'Technology & AI', 5, '7 Nov 2026', 'How AI site chat tags messages and voice notes, and turns site requests into indents the PM approves in one tap.'],
  ['AI CCTV for Construction Sites: Headcount, PPE and Progress Monitoring', 'Technology & AI', 6, '7 Nov 2026', 'How computer vision on your existing CCTV gives live headcount, delivery logs, PPE alerts and progress monitoring.'],
  ['Construction Document Control: Drawings, Revisions and Approvals', 'Site management', 8, '6 Nov 2026', 'Drawing registers, numbering, status codes, transmittals, and a workflow that keeps superseded drawings off site.'],
  ['Construction Site Safety and Quality Management: A Practical Guide', 'Site management', 8, '6 Nov 2026', 'Hazard controls, permits, PPE, toolbox talks, ITPs, hold points, defects and NCRs.'],
  ['Construction Management Software: The Complete Buyer’s Guide', 'Technology & AI', 9, '6 Nov 2026', 'Software types, a feature checklist, pricing models, demo questions and a seven-step selection process.'],
  ['Construction Site Communication: The Complete Guide for Developers and Contractors', 'Site management', 10, '5 Nov 2026', 'Channels, a communication matrix, a daily rhythm, and how to write site messages people can act on.'],
  ['Construction Site Documentation: Every Report a Project Needs', 'Site management', 10, '5 Nov 2026', 'Required records, their owners and frequency, plus IS 456 cube sampling and RERA updates.'],
  ['Construction Labour Management: Attendance, Productivity and Payroll', 'Site management', 10, '5 Nov 2026', 'Manpower planning, attendance controls, output per labour-day, contractor bill checks and the new labour codes.'],
  ['Daily Progress Report (DPR) in Construction: Format, Template and How to Automate It', 'Site management', 10, '2 Nov 2026', 'What goes in a DPR, a worked example and format, and how to automate it.'],
  ['Building Construction Process Step by Step', 'Planning & workflow', 13, '2 Nov 2026', 'Eight stages from approvals to handover, the hold points between them, and where time is lost.'],
  ['Construction Material Management: From Indent to Consumption', 'Cost control', 11, '2 Nov 2026', 'Indent, purchase order, goods receipt, storage, issue and reconciliation, step by step.'],
  ['Construction Cost Control: A Practical Guide for Developers', 'Cost control', 11, '2 Nov 2026', 'Budgets, commitments, earned value, and the site events that drive cost variances.'],
  ['Construction Scheduling and Delay Management Guide', 'Planning & workflow', 11, '2 Nov 2026', 'Master programmes, daily plans, the critical path, PPC, delay types and recovery.'],
  ['Construction in India, UAE, Singapore and Sri Lanka: A Market Guide', 'Planning & workflow', 12, '2 Nov 2026', 'Regulations and grading systems across four markets, and the site problems they share.'],
  ['Your BOQ can be 100% correct and your project can still lose money.', 'Cost control', 6, '1 Nov 2026', 'Why accurate estimates don’t guarantee cost control, and the execution gaps that erode margin.'],
  ['The 7 construction updates nobody should have to ask for.', 'Site management', 5, '31 Oct 2026', 'Progress, manpower, materials, tasks, documents, delays and budget. They should arrive on their own.'],
  ['What if your construction project had a brain?', 'Technology & AI', 7, '30 Oct 2026', 'How AI helps teams find information, structure updates and flag what needs attention.'],
  ['The most dangerous drawing on a construction site.', 'Planning & workflow', 6, '29 Oct 2026', 'A good drawing that’s no longer the latest revision.'],
  ['Rework isn’t always a labour problem.', 'Site management', 4, '28 Oct 2026', 'Check instructions, revisions, approvals and handoffs before blaming the crew.'],
  ['Where does a construction project actually lose time?', 'Planning & workflow', 5, '27 Oct 2026', 'Delays often start as small waits between decisions, approvals and teams.'],
];
const SLUGS = ['blog-best-ai-construction-management-software', 'blog-ai-construction-software-india', 'blog-ai-construction-software-uae-singapore', 'blog-ai-construction-site-chat', 'blog-ai-cctv-construction-site-monitoring', 'blog-construction-document-control', 'blog-construction-site-safety-and-quality', 'blog-construction-management-software', 'blog-construction-site-communication', 'blog-construction-site-documentation', 'blog-construction-labour-management', 'blog-daily-progress-report-construction', 'blog-building-construction-process', 'blog-construction-material-management', 'blog-construction-cost-control', 'blog-construction-scheduling', 'blog-construction-market-guide', 'blog-boq-cost-overruns', 'blog-seven-site-updates', 'blog-ai-construction', 'blog-drawing-revisions', 'blog-rework-coordination', 'blog-where-time-goes'];
const coverFor = (cat, i) => {
  const pat = { 'Site management': 'chat', 'Technology & AI': 'ai', 'Cost control': 'rupee', 'Planning & workflow': 'clock', 'Project management': 'layers' }[cat] || 'doc';
  const dk = i % 3 === 1;
  return `<div class="cov" style="background:${dk ? '#0B0B0F' : 'var(--alt)'};display:flex;align-items:center;justify-content:center">${ic(pat, 44, dk ? '#fff' : '#0B0B0F', 1.3)}<span style="position:absolute;left:18px;bottom:14px;font-size:12px;font-weight:600;color:${dk ? '#8E8E95' : 'var(--muted)'}">${cat}</span></div>`;
};
P.journal = () => `
<section class="hero" style="padding-bottom:40px"><div class="wrap"><div class="copy"><p class="eyebrow rv">The Brikito Journal</p><h1 class="d1 rv dl1">Better projects start with better information.</h1><p class="lead rv dl2">Practical ideas on site coordination, cost control, construction technology and AI.</p></div></div></section>
<section class="sec-sm" style="padding-top:30px"><div class="wrap">
<a class="rv feat-post" href="/blog-construction-information-management" style="display:grid;grid-template-columns:1.1fr 1fr;border-radius:var(--r-xl);overflow:hidden;background:#0B0B0F;color:#fff">
<div style="padding:56px;display:flex;flex-direction:column;gap:18px"><span class="chip" style="background:#1D1D22;color:#D6D6DA;align-self:flex-start">Editor’s pick · Project management</span><h2 class="d3">Your construction project doesn’t have a communication problem. It has an information problem.</h2><p style="color:#A1A1A8">Updates scattered across chats, calls, spreadsheets and drawings cost teams their context. How to spot the gaps, and bring project information together.</p><span style="color:#8E8E95;font-size:14px">8 min read · 2 Nov 2026</span><span class="link" style="color:#9DB3FF">Read the story ${chev}</span></div>
<div style="background:#141417;display:flex;align-items:center;justify-content:center;padding:40px">${logo(160, 'grad')}</div></a>
<div style="margin-top:80px">${head('', 'Latest thinking.', 'Useful perspectives for people who plan, build and manage projects.')}</div>
<div class="filters" data-filters>${['All stories', 'Site management', 'Cost control', 'Technology & AI', 'Planning & workflow'].map((f, i) => `<button class="${i ? '' : 'on'}" data-f="${f}">${f}</button>`).join('')}<input type="search" placeholder="Search articles" aria-label="Search articles" data-q></div>
<div class="posts" data-posts>${POSTS.map((p, i) => `<a class="post rv dl${i % 3}" href="/${SLUGS[i]}" data-cat="${p[1]}" data-t="${p[0].toLowerCase()} ${p[4].toLowerCase()}">${coverFor(p[1], i)}<div class="bd"><small>${p[2]} min read · ${p[3]}</small><h3>${p[0]}</h3><p>${p[4]}</p><span class="link">Read article ${chev}</span></div></a>`).join('')}</div>
<p class="center muted" data-empty style="display:none;margin-top:30px">No articles match that search. Try a different keyword or category.</p></div></section>
${cta('Put better information to work.', 'See how Brikito turns site chat into records, reports and decisions.')}`;

P['book-a-demo'] = () => `
<section class="hero" style="padding-bottom:40px"><div class="wrap"><div class="split" style="align-items:start">
<div style="position:sticky;top:110px"><p class="eyebrow rv">A closer look at Brikito</p><h1 class="d2 rv dl1">See what your team can do with everything connected.</h1>
<p class="lead rv dl2">A 45-minute session. We set your team up on one live project, with site chat, Brik AI and reports running the same day.</p>
<ul class="list rv dl3"><li>${ic('layers')}<span><b>Start with your workflow.</b> We tailor the walkthrough to how your sites run today.</span></li><li>${ic('bolt')}<span><b>See Brikito in action.</b> Messages turning into indents, reports and approvals.</span></li><li>${ic('chat')}<span><b>Get your questions answered.</b> No pressure, no obligation.</span></li></ul>
<div class="rv" style="display:flex;gap:16px;align-items:center;margin-top:38px;padding-top:28px;border-top:1px solid var(--line)"><img src="/img/brik-head-v2.webp" alt="" style="width:56px;height:56px;border-radius:50%;flex:none"><p class="muted" style="font-size:15px">Brik will be in the demo too. Ask it anything about the sample project.</p></div></div>
<form class="form rv dl2" id="demoRequestForm" data-form>
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
<p class="full note">By submitting, you agree Brikito may contact you about your request. See our <a class="link" href="/privacy">privacy policy</a>.</p></form>
</div></div></section>
<section class="sec alt"><div class="wrap">${head('A connected workspace', 'Less switching between tools. More clarity across the work.', '', 'center')}${boxes([['chat', 'Communication', 'Site chat, DMs, meetings and mail in one place.'], ['ai', 'Intelligence', 'Brik AI answers, drafts and flags from live data.'], ['dash', 'Visibility', 'Progress, manpower and materials, live.'], ['doc', 'Documents', 'Reports and drawings, current and searchable.']], 'g4')}</div></section>`;

P.privacy = () => `
<section class="hero" style="padding-bottom:20px"><div class="wrap"><div class="copy"><p class="eyebrow rv">Legal</p><h1 class="d1 rv dl1">Privacy policy</h1><p class="lead rv dl2">Brikito is a site-management app for construction companies. This policy explains what we collect, why, and your rights under India’s DPDP Act, 2023.</p><p class="rv dl3" style="margin-top:14px"><span class="chip">Last updated: <span class="ph">[ date ]</span></span> <span class="chip">India · DPDP Act, 2023</span></p></div></div></section>
<section class="sec-sm"><div class="wrap"><div class="prose" style="margin:0 auto">${window.__PRIVACY_HTML__ || ''}</div></div></section>`;


const MODS = [
  ['Home', 'dash', 'The project at a glance: progress, schedule, labour, safety, and what Brik found today.'],
  ['Internal', 'check', 'Approvals, your team today, labour, store and quality, with what’s waiting on you.'],
  ['Chat', 'chat', 'Site, indent, purchase, quality and drawing groups, one chat per subcontractor, and Brik.'],
  ['Status', 'layers', 'Every record in one list: DPRs, tasks, indents, receipts, NCRs, by type or by person.'],
  ['Activity', 'clock', 'What happened on site, as it happened, with Brik’s photo checks.'],
  ['Media', 'cam', 'Every site photo and video, tagged by date, level and activity.'],
  ['Documents', 'draw', 'Drawings and documents with the latest revision always tagged.'],
  ['Mail', 'mail', 'A project mailbox Brik can read and draft from.'],
  ['Subcontractors', 'users', 'Submittals, bills and one chat for each subcontractor.'],
  ['Client', 'send', 'Submittals and transmittals to the client, tracked to the reply.'],
  ['Labour', 'hat', 'The daily manpower board, attendance and labour bills.'],
  ['Store', 'box', 'Stock, receipts, issues and indents, reconciled.'],
  ['Finance', 'rupee', 'Bills, payments and cost against plan.'],
  ['Team & Control', 'lock', 'People, roles, approval rules and project settings.'],
];
P.console = () => `
<section class="hero" style="padding-bottom:30px"><div class="wrap"><div class="copy">
<div class="rv">${status('live')}</div>
<h1 class="d1 rv dl1">Brikito Console.</h1>
<p class="lead rv dl2">One place to run every project. Chat, Brik AI, reports, cameras and mail all live here, on the same people, records and approvals.</p>
<div class="btns rv dl3" style="justify-content:center">${go('book-a-demo', 'Book a demo')}<a class="btn btn-s" href="https://app.brikito.com/signup" target="_blank" rel="noopener">Sign in</a></div></div>
<div class="zoom" style="margin-top:70px">${laptop('console-home', 'Brikito Console home: Skyline Residency Tower B, day 258, 46.2% done, 97 of 102 on site')}</div></div></section>
<section class="sec"><div class="wrap">${head('The base platform', 'Every Brikito product sits on the Console.', 'Sign in once. Every product shares the same projects, people, permissions and records, so nothing is typed twice and nothing gets lost between apps.', 'center')}${stack()}</div></section>
<section class="sec alt"><div class="wrap">${head('All-in-one', 'Everything the project needs, in one sidebar.', 'Fourteen workspaces, each one fed by the site chat and kept up to date by Brik.')}
<div class="mods">${MODS.map((mm, i) => `<div class="mod rv dl${i % 3}"><span class="ico">${ic(mm[1], 20)}</span><b>${mm[0]}</b><p>${mm[2]}</p></div>`).join('')}</div></div></section>
${[
  ['console-chat', 'Chat', 'The site chat, inside the Console.', 'Every group, every subcontractor and the client in one inbox. Photos, voice notes and issues land here, and Brik turns them into records.', ['Site, indent, purchase, quality and drawing groups', 'One chat for each subcontractor', 'Issues and NCRs raised straight from a photo']],
  ['console-status', 'Status', 'Every record. One list.', 'DPRs, tasks, indents, receipts, inspections and NCRs, from every person and every chat, filterable in a click.', ['Grouped by kind: reports, work, materials, purchase', 'Who did what, and when', 'Brik’s drafts sit beside your team’s work']],
  ['console-labour', 'Labour', 'Today’s manpower, signed off.', 'The daily manpower record builds itself from the DLRs and the gate check-in: every team and subcontractor, trade by trade, against plan.', ['Committed vs actual, by team and trade', 'Short today and tomorrow’s plan', 'Share to the site group in one tap']],
  ['console-subs', 'Subcontractors', 'Every subcontractor, one workspace.', 'Submittals, transmittals, bills and a dedicated chat for each subcontractor, with whose turn it is and what’s overdue.', ['Mobilisation, quality and commercial papers', 'Whose turn it is, and since when', 'RA bills tracked to approval']],
].map((f, i) => `<section class="sec ${i % 2 ? 'alt' : ''}"><div class="wrap"><div class="feat ${i % 2 ? 'rev' : ''}">
<div><p class="eyebrow rv">${f[1]}</p><h2 class="d2 rv">${f[2]}</h2><p class="lead rv">${f[3]}</p><ul class="list rv" style="gap:12px">${f[4].map(x => `<li>${ic('check', 20)}<span>${x}</span></li>`).join('')}</ul></div>
<div class="zoom"><div class="shot"><img src="/img/${f[0]}.webp" alt="Brikito Console · ${f[1]}" loading="lazy"></div></div></div></div></section>`).join('')}
<section class="sec"><div class="wrap">${head('One console, every role', 'Set up for how you work. On every project.', 'Brik asks a few simple questions when you create a project. The Console then shows what your role on that project needs.', 'center')}
${boxes([['hat', 'Builder', 'You do the work with your own team and subcontractors. Labour, store, DPRs and bills come first.'], ['layers', 'General contractor', 'You manage package contractors and report to the client. Submittals, transmittals and vendor scores come first.'], ['eye', 'Client', 'You own the project. Progress, quality and payments, without chasing anyone.']])}</div></section>
<section class="sec alt"><div class="wrap"><div class="split">
<div><p class="eyebrow rv">Web and mobile</p><h2 class="d2 rv">The office on the Console. The site on the app.</h2><p class="lead rv">Managers run the project from the Console on a laptop. Site teams join by phone number and work from the mobile app. Both see the same records, live.</p><div class="btns rv">${go('brikchat', 'See the mobile app', 'btn btn-s')}</div></div>
<div class="zoom" style="display:flex;justify-content:center">${heroPhone}</div></div></div></section>
${cta('Run every project from one place.', 'In 45 minutes we set up one live project on the Brikito Console, with your team and your real messages.', ['book-a-demo', 'Book a demo'], ['pricing', 'See pricing'])}`;

// ---------------- shell ----------------
P.notfound = () => `
<section class="hero" style="padding-bottom:40px"><div class="wrap"><div class="copy"><p class="eyebrow rv">Error 404</p><h1 class="d1 rv dl1">This page has moved off site.</h1><p class="lead rv dl2">The page you’re looking for doesn’t exist or has a new address. Try one of these instead.</p><div class="btns rv dl3" style="justify-content:center">${go('home', 'Go to the homepage')}${go('book-a-demo', 'Book a demo', 'btn btn-s')}</div></div></div></section>
${explore('')}`;
const ROUTES = ['home', 'console', 'brik-ai', 'brikchat', 'brikvision', 'brikdocs', 'how-it-works', 'pricing', 'journal', 'about', 'book-a-demo', 'privacy'];
const TITLES = { home: 'Brikito · Intelligent construction', console: 'Brikito Console · Brikito', 'brik-ai': 'Brik AI · Brikito', brikchat: 'BrikChat · Brikito', brikvision: 'BrikVision · Brikito', brikdocs: 'BrikDocs · Brikito', 'how-it-works': 'How it works · Brikito', pricing: 'Pricing · Brikito', journal: 'Journal · Brikito', about: 'About · Brikito', 'book-a-demo': 'Book a demo · Brikito', privacy: 'Privacy policy · Brikito' };
const nav = () => `<header class="nav"><div class="wrap in">
<a class="logo breathe" href="/" aria-label="Brikito home">${logo(28, 'black')}</a>
<nav class="links" aria-label="Main"><a href="/console">Console</a><button type="button" data-mega aria-expanded="false">Products <span aria-hidden="true" style="font-size:10px">▾</span></button><a href="/how-it-works">How it works</a><a href="/pricing">Pricing</a><a href="/blog">Journal</a><a href="/about">About</a></nav>
<div class="right"><a class="signin" href="https://app.brikito.com/signup" target="_blank" rel="noopener">Sign in</a><a class="btn btn-p btn-sm" href="/book-a-demo">Book a demo</a><button class="burger" type="button" aria-label="Menu" data-burger><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B0B0F" stroke-width="1.8" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg></button></div></div>
<div class="mega" data-megapanel><div class="wrap"><a class="megacon" href="/console">${logo(26, 'grad')}<span><b>Brikito Console</b><span>The base platform every product lives on</span></span><span class="link" style="margin-left:auto">Explore ›</span></a><div class="grid4">${[['brik-ai', 'Brik AI', 'The AI assistant built for construction', 'ai', 'live'], ['brikchat', 'BrikChat', 'Site chat that turns messages into work', 'chat', 'dev'], ['brikvision', 'BrikVision', 'AI on your site CCTV, around the clock', 'eye', 'pilot'], ['brikdocs', 'BrikDocs', 'DPR, BOQ, BBS and more in one tap', 'doc', 'docs']].map(p => `<a href="${U(p[0])}"><span class="ico" style="background:var(--alt)">${ic(p[3])}</span><b>${p[1]}</b><span>${p[2]}</span></a>`).join('')}</div></div></div></header>
<div class="sheet" data-sheet>${[['home', 'Home'], ['console', 'Brikito Console'], ['brik-ai', 'Brik AI'], ['brikchat', 'BrikChat'], ['brikvision', 'BrikVision'], ['brikdocs', 'BrikDocs'], ['how-it-works', 'How it works'], ['pricing', 'Pricing'], ['journal', 'Journal'], ['about', 'About'], ['book-a-demo', 'Book a demo']].map(r => `<a href="${U(r[0])}">${r[1]}</a>`).join('')}<a href="https://app.brikito.com/signup" target="_blank" rel="noopener">Sign in</a></div>`;
const footer = () => `<footer><div class="wrap"><div class="cols">
<div><a class="logo" href="/" aria-label="Brikito home">${logo(32, 'black')}</a><p style="margin-top:14px">Construction made simple.</p><p style="margin-top:8px">hey@brikito.com</p></div>
<div><h5>Product</h5><a href="/console">Brikito Console</a><a href="/brik-ai">Brik AI</a><a href="/brikchat">BrikChat</a><a href="/brikvision">BrikVision</a><a href="/brikdocs">BrikDocs</a><a href="/pricing">Pricing</a></div>
<div><h5>Explore</h5><a href="/how-it-works">How it works</a><a href="/blog">Journal</a><a href="/about">About us</a><a href="/book-a-demo">Book a demo</a></div>
<div><h5>Get started</h5><a href="https://app.brikito.com/signup" target="_blank" rel="noopener">Sign in</a><a href="/book-a-demo">Talk to our team</a><a href="/privacy">Privacy policy</a></div></div>
<div class="bottom"><span>© 2026 Brikito. All rights reserved.</span><span class="soc"><a href="https://www.youtube.com/@Brikitoai">YouTube</a><a href="https://www.instagram.com/brikitoai/">Instagram</a><a href="https://www.linkedin.com/company/brikito">LinkedIn</a><a href="https://www.facebook.com/brikitoai">Facebook</a></span></div></div></footer>`;

let current = null;
function render(route) {
  const app = document.getElementById('app');
  app.innerHTML = P[route]() + footer();
  const h = app.querySelector('.hero'); if (h && !h.querySelector('.aurora')) h.insertAdjacentHTML('afterbegin', '<div class="aurora" aria-hidden="true"></div>');
  document.title = TITLES[route];
  document.querySelectorAll('.nav .links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === U(route)));
  window.scrollTo(0, 0);
  wire(app);
}
function routeFromHash() { const h = (location.hash || '').replace('#', ''); return ROUTES.includes(h) ? h : 'home'; }
function navigate() {
  const r = routeFromHash(); if (r === current) return;
  closeMenus();
  const first = current === null; current = r;
  const bar = document.querySelector('.progress');
  if (!first && bar) { bar.style.opacity = 1; bar.style.width = '70%'; }
  const done = () => { if (bar) { bar.style.width = '100%'; setTimeout(() => { bar.style.opacity = 0; bar.style.width = 0; }, 300); } };
  if (!first && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(() => render(r)).finished.then(done, done);
  } else {
    render(r);
    if (!first) { const app = document.getElementById('app'); app.classList.remove('fallback-in'); void app.offsetWidth; app.classList.add('fallback-in'); }
    done();
  }
}
function closeMenus() {
  const mp = document.querySelector('[data-megapanel]'); mp && mp.classList.remove('open');
  const mb = document.querySelector('[data-mega]'); mb && mb.setAttribute('aria-expanded', 'false');
  const sh = document.querySelector('[data-sheet]'); sh && sh.classList.remove('open');
}

// ---------------- interactions ----------------
let io;
function wire(root) {
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  root.querySelectorAll('.rv,.zoom').forEach(el => io.observe(el));
  // statement word reveal
  root.querySelectorAll('[data-statement]').forEach(el => { el.innerHTML = el.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' '); });
  // tabs
  root.querySelectorAll('[data-tabs] button').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('[data-tabs] button').forEach(x => x.classList.toggle('on', x === b));
    root.querySelector('#tabpanel').innerHTML = tabPanel(+b.dataset.i);
  }));
  // in-page scroll buttons
  root.querySelectorAll('[data-scroll]').forEach(b => b.addEventListener('click', () => { const t = document.getElementById(b.dataset.scroll); t && window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' }); }));
  // journal filters
  const posts = root.querySelector('[data-posts]');
  if (posts) {
    let cat = 'All stories', q = '';
    const apply = () => { let n = 0; posts.querySelectorAll('.post').forEach(p => { const ok = (cat === 'All stories' || p.dataset.cat === cat) && (!q || p.dataset.t.includes(q)); p.style.display = ok ? '' : 'none'; if (ok) { n++; p.classList.add('in'); } }); root.querySelector('[data-empty]').style.display = n ? 'none' : 'block'; };
    root.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { cat = b.dataset.f; root.querySelectorAll('[data-f]').forEach(x => x.classList.toggle('on', x === b)); apply(); }));
    root.querySelector('[data-q]').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); apply(); });
  }
  // form: the live demo-request form, saved to the "Brikito – Demo Requests" Google Sheet
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
  onScroll();
}
let ticking = false;
function onScroll() {
  ticking = false;
  const y = scrollY, vh = innerHeight;
  document.querySelectorAll('[data-statement]').forEach(el => {
    const r = el.getBoundingClientRect(); const ws = el.querySelectorAll('.w');
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(p * ws.length); ws.forEach((w, i) => w.classList.toggle('on', i < n));
  });
  const st = document.getElementById('stage');
  if (st) { const r = st.getBoundingClientRect(); const k = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / vh)); st.querySelectorAll('[data-par]').forEach(el => { const f = +el.dataset.par; el.style.transform = (f === 0 ? 'translateX(-50%) ' : '') + `translateY(${(f * k).toFixed(1)}px)`; }); }
  document.querySelectorAll('[data-count]').forEach(el => {
    if (el.dataset.done || el.getBoundingClientRect().top > vh * 0.9) return; el.dataset.done = 1;
    const raw = el.dataset.count, mm = raw.match(/^(\d+)(.*)$/); if (!mm) return;
    const target = +mm[1], suf = mm[2], t0 = performance.now();
    const step = t => { const u = Math.min(1, (t - t0) / 1200), e = 1 - Math.pow(1 - u, 3); el.textContent = Math.round(target * e) + suf; if (u < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);

const BUILD = window.__BUILD_ROUTE__;
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
if (!document.querySelector('script[data-brikchat]')) { const c = document.createElement('script'); c.src = '/assets/brik-chat.js?v=20261110c'; c.defer = true; c.dataset.brikchat = '1'; document.head.appendChild(c); }
if (!document.querySelector('script[data-exitoffer]')) { const x = document.createElement('script'); x.src = '/assets/exit-offer.js?v=20261110a'; x.defer = true; x.dataset.exitoffer = '1'; document.head.appendChild(x); }

document.addEventListener('click', e => {
  const m = e.target.closest('[data-mega]');
  if (m) { const p = document.querySelector('[data-megapanel]'); const o = !p.classList.contains('open'); p.classList.toggle('open', o); m.setAttribute('aria-expanded', o); return; }
  const b = e.target.closest('[data-burger]'); if (b) { document.querySelector('[data-sheet]').classList.toggle('open'); return; }
  if (!e.target.closest('[data-megapanel]')) closeMenus();
});
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenus(); });

document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="/"]'); if (!a || e.metaKey || e.ctrlKey || a.target) return;
  const bar = document.querySelector('.progress'); if (bar) { bar.style.opacity = 1; bar.style.width = '70%'; }
});
addEventListener('pageshow', () => { const bar = document.querySelector('.progress'); if (bar) { bar.style.opacity = 0; bar.style.width = 0; } });
wire(document.getElementById('app') || document.body);

})();
