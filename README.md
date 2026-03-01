# MedTracker

MedTracker, React Native ile gelistirilmis mobil saglik takip uygulamasidir.
Uygulama Android (emulator/cihaz) hedefiyle hazirlanmistir.

## Teknoloji Yigini
- React Native (`0.84.0`)
- TypeScript
- React Navigation (Native Stack)
- AsyncStorage (yerel kalicilik)
- Notifee (Android yerel bildirimleri)
- Jest (unit + integration test)

## Uygulama Ozeti
- Login -> Home akisi vardir.
- Home ekranindaki tum kutucuklar gercek ekrana gider.
- Veriler yerelde saklanir ve uygulama yeniden acildiginda korunur.
- Moduller ortak `DataContext` store uzerinden yonetilir.

## Ozellikler (Detayli)

### 1) Kimlik dogrulama ve navigasyon
- Login basarili ise Home acilir.
- Stack bazli ekran gecisleri.

### 2) Ortak veri katmani (global store)
`DataContext` icinde:
- reminders
- notes
- exercise
- medications
- symptoms
- trainings
- topics + comments
- suggestions
- ratings

### 3) Yerel kalicilik
- AsyncStorage ile acilista yukleme.
- Degisikliklerde otomatik kaydetme.
- Ayarlar (tema/font/accent/hedefler/bildirim ayarlari) kalicidir.

### 4) Reminders (CRUD)
- Ekle, duzenle, sil, listele.
- Bos durumlar ve form dogrulama.
- Silme islemlerinde onay penceresi.

### 5) Notes (CRUD)
- Ekle, detay gor, duzenle, sil.
- Baslik ve icerik icin inline validation.
- Silme islemlerinde onay penceresi.

### 6) Nutrition & Exercise
- Kayit ekleme: sebze/meyve gram, dakika, egzersiz tipleri, "felt bad".
- Kayit listeleme, duzenleme, silme.

### 7) Trainings
- Seed verili egitim listesi.
- Detay icerik goruntuleme.

### 8) Info Sharing
- Konu listesi (like + yorum sayisi).
- Konu detayinda like ve yorum ekleme.

### 9) Suggestions
- Like/dislike tepkileri.
- Anlik UI guncelleme + kalicilik.

### 10) Ratings
- 1-5 puan kaydetme.
- Listeleme ve ortalama gosterimi.

### 11) Profile ve ayarlar
- Dark mode, font scale, accent color.
- Tum verileri sil.
- Modula ozel veri sifirlama:
  - reminders
  - notes
  - exercise
  - medications
  - symptoms
  - ratings

### 12) Medication Tracker
- Ilac ekle/duzenle/sil.
- Slot bazli takvim:
  - Morning
  - Noon
  - Evening
  - Night
- Slot bazli alindi/alınmadi isaretleme.
- Arama ve filtre:
  - All
  - Due Now
  - Completed Now

### 13) Android yerel bildirimler
- Slot saatlerine gore gunluk tekrar eden bildirim.
- Bildirim aksiyonlari:
  - Taken
  - Snooze 10m
- Bildirime basinca Medications ekranina yonlenir.
- Sessiz saatler (quiet hours) destegi.
- Ilac/slot/saat ayari degisince bildirimler otomatik yeniden planlanir.

### 14) Uyum ve kacirilan doz icgoruleri
- Bugun kacirilan slot sayisi.
- Son 7 gun kacirilan slot sayisi.
- En cok kacirilan ilac.
- En iyi uyum serisi (streak).

### 15) Symptom Trends
- Gunluk semptom girisi:
  - pain
  - fatigue
  - sleep hours
  - mood
  - note
- Silme/listeleme.
- Tarih araligi ve mood filtreleri.
- Gecersiz tarih araligi engellenir.
- Tarih girisi maskesi: `YYYY-MM-DD`.

### 16) Symptom-Medication correlation
- Ilac uyumu yuksek/dusuk gunlerle semptom karsilastirma.
- Sonuc karti:
  - better
  - worse
  - mixed
  - insufficient data
- Confidence yuzdesi gosterilir.

### 17) Analytics polish
- Home mini dashboard:
  - due-now meds
  - adherence today
  - weekly symptom summary
- Trend mini grafikleri (sparkline tarzinda barlar).

### 18) Health goals + badges
- Gunluk hedefler:
  - sleep target
  - exercise target
  - max pain
  - max fatigue
- Progress ring benzeri ilerleme gostergeleri.
- Gunluk badge sistemi.

### 19) Data quality ve guvenlik
- Schema versioning + migration destegi.
- Backup export (JSON).
- Backup import (JSON) + format kontrolu.

### 20) UX feedback
- Basarili/kritik islemlerde toast/alert geri bildirimi.
- Silme islemlerinde confirm dialog.
- Uygulama yuklenirken loading placeholder.

## Proje Yapisi (Ozet)
- `src/navigation`: ekran yonlendirmeleri
- `src/state`: context/store, selector, reducer
- `src/screens`: tum ekranlar
- `src/components/ui`: ortak UI bilesenleri
- `src/services`: bildirim servisleri
- `src/utils`: mask/feedback yardimcilari
- `__tests__`: unit ve integration testler

## Yerelde nasil calistiracagim? Gerekli kurulum ayrintilari (varsa)

### On kosullar
- Node.js (`>= 22.11.0`)
- npm
- Android Studio + Android SDK + emulator

### Kurulum
```bash
npm install
```

### Metro
```bash
npm start
```

### Android calistirma
```bash
npm run android
```

### Not
- Notifee native oldugu icin ilk derleme daha uzun surebilir.
- Gerekirse temiz build:
```bash
cd android
gradlew.bat clean
cd ..
npm run android
```

## Demo / Teslim Bolumu

### Youtube listedisi uygulama calisiyorken cekilmis kisa video
Video linki:
[YouTube Demo](https://youtube.com/shorts/QDn9_WNS2OM?feature=share)

## Gelistirme komutlari
```bash
npm run lint
npx tsc --noEmit
npm test -- --watch=false
```
## Test kapsamı
- Unit test:
  - adherence
  - missed-dose insight
  - correlation/insufficient-data durumlari
- Integration test:
  - add med -> notification plan -> mark taken

## Uygulama adi
- MedTracker
