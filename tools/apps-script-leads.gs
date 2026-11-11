// Copy of the Google Apps Script (project "Untitled project", web app "Untitled" deployment) that
// receives website leads. The live copy is edited at script.google.com; keep this in sync.
/**
 * Brikito website leads → Google Sheet + email
 * 1. Book a demo form (brikito.com/book-a-demo) → "Leads" tab (incl. WhatsApp number), email "New demo request".
 * 2. Brik chat assistant (on every page)        → "Website Chat Bot" tab, email "New enquiry on Brik chat bot website".
 * 3. "Talk on WhatsApp" on the Pricing page     → "WhatsApp Enquiries" tab, email "New WhatsApp enquiry".
 * 4. Delay cost calculator (/delay-cost-calculator) → "Delay Calculator" tab, PDF report emailed to the visitor + alert.
 */
const SHEET_ID = '1bf6VNAK8MmIxPaBNhCkgaKU00nR-vhVIdVgyEv77m7s';
const SHEET_NAME = 'Leads';
const CHAT_SHEET_NAME = 'Website Chat Bot';
const WA_SHEET_NAME = 'WhatsApp Enquiries';
const CALC_SHEET_NAME = 'Delay Calculator';
const NOTIFY_EMAIL = 'marketing@brikito.com'; // set to '' to turn off emails

