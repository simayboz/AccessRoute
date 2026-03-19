# AccessRoute - Tasks

`prd.md` baz alinarak uygulamayi adim adim gelistirmek icin gorev listesi.

## 1. Proje Kurulumu
- [ ] Proje klasor yapisini olustur (`src`, `components`, `services`, `assets`).
- [ ] HTML5 + Tailwind CSS + ES6 temel iskeletini kur.
- [ ] Ortam degiskenlerini tanimla (`GEMINI_API_KEY`, veritabani anahtarlari).
- [ ] Mobil tarayici/sensor uyumlulugunu netlestir.

## 2. Temel Kullanici Akisi
- [ ] Profil secimi ekranini gelistir (Bedensel / Gorme).
- [ ] Akisi kur: Profil -> Olcum/Analiz -> Sonuc -> Harita.
- [ ] Yukleniyor, hata ve izin reddi gibi durum ekranlarini ekle.
- [ ] Erişilebilir UI ilkelerini uygula (kontrast, buyuk dokunma alanlari, sade dil).

## 3. Sensor Tabanli Rampa Analizi
- [ ] Device Orientation API ile jiroskop ve ivmeolcer verisi topla.
- [ ] Eğim hesaplama algoritmasini uygula.
- [ ] Guvenli esik degerini profil bazli belirle (ornek: %8).
- [ ] Esik asiminda sesli + gorsel risk uyarisi ver.
- [ ] Eğim olcumlerinde ±1 derece dogruluk hedefini test et.

## 4. Gemini Vision Engel Analizi
- [ ] Kamera/fotograf yukleme ozelligini ekle.
- [ ] Gemini 1.5 Flash API entegrasyonunu tamamla.
- [ ] Prompt yapisini standardize et (engel turu, gecis durumu, risk).
- [ ] Ciktiyi normalize et (`tur`, `durum`, `risk`, `aciklama`).
- [ ] API hata durumlarini yonet (timeout, gecersiz gorsel, baglanti).

## 5. Sesli Etkilesim (Voice-First)
- [ ] TTS ile analiz sonuclarini sesli betimleme olarak oynat.
- [ ] STT ile kullanicinin sesli engel raporu girmesini sagla.
- [ ] Sesli girdiyi yapilandirilmis rapora donustur.
- [ ] Gorme engelli kullanicilar icin minimum dokunusla akis tasarla.

## 6. Canli Harita ve Topluluk Veri Paylasimi
- [ ] Firebase veya Supabase secimini yap.
- [ ] Engel veri modelini tanimla (`id`, `lat`, `lng`, `tur`, `risk`, `timestamp`).
- [ ] Onayli engelleri veritabanina kaydet.
- [ ] Gercek zamanli veri dinleme ile haritayi anlik guncelle.
- [ ] Risk seviyesine gore harita ikon/renk standartlarini belirle.
- [ ] Verinin 5 saniye icinde tum kullanicilara yayildigini dogrula.

## 7. Birlesik Karar Mekanizmasi
- [ ] Sensor ve Gemini sonucunu birlestiren karar motorunu yaz.
- [ ] "Guvenli / Riskli / Gecilemez" siniflandirmasini netlestir.
- [ ] Celiskili veriler icin fallback kurallari ekle.

## 8. Guvenlik ve Gizlilik
- [ ] Kamera, mikrofon, konum, hareket izin akislarini netlestir.
- [ ] Gereksiz veri saklamamayi garanti eden veri minimizasyonunu uygula.
- [ ] Kullanici bilgilendirme ve acik onam metinlerini ekle.
- [ ] API anahtari guvenligi icin uygun mimariyi uygula.

## 9. Test ve Basari Kriterleri
- [ ] Birim testler: egim hesaplama, risk siniflandirma, veri donusumu.
- [ ] Entegrasyon testleri: sensor -> AI -> DB -> harita akisi.
- [ ] Erişilebilirlik testleri: ekran okuyucu, kontrast, klavye kullanimi.
- [ ] KPI dogrulamalari:
  - [ ] Eğim olcum hatasi ±1 derece.
  - [ ] Engel tanima/risk dogrulugu %90+.
  - [ ] Harita yayilim suresi <= 5 saniye.

## 10. Yayin ve Sonrasi
- [ ] GitHub Pages uzerinden yayin altyapisini hazirla.
- [ ] Staging ve uretim cikis kontrol listesi olustur.
- [ ] Pilot kullanici testi yap ve geri bildirim topla.
- [ ] Post-MVP iyilestirmeleri planla (rota optimizasyonu, guven skoru, offline mod).
