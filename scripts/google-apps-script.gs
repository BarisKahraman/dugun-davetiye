// ============================================================
// Düğün Davetiye – Google Apps Script Web App
// Bu kodu Google Sheets'e bağlı Apps Script editörüne yapıştırın.
// ============================================================
//
// NEDEN DOGET? Browser'dan fetch(no-cors) ile POST atıldığında Apps Script
// bunu farklı bir domain'e 302 redirect eder. Bu sırada browser POST→GET'e
// dönüştürür. Bu yüzden hem doGet hem doPost aynı handleRequest fonksiyonunu
// çağırır; veri GET'te query param, POST'ta postData olarak gelir.
// ============================================================

var SHEET_NAME = "RSVPs";

function doGet(e) {
  // Hem "endpoint aktif mi?" kontrolü hem de form verisi (no-cors redirect sonrası)
  if (e && e.parameter && e.parameter.fullName) {
    return handleRequest(e.parameter);
  }
  return jsonOut({ ok: true, status: "RSVP endpoint aktif" });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    return handleRequest(data);
  } catch (err) {
    Logger.log("doPost parse hatası: " + err.toString());
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
      data.guestCount != null ? data.guestCount : "",
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
