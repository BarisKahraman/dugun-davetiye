# Nuray & Barış Düğün Davetiyesi

Nuray Göncü ve Barış Kahraman için tek sayfalı, mobil öncelikli ve Türkçe dijital düğün davetiyesi. Frontend React + TypeScript + Vite ile, production backend Firebase Hosting + Cloud Functions + Google Sheets ile çalışır. Varsayılan geliştirme modu mock moddur; Firebase veya Google Sheets kurulmadan RSVP formu localStorage üzerinden denenebilir.

## 1. Projeyi yerelde çalıştırma

Önce Node.js 20+ kurulu olmalı.

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` üzerinde açılır. Bu makinede Node/NPM PATH üzerinde yoksa önce Node.js 20 LTS kurup terminali yeniden açın.

## 2. Mock modunu kullanma

`.env` dosyası oluşturup şu değeri bırakın:

```env
VITE_DATA_MODE=mock
```

Bu modda RSVP kayıtları ve yönetim ekranı verileri tarayıcı localStorage içinde tutulur. `/yonetim` rotası giriş istemeden mock verileri gösterir.

## 3. Firebase projesi oluşturma

Firebase Console’da yeni proje oluşturun, Hosting ve Functions özelliklerini etkinleştirin. Web app ekleyip çıkan config değerlerini `.env` içine `VITE_FIREBASE_*` alanlarına yazın.

## 4. Firebase Hosting kurulumu

```bash
npm install -g firebase-tools
firebase login
firebase use your-firebase-project-id
npm run build
firebase deploy --only hosting
```

`firebase.json`, `/api/**` isteklerini `europe-west1` bölgesindeki `api` Cloud Function’a yönlendirir.

## 5. Cloud Functions dağıtımı

```bash
npm --prefix functions install
npm run functions:build
firebase deploy --only functions
```

Functions runtime Node.js 20 olarak ayarlanmıştır.

## 6. Google Sheets oluşturma

Bir Google Sheet oluşturup şu sekmeleri açın:

`Settings`: `key`, `value`, `type`, `isPublic`, `updatedAt`

`Schedule`: `id`, `order`, `title`, `time`, `description`, `enabled`

`RSVP`: `createdAt`, `fullName`, `phone`, `attendance`, `guestCount`, `accommodationNeed`, `message`, `songTitle`, `songArtist`, `consent`, `source`

`Guestbook`: `createdAt`, `fullName`, `note`, `songTitle`, `songArtist`, `approved`, `displayedName`

`Analytics`: `date`, `pageViews`, `rsvpStarted`, `rsvpCompleted`

Kullanıcı girdileri Functions içinde `=`, `+`, `-`, `@` ile başlıyorsa Google Sheets formül enjeksiyonuna karşı escape edilir.

## 7. Google Sheet’i servis hesabıyla paylaşma

Firebase Functions’ın kullandığı servis hesabına Sheet üzerinde düzenleme yetkisi verin. Sheet ID değerini `GOOGLE_SHEET_ID` olarak ekleyin.

## 8. Firebase Authentication admin kurulumu

Authentication bölümünde Google provider’ı etkinleştirin. Yönetici e-postalarını virgülle ayırarak `ADMIN_EMAILS` içine yazın. `/yonetim` production modda Firebase ID token doğrular ve yalnızca bu listeye izin verir.

## 9. Environment variables ve secrets

Örnek alanlar `.env.example` içinde var. Frontend bundle içine yalnızca public Firebase web app config ve `VITE_*` değerleri girer. Sheet ID, admin e-postaları, IBAN ve provider tokenları backend ortam değişkeni veya Firebase Secret olarak tutulmalıdır.

```bash
firebase functions:secrets:set WHATSAPP_ACCESS_TOKEN
firebase functions:config:set wedding.google_sheet_id="..."
```

Projede `process.env` okunur; dağıtım stratejinize göre Firebase env/secrets değerlerini aynı isimlerle sağlayın.

## 10. Özel alan adı bağlama

Firebase Hosting > Custom domains bölümünden `nuraybarisevleniyooooooor.com` alan adını ekleyin. Alan adındaki `o` harfleri projede verilen şekilde korunur.

## 11. Program saatlerini değiştirme

Google Sheets `Schedule` sekmesindeki `time` alanlarını doldurun veya `/yonetim` ekranındaki Program Saatleri bölümünü kullanın. Saat boşsa ziyaretçiye boş saat veya `--:--` gösterilmez.

## 12. Telefon, WhatsApp ve IBAN ekleme

`Settings` sekmesine veya yönetim ekranına şu anahtarları ekleyin:

```text
contact.phone
contact.whatsapp
gift.iban
gift.accountName
```

IBAN ve hesap sahibi yoksa Hediye Notu linki ziyaretçiye görünmez.

## 13. Fotoğrafları optimize etme

Nişan fotoğraflarını `public/images/couple/` altına WebP/AVIF türevleriyle ekleyin. Orijinal kadrajı koruyun, alt metinleri merkezi yapılandırma veya ilgili bileşen içinde yazın. Büyük görselleri lazy loading ile kullanın.

## 14. Careless Whisper için lisanslı ses dosyası veya Spotify bağlantısı ekleme

Telifli dosya projeye izinsiz gömülmez. Lisanslı yerel dosya varsa `public/audio/` altına koyup `music.localAudioUrl` ayarlayın. Spotify bağlantısı varsa `music.spotifyUrl` kullanın. Ses otomatik başlamaz; kullanıcı kontrolü gerekir.

## 15. Fotoğraf galerisi ve QR bağlantısı ekleme

Düğün günü fotoğraf yükleme linki için `gallery.uploadUrl`, düğün sonrası herkese açık galeri için `gallery.publicGalleryUrl` ayarlayın. Boşsa ziyaretçiye boş galeri alanı gösterilmez.

## 16. Düğün günü ve düğün sonrası modlarını test etme

`src/utils/date.test.ts` geri sayım ve mod geçişlerini kapsar:

```bash
npm run test
```

Uygulama tarihi `Europe/Istanbul` takvim gününe göre yorumlar. 16 Ağustos 2026 günü hero mesajı “Bugün evleniyoruz” olur; sonraki gün RSVP kapanır.

## 17. Sosyal paylaşım kartını üretme

Gerçek PNG çıktısı `public/og-card.png` içinde hazırdır. Yeniden üretmek için:

```bash
npm run generate:og
```

Script aynı zamanda `public/og-card.svg` dosyasını da üretir.

## 18. Yazdırılabilir PDF görünümünü kullanma

Sitedeki “PDF Davetiyeyi Kaydet” veya “Yazdırılabilir Davetiye” butonu tarayıcı yazdırma penceresini açar. `@media print` stilleri gereksiz web kontrollerini gizler ve A4’e uygun sade görünüm üretir.

## 19. Günlük özet ve WhatsApp bildirimlerini etkinleştirme

WhatsApp bildirimi için `WHATSAPP_WEBHOOK_URL` ve `WHATSAPP_ACCESS_TOKEN` sağlayın. Bilgiler yoksa RSVP başarıyla kaydedilir, bildirim sessizce atlanır. `dailySummary` zamanlanmış fonksiyonu `Europe/Istanbul` saat diliminde 18:00’de çalışacak şekilde hazırdır; Firebase Scheduler/Blaze plan gereksinimini kontrol edin.

## 20. Verileri düğün sonrasında manuel silme

RSVP, Guestbook ve Analytics verileri Google Sheets üzerinde manuel silinebilir. Site herkese açık kalır; kişisel RSVP kayıtları frontend veya public API üzerinden yayımlanmaz.

## Dosya yapısı

```text
public/                 Statik varlıklar, favicon, manifest, robots, sitemap, OG kart
src/components/         Erişilebilir ortak UI bileşenleri
src/sections/           Tek sayfalı davetiye bölümleri
src/admin/              /yonetim ekranı
src/services/           Mock ve production veri adaptörleri
src/config/             Tip güvenli merkezi düğün yapılandırması
src/utils/              Tarih, harita, takvim ve CSV yardımcıları
functions/src/          Firebase Functions API, Sheets, auth, bildirim, analytics
scripts/                Sosyal kart üretim scripti
```

## Yayına alma kontrol listesi

- `VITE_DATA_MODE=production` ayarlandı.
- Firebase web app config değerleri `.env` içinde.
- `GOOGLE_SHEET_ID` ve `ADMIN_EMAILS` backend ortamında tanımlı.
- Google Sheet sekmeleri ve başlıkları birebir oluşturuldu.
- Sheet servis hesabıyla paylaşıldı.
- Özel alan adı Firebase Hosting’e bağlandı.
- `npm run build`, `npm run test`, `npm run functions:build` geçti.
- `public/og-card.png`, `robots.txt`, `sitemap.xml` ve canonical URL kontrol edildi.
