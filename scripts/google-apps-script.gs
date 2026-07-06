// ============================================================
// Düğün Davetiye – Google Apps Script Web App
// Bu kodu Google Sheets'e bağlı Apps Script editörüne yapıştırın.
// ============================================================
//
// Neden GET? Browser fetch(no-cors) ile Apps Script'e POST atıldığında
// 302 redirect sonrası browser body'yi düşürür, doPost çalışmaz.
// GET + URL params güvenilir çalışır: doGet(e) → e.parameter ile okunur.
// ============================================================

var SHEET_NAME = "RSVPs";

function doGet(e) {
  // Veri içeren istek mi yoksa sadece "canlı mı?" kontrolü mü?
  if (e && e.parameter && e.parameter.fullName) {
    return handleRequest(e.parameter);
  }
  return jsonOut({ ok: true, status: "RSVP endpoint aktif" });
}

// doPost fallback — doğrudan çağrılırsa da çalışsın
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    return handleRequest(data);
  } catch (err) {
    return jsonOut({ ok: false, message: "Veri okunamadı." });
  }
}

function handleRequest(data) {
  try {
    if (data.honey) {
      return jsonOut({ ok: false, message: "Gönderim doğrulanamadı." });
    }

    var sheet = getOrCreateSheet();
    var now = new Date().toISOString();

    sheet.appendRow([
      now,
      data.fullName        || "",
      data.phone           || "",
      data.attendance      || "",
      data.guestCount != null && data.guestCount !== "" ? Number(data.guestCount) : "",
      data.accommodationNeed || "",
      data.message         || "",
      data.songTitle       || "",
      data.songArtist      || ""
    ]);

    var message = data.attendance === "attending"
      ? "Harika, notunuz bize ulaştı. 16 Ağustos'ta görüşmek üzere."
      : "Bize haber verdiğiniz için teşekkür ederiz. O gün sizi yanımızda hissedeceğiz.";

    return jsonOut({ ok: true, id: Utilities.getUuid(), message: message });

  } catch (err) {
    Logger.log("RSVP hatası: " + err.toString());
    return jsonOut({ ok: false, message: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Tarih", "Ad Soyad", "Telefon", "Katılım",
      "Kişi Sayısı", "Konaklama", "Mesaj", "Şarkı", "Sanatçı"
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
  }

  return sheet;
}

function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
