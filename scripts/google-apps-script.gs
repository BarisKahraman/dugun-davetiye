// ============================================================
// Düğün Davetiye – Google Apps Script Web App
// Bu kodu Google Sheets'e bağlı Apps Script editörüne yapıştırın.
// Kurulum adımları için aşağıdaki README bölümüne bakın.
// ============================================================

var SHEET_NAME = "RSVPs";
var ALLOWED_ORIGIN = "https://nuraybarisevleniyooooooor.com"; // kendi domain'inizle değiştirin

// GET isteği — deploy edildiğini test etmek için tarayıcıdan açabilirsiniz
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, status: "RSVP endpoint aktif" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Bot koruması: honeypot dolu ise reddet
    if (data.honey) {
      return jsonOk({ ok: false, message: "Gönderim doğrulanamadı." });
    }

    var sheet = getOrCreateSheet();
    var now = new Date().toISOString();

    sheet.appendRow([
      now,                                       // A - Tarih
      data.fullName   || "",                     // B - Ad soyad
      data.phone      || "",                     // C - Telefon
      data.attendance || "",                     // D - Katılım
      data.guestCount != null ? data.guestCount : "", // E - Kişi sayısı
      data.accommodationNeed || "",              // F - Konaklama
      data.message    || "",                     // G - Mesaj
      data.songTitle  || "",                     // H - Şarkı adı
      data.songArtist || ""                      // I - Sanatçı
    ]);

    var message = data.attendance === "attending"
      ? "Harika, notunuz bize ulaştı. 16 Ağustos'ta görüşmek üzere."
      : "Bize haber verdiğiniz için teşekkür ederiz. O gün sizi yanımızda hissedeceğiz.";

    return jsonOk({ ok: true, id: Utilities.getUuid(), message: message });

  } catch (err) {
    Logger.log("RSVP hatası: " + err.toString());
    return jsonOk({ ok: false, message: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Başlık satırı
    sheet.appendRow([
      "Tarih", "Ad Soyad", "Telefon", "Katılım",
      "Kişi Sayısı", "Konaklama", "Mesaj", "Şarkı", "Sanatçı"
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
  }

  return sheet;
}

function jsonOk(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