const CHAT_HEADERS = ['Timestamp', 'Name', 'Work email', 'Phone / WhatsApp', 'Company', 'Role', 'Active projects',
  'Region', 'Request', 'Suggested plan', 'Conversation', 'Page', 'Status'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Spam trap: real visitors never fill this hidden field
    if (p.website) return json({ ok: true });

    if (p.source === 'delay-calc') {
      saveDelayCalc(p);
      return json({ ok: true });
    }

    if (p.source === 'whatsapp-click') {
      saveWhatsAppClick(p);
      return json({ ok: true });
    }

    if (p.source === 'brik-chat' || String(p.challenge || '').indexOf('[Brik chat]') === 0) {
      saveChatLead(p);
      return json({ ok: true });
    }

    const role = p.role === 'Other' ? (p.otherRole || 'Other') : (p.role || '');
    const region = p.region === 'Other' ? (p.otherRegion || 'Other') : (p.region || '');
    const row = [
      new Date(),
      clean(p.firstName), clean(p.lastName), clean(p.workEmail), clean(p.whatsapp), clean(p.company),
      clean(role), clean(p.teamSize), clean(region), clean(p.challenge),
      clean(p.page), 'New'
    ];

    SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME).appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: p.workEmail || NOTIFY_EMAIL,
        subject: 'New demo request: ' + (p.company || '') + ' (' + (p.firstName || '') + ' ' + (p.lastName || '') + ')',
        body: [
          'Name: ' + p.firstName + ' ' + p.lastName,
          'Email: ' + p.workEmail,
          'WhatsApp: ' + (p.whatsapp || '-') + (waLink(p.whatsapp) ? '  (chat: ' + waLink(p.whatsapp) + ')' : ''),
          'Company: ' + p.company,
          'Role: ' + role,
          'Team size: ' + (p.teamSize || '-'),
          'Region: ' + (region || '-'),
          'What to improve: ' + (p.challenge || '-'),
          '',
          'All leads: https://docs.google.com/spreadsheets/d/' + SHEET_ID
        ].join('\n')
      });
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Delay cost calculator ----------
function inr(n) {
  n = Math.round(n || 0);
  if (n >= 1e7) return '₹' + String(+(n / 1e7).toFixed(n >= 1e8 ? 1 : 2)) + ' crore';
  if (n >= 1e5) return '₹' + String(+(n / 1e5).toFixed(1)) + ' lakh';
  return '₹' + n.toLocaleString('en-IN');
}
function h(v) { return String(v || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function nnum(v, max) { v = parseFloat(v); return isFinite(v) && v > 0 ? Math.min(v, max) : 0; }

function saveDelayCalc(p) {
  const email = String(p.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
  const cache = CacheService.getScriptCache(), ck = 'dc:' + email.toLowerCase();
  if (cache.get(ck)) return;            // one report per email every 2 minutes
  cache.put(ck, '1', 120);

  // recompute on the server from the inputs (never trust a sent total)
  const i = {
    value: nnum(p.value, 1e5), days: Math.max(1, Math.round(nnum(p.days, 3650))), overhead: nnum(p.overhead, 1e9),
    workers: nnum(p.workers, 1e5), wage: nnum(p.wage, 1e6), equip: nnum(p.equip, 1e9), capital: nnum(p.capital, 1e5),
    rate: nnum(p.rate, 100), revenue: nnum(p.revenue, 1e10), ld: nnum(p.ld, 10)
  };
  const valueRs = i.value * 1e7;
  const parts = [
    ['Site overheads', i.overhead, 'Staff, site office, security, utilities and insurance keep running.'],
    ['Idle labour', i.workers * i.wage, i.workers + ' workers × ' + inr(i.wage) + ' a day.'],
    ['Idle equipment hire', i.equip, 'Hire you keep paying for machines standing idle.'],
    ['Finance cost (interest)', i.capital * 1e7 * i.rate / 100 / 365, inr(i.capital * 1e7) + ' deployed at ' + i.rate + '% a year.'],
    ['Deferred rent / revenue', i.revenue, 'Receipts pushed back by a late handover.'],
    ['Liquidated damages', i.ld ? valueRs * i.ld / 100 / 7 : 0, i.ld + '% of project value per week (uncapped).']
  ].filter(function (x) { return x[1] > 0; }).sort(function (a, b) { return b[1] - a[1]; });
  const perDay = parts.reduce(function (a, x) { return a + x[1]; }, 0);
  const total = perDay * i.days, pct = valueRs ? total / valueRs * 100 : 0;
  const first = String(p.name || '').trim().split(/\s+/)[0] || 'there';

  // sheet
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(CALC_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CALC_SHEET_NAME);
    const hd = ['Timestamp', 'Name', 'Work email', 'Company', 'Project value (₹ cr)', 'Delay days', 'Cost per day (₹)', 'Cost of delay (₹)', '% of project', 'Biggest cost', 'Inputs', 'Page', 'Status'];
    sh.appendRow(hd); sh.getRange(1, 1, 1, hd.length).setFontWeight('bold').setBackground('#F3F0FF'); sh.setFrozenRows(1);
  }
  sh.appendRow([new Date(), clean(p.name), clean(email), clean(p.company), i.value, i.days, Math.round(perDay), Math.round(total),
    Math.round(pct * 10) / 10, parts.length ? parts[0][0] : '', clean(JSON.stringify(i)), clean(p.page), 'New']);

  // report (HTML email + PDF)
  const rows = parts.map(function (x) {
    const share = perDay ? Math.round(x[1] / perDay * 100) : 0;
    return '<tr><td style="padding:10px 12px;border-bottom:1px solid #eee"><b>' + x[0] + '</b><br><span style="color:#6E6E73;font-size:12px">' + h(x[2]) + '</span></td>' +
      '<td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">' + inr(x[1]) + '</td>' +
      '<td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right">' + share + '%</td></tr>';
  }).join('');
  const top = parts[0];
  const report =
    '<div style="font-family:Arial,sans-serif;color:#0B0B0F;max-width:640px;margin:0 auto">' +
    '<div style="background:#0B0B0F;color:#fff;padding:28px;border-radius:16px">' +
    '<div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#B9BCFF;font-weight:bold">Brikito · Delay cost report</div>' +
    '<div style="font-size:15px;margin-top:10px;color:#ddd">' + h(p.company || 'Your project') + ' · project value ' + inr(valueRs) + '</div>' +
    '<div style="font-size:38px;font-weight:bold;margin-top:12px">' + inr(perDay) + ' <span style="font-size:16px;color:#bbb">per day of delay</span></div>' +
    '<div style="font-size:15px;margin-top:8px;color:#ddd">A <b style="color:#fff">' + i.days + '-day</b> delay costs about <b style="color:#fff">' + inr(total) + '</b>' + (valueRs ? ', or <b style="color:#fff">' + pct.toFixed(1) + '%</b> of project value.' : '.') + '</div></div>' +
    '<h3 style="margin:26px 0 8px">Where the money goes, every day</h3>' +
    '<table style="width:100%;border-collapse:collapse;font-size:14px"><tr style="background:#F5F5F7"><th style="text-align:left;padding:10px 12px">Cost</th><th style="text-align:right;padding:10px 12px">Per day</th><th style="text-align:right;padding:10px 12px">Share</th></tr>' + rows +
    '<tr><td style="padding:10px 12px"><b>Total</b></td><td style="padding:10px 12px;text-align:right"><b>' + inr(perDay) + '</b></td><td style="padding:10px 12px;text-align:right"><b>100%</b></td></tr></table>' +
    (top ? '<h3 style="margin:26px 0 8px">Your biggest leak: ' + top[0].toLowerCase() + '</h3><p style="font-size:14px;line-height:1.6">It is ' + Math.round(top[1] / perDay * 100) + '% of your daily delay cost. Catching slippage one week earlier saves about <b>' + inr(perDay * 7) + '</b>; two weeks, about <b>' + inr(perDay * 14) + '</b>.</p>' : '') +
    '<h3 style="margin:26px 0 8px">Three ways to cut it</h3><ol style="font-size:14px;line-height:1.6;padding-left:18px">' +
    '<li><b>See slippage on day one.</b> Compare planned vs actual daily, not at the monthly review.</li>' +
    '<li><b>Turn every hindrance into an action.</b> Each blocker gets an owner and a target date.</li>' +
    '<li><b>Plan tomorrow\'s inputs today.</b> Move crews and machines before they stand idle.</li></ol>' +
    '<div style="margin-top:22px;padding:18px;border-radius:14px;background:#F3F0FF"><b>Brikito tracks delay and lag automatically</b> from your site\'s daily chat and voice updates: slippage, PPC, hindrances with owners and a forecast finish date.<br><br>' +
    '<a href="https://www.brikito.com/book-a-demo?utm_source=delay-calculator&utm_medium=email" style="display:inline-block;background:#0B0B0F;color:#fff;text-decoration:none;font-weight:bold;padding:11px 18px;border-radius:99px">Book a free demo →</a></div>' +
    '<p style="font-size:11px;color:#8E8E93;margin-top:22px">Estimate based on the figures you entered at brikito.com/delay-cost-calculator. It excludes material price escalation, extended supervision fees and claims. Inputs: overheads ' + inr(i.overhead) + '/day, ' + i.workers + ' idle workers at ' + inr(i.wage) + ', equipment ' + inr(i.equip) + '/day, ' + inr(i.capital * 1e7) + ' at ' + i.rate + '%, deferred revenue ' + inr(i.revenue) + '/day, LD ' + (i.ld ? i.ld + '%/week' : 'none') + '.</p></div>';

  const pdf = Utilities.newBlob('<html><body style="margin:24px">' + report + '</body></html>', MimeType.HTML, 'report.html')
    .getAs(MimeType.PDF).setName('Brikito-Delay-Cost-Report.pdf');
  MailApp.sendEmail({
    to: email, replyTo: NOTIFY_EMAIL, name: 'Brikito',
    subject: 'Your delay cost report: ' + inr(perDay) + ' per day',
    htmlBody: '<p style="font-family:Arial,sans-serif;font-size:15px">Hi ' + h(first) + ',</p><p style="font-family:Arial,sans-serif;font-size:15px">Here is the delay cost report for your project. The PDF is attached so you can share it with your team.</p>' + report +
      '<p style="font-family:Arial,sans-serif;font-size:14px;color:#55555C">Questions? Just reply to this email.<br>Team Brikito</p>',
    attachments: [pdf]
  });

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL, replyTo: email,
      subject: 'New delay calculator lead: ' + (p.company || p.name || email) + ' (' + inr(perDay) + '/day)',
      body: ['New lead from the Delay Cost Calculator on brikito.com', '',
        'Name: ' + (p.name || '-'), 'Email: ' + email, 'Company: ' + (p.company || '-'), '',
        'Project value: ' + inr(valueRs), 'Cost per day of delay: ' + inr(perDay),
        i.days + '-day delay: ' + inr(total) + (valueRs ? ' (' + pct.toFixed(1) + '% of project)' : ''),
        'Biggest cost: ' + (top ? top[0] : '-'), '',
        'They were emailed the PDF report. Reply to this email to write to them.', '',
        'All calculator leads: https://docs.google.com/spreadsheets/d/' + SHEET_ID + ' (tab "' + CALC_SHEET_NAME + '")'].join('\n'),
      attachments: [pdf]
    });
  }
}

