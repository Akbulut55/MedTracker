# MedTracker

MedTracker, React Native ile geliştirilmiş bir mobil sağlık takip uygulamasıdır.  
Uygulama Android (emülatör/cihaz) ve iOS (simülatör/cihaz) hedefleriyle hazırlanmıştır.

## Teknoloji Yığını
- React Native (`0.84.0`)
- TypeScript
- React Navigation (Native Stack)
- AsyncStorage (yerel veri kalıcılığı)
- Notifee (Android yerel bildirimleri)

## Uygulama Özeti
Uygulama giriş sonrası ana menüden modüllere geçiş sağlar. Tüm temel veriler yerel depolamada tutulur ve uygulama yeniden başlatıldığında korunur.

## Özellikler (Detaylı)

### 1) Kimlik Doğrulama ve Navigasyon
- Login ekranı -> başarılı giriş -> Home ekranı akışı.
- Home ekranındaki tüm kutucuklar gerçek bir ekrana yönlenir.
- Stack tabanlı güvenli ekran geçişleri.

### 2) Ortak Veri Katmanı (Global Store)
- `DataContext` ile merkezi veri yönetimi.
- Yönetilen ana koleksiyonlar:
  - `reminders`
  - `notes`
  - `exercise`
  - `medications`
  - `symptoms`
  - `trainings`
  - `topics + comments`
  - `suggestions`
  - `ratings`

### 3) Yerel Kalıcılık (Persistence)
- Uygulama açılışında AsyncStorage’dan veri yükleme.
- Veri değiştikçe otomatik kaydetme.
- Ayarlar (`theme/font/accent/goals`) dahil kalıcılık.

### 4) Hatırlatmalar Modülü (CRUD)
- Hatırlatma listeleme, ekleme, düzenleme, silme.
- Kart görünümü, doğrulama, boş durum mesajları.

### 5) Notlar Modülü (CRUD)
- Not listeleme, ekleme, detay görüntüleme, düzenleme, silme.
- Kısa önizleme + detay sayfası.

### 6) Beslenme & Egzersiz Modülü
- Giriş ekranı:
  - sebze gram
  - meyve gram
  - dakika
  - çoklu egzersiz tipi
  - kötü hissetme durumu
- Kayıtlar ekranı:
  - listeleme
  - düzenleme
  - silme

### 7) Eğitimler Modülü
- Seed verili eğitim listesi.
- Detay ekranında okunabilir içerik.

### 8) Bilgi Paylaşımı Modülü
- Konu listesi (beğeni + yorum sayısı).
- Konu detayında:
  - beğeni artırma
  - yorum ekleme

### 9) Öneriler Modülü
- Öneri listesi.
- Beğen / beğenme tepkileri (anlık UI güncelleme + kalıcı veri).

### 10) Değerlendirme Modülü
- 1-5 arası puan verme.
- Kayıtların listelenmesi ve ortalama gösterimi.

### 11) Profil ve Ayarlar
- Karanlık mod aç/kapat.
- Font ölçeği ayarı.
- Accent renk seçimi.
- Tüm verileri silme.

### 12) İlaç Takibi Modülü (Yeni)
- İlaç ekleme/düzenleme/silme.
- Her ilaç için zaman slotları:
  - Morning
  - Noon
  - Evening
  - Night
- Slot bazlı “alındı/alınmadı” işaretleme.
- “Şu anki slotta alınması gereken ilaçlar” görünümü.
- Arama + filtre:
  - All
  - Due Now
  - Completed Now

### 13) Android Yerel Bildirimler (Yeni)
- İlaç slotlarına göre günlük tekrarlayan yerel bildirim zamanlama.
- Bildirime tıklayınca `Medications` ekranına yönlendirme.
- Android izinleri:
  - `POST_NOTIFICATIONS`
  - `RECEIVE_BOOT_COMPLETED`

### 14) Uyum / Kaçırılan Doz İçgörüleri (Yeni)
- Bugün kaçırılan slot sayısı.
- Son 7 gün kaçırılan slot sayısı.
- “En çok kaçırılan ilaç” kartı.
- “En iyi uyum serisi” (streak) kartı.

### 15) Semptom Trendleri Modülü (Yeni)
- Günlük semptom girişi:
  - ağrı
  - yorgunluk
  - uyku saati
  - ruh hali
  - not
- Trend özeti (son girişler üzerinden).
- Semptom listesi + silme.
- Filtreleme:
  - tarih aralığı (from/to)
  - mood filtresi

### 16) Semptom-İlaç Korelasyonu (Yeni)
- İlaç uyumu yüksek/düşük günlere göre semptom karşılaştırması.
- Sonuç kartı:
  - daha iyi
  - daha kötü
  - karışık
  - yetersiz veri

### 17) Sağlık Hedefleri + Rozetler (Yeni)
- Profilde günlük hedefler:
  - uyku saati hedefi
  - egzersiz dakika hedefi
  - max ağrı hedefi
  - max yorgunluk hedefi
- İlerleme göstergeleri (ring/progress görünümü).
- Günlük başarı rozetleri (badge sistemi).

## Proje Yapısı (Özet)
- `src/navigation`: ekran yönlendirmeleri
- `src/state`: context/store ve kalıcılık
- `src/screens`: tüm modül ekranları
- `src/components/ui`: tekrar kullanılabilir UI bileşenleri
- `src/services`: bildirim servisleri

## Yerelde nasıl çalıştıracağım? Gerekli kurulum ayrıntıları (varsa)

### Ön Koşullar
- Node.js (projedeki sürüm gereksinimi: `>= 22.11.0`)
- npm
- Android Studio + Android SDK + emülatör
- (iOS için) Xcode + CocoaPods (macOS)

### Kurulum
```bash
npm install
```

### Metro başlatma
```bash
npm start
```

### Android çalıştırma
```bash
npm run android
```

Not:
- Notifee eklendiği için ilk derlemede daha uzun sürebilir.
- Gerekirse temiz build:
```bash
cd android
./gradlew clean
cd ..
npm run android
```
(Windows’ta `gradlew.bat clean` kullanılabilir.)

### iOS çalıştırma (macOS)
```bash
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

## Demo / Teslim Bölümü

### Youtube listesi uygulama çalışıyorken çekilmiş kısa (max 1 dk) video
- Video 1: Login -> Home -> modül geçişleri
- Video 2: Reminders/Notes CRUD
- Video 3: Medication slot takibi + bildirim örneği
- Video 4: Symptom Trends + korelasyon kartı + filtreler
- Video 5: Profile goals + badge + persistence

`Buraya YouTube playlist linkini ekleyin:`
- `https://youtube.com/playlist?list=...`

### APK/IPA dosyaları
- Android APK: `Buraya APK paylaşım linki ekleyin`
- iOS IPA: `Buraya IPA/TestFlight linki ekleyin`

Önerilen paylaşım:
- Google Drive / OneDrive / GitHub Releases

## Bilinen Notlar
- Uygulama yerel veri ile çalışır; backend zorunlu değildir.
- Bazı lint uyarıları kod kalitesini etkilemeyen stil uyarılarıdır.

## Geliştirme Komutları
```bash
npm run lint
npx tsc --noEmit
```

## Uygulama Adı
- MedTracker
