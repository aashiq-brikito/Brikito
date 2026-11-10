// Copy of the Google Apps Script (project "Untitled project", web app "Untitled" deployment) that
// receives website leads. The live copy is edited at script.google.com; keep this in sync.
/**
 * Brikito website leads → Google Sheet + email
 * 1. Book a demo form (brikito.com/book-a-demo) → "Leads" tab, email "New demo request".
 * 2. Brik chat assistant (on every page)        → "Website Chat Bot" tab, email "New enquiry on Brik chat bot website".
 */
const SHEET_ID = '1bf6VNAK8MmIxPaBNhCkgaKU00nR-vhVIdVgyEv77m7s';
const SHEET_NAME = 'Leads';
const CHAT_SHEET_NAME = 'Website Chat Bot';
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

    if (p.source === 'brik-chat' || String(p.challenge || '').indexOf('[Brik chat]') === 0) {
      saveChatLead(p);
      return json({ ok: true });
    }

    const role = p.role === 'Other' ? (p.otherRole || 'Other') : (p.role || '');
    const region = p.region === 'Other' ? (p.otherRegion || 'Other') : (p.region || '');
    const row = [
      new Date(),
      clean(p.firstName), clean(p.lastName), clean(p.workEmail), clean(p.company),
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

// Stops spreadsheet formulas being injected through the form
function clean(v) {
  v = String(v || '').trim().slice(0, 5000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