// "Talk on WhatsApp" taps: own tab (created on first use) + "New WhatsApp enquiry" email.
// The site only knows the tap; the visitor's actual messages arrive in WhatsApp itself.
function saveWhatsAppClick(p) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(WA_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(WA_SHEET_NAME);
    const h = ['Timestamp', 'Plan', 'Message ready to send', 'Page', 'Came from', 'UTM (source / medium / campaign)', 'Device', 'Status'];
    sh.appendRow(h);
    sh.getRange(1, 1, 1, h.length).setFontWeight('bold').setBackground('#E7F8EE');
    sh.setFrozenRows(1);
    sh.setColumnWidth(3, 380);
  }
  sh.appendRow([new Date(), clean(p.plan), clean(p.message), clean(p.page), clean(p.referrer), clean(p.utm), clean(p.device), 'New']);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New WhatsApp enquiry on brikito.com' + (p.plan ? ': ' + p.plan + ' plan' : ''),
      body: [
        'Someone tapped "Talk on WhatsApp" on brikito.com and was taken to WhatsApp to chat with +91 79048 89929.',
        '',
        'Plan: ' + (p.plan || '-'),
        'Message ready for them to send:',
        '"' + (p.message || '-') + '"',
        '',
        'Page: ' + (p.page || '-'),
        'Came from: ' + (p.referrer || 'direct / unknown'),
        'UTM: ' + (p.utm || '-'),
        'Device: ' + (p.device || '-'),
        '',
        'Open WhatsApp on +91 79048 89929 to see their message and reply. (If no message arrives, they opened WhatsApp but did not press Send.)',
        '',
        'All WhatsApp enquiries: https://docs.google.com/spreadsheets/d/' + SHEET_ID + ' (tab "' + WA_SHEET_NAME + '")'
      ].join('\n')
    });
  }
}

