/**
 * Beyond the Leash - booking diary backend (Google Apps Script)
 * --------------------------------------------------------------
 * Keeps bookings in a Google Sheet so a time slot that has been requested
 * cannot be requested again by someone else. The website calls this script.
 *
 * SET-UP (about 10 minutes, once):
 *  1. Create a new Google Sheet. Name the first tab "Bookings".
 *  2. In the sheet, choose Extensions > Apps Script. Delete the sample code
 *     and paste this whole file. Save.
 *  3. Click Deploy > New deployment. Type: Web app.
 *     Execute as: Me. Who has access: Anyone. Click Deploy and allow access.
 *  4. Copy the Web app URL (ends with /exec) into js/data.js as
 *     business.bookingApi. Done.
 *
 * The sheet gets these columns on first use:
 *   Date | Slot | Dog | Owner | Phone | Service | Status | Created
 * Status is "Requested" when the website adds a row. Change it to
 * "Confirmed" once you have agreed the booking on WhatsApp, or to
 * "Cancelled" to free the slot again. You can also type bookings in by hand
 * (for example phone bookings) and they will block that slot on the website.
 */

var SHEET_NAME = 'Bookings';
var HEADERS = ['Date', 'Slot', 'Dog', 'Owner', 'Phone', 'Service', 'Status', 'Created'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function dateKey_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v || '').trim().slice(0, 10);
}

/** All taken slots between two dates, as "YYYY-MM-DD|Slot" strings. */
function takenBetween_(from, to) {
  var rows = sheet_().getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var d = dateKey_(rows[i][0]), slot = String(rows[i][1] || '').trim(), status = String(rows[i][6] || 'Requested').trim().toLowerCase();
    if (!d || !slot || status === 'cancelled') continue;
    if (from && d < from) continue;
    if (to && d > to) continue;
    out.push(d + '|' + slot);
  }
  return out;
}

/** GET ?action=taken&from=YYYY-MM-DD&to=YYYY-MM-DD */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'taken') return json_({ ok: true, taken: takenBetween_(p.from, p.to) });
  return json_({ ok: true, service: 'Beyond the Leash bookings' });
}

/** POST body (text/plain, JSON): { action:'reserve', date, slot, dog, owner, phone, service } */
function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, reason: 'bad-request' }); }
  if (body.action !== 'reserve') return json_({ ok: false, reason: 'unknown-action' });
  var date = dateKey_(body.date), slot = String(body.slot || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !slot) return json_({ ok: false, reason: 'bad-request' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);                       // one reservation at a time
  try {
    if (slot !== 'Any time' && takenBetween_(date, date).indexOf(date + '|' + slot) >= 0) {
      return json_({ ok: false, reason: 'taken' });
    }
    sheet_().appendRow([date, slot, String(body.dog || ''), String(body.owner || ''), String(body.phone || ''), String(body.service || ''), 'Requested', new Date()]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