// Brik chat leads: own tab (created on first use) + "New enquiry" email
function saveChatLead(p) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(CHAT_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CHAT_SHEET_NAME);
    sh.appendRow(CHAT_HEADERS);
    sh.getRange(1, 1, 1, CHAT_HEADERS.length).setFontWeight('bold').setBackground('#EEF0FF');
    sh.setFrozenRows(1);
    sh.setColumnWidth(11, 420);
  }
  const name = [p.firstName, p.lastName].filter(String).join(' ');
  const convo = p.conversation || p.challenge || '';
  sh.appendRow([
    new Date(), clean(name), clean(p.workEmail), clean(p.phone), clean(p.company), clean(p.role),
    clean(p.projects || p.teamSize), clean(p.region), clean(p.request), clean(p.plan),
    clean(convo), clean(p.page), 'New'
  ]);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: p.workEmail || NOTIFY_EMAIL,
      subject: 'New enquiry on Brik chat bot website: ' + (p.company || '') + ' (' + (name || 'visitor') + ')',
      body: [
        'New enquiry on Brik chat bot website',
        '',
        'Request: ' + (p.request || '-'),
        'Name: ' + (name || '-'),
        'Email: ' + (p.workEmail || '-'),
        'Phone / WhatsApp: ' + (p.phone || '-'),
        'Company: ' + (p.company || '-'),
        'Role: ' + (p.role || '-'),
        'Active projects: ' + (p.projects || p.teamSize || '-'),
        'Region: ' + (p.region || '-'),
        'Suggested plan: ' + (p.plan || '-'),
        'Page: ' + (p.page || '-'),
        '',
        'Conversation:',
        String(convo).slice(0, 3500),
        '',
        'All chat leads: https://docs.google.com/spreadsheets/d/' + SHEET_ID + ' (tab "' + CHAT_SHEET_NAME + '")'
      ].join('\n')
    });
  }
}

// wa.me link so the team can open the chat in one tap
function waLink(n) {
  const d = String(n || '').replace(/[^0-9]/g, '');
  return d.length >= 8 ? 'https://wa.me/' + d : '';
}

// Stops spreadsheet formulas being injected through the form
function clean(v) {
  v = String(v || '').trim().slice(0, 5000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
