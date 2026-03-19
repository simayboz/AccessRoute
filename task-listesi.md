# AccessRoute - Adim Adim Gorev Listesi

Bu liste, `prd.md` belgesindeki gereksinimlere gore MVP'den canliya gecise kadar sirali bir gelistirme plani sunar.

## 0) Proje Kurulumu ve Planlama
- [ ] Proje deposunu olustur ve temel klasor yapisini kur (`src`, `assets`, `services`, `components`).
- [ ] Baslangic frontend yapisini hazirla (HTML5 + Tailwind + ES6 moduler JS).
- [ ] Ortam degiskenlerini tanimla (`GEMINI_API_KEY`, Firebase/Supabase anahtarlari).
- [ ] Hedef cihaz ve tarayici uyumlulugunu belirle (mobil tarayicilar, sensor izinleri).
- [ ] MVP kapsamini netlestir: profil secimi, sensor olcumu, engel analizi, canli harita.

## 1) Kullanici Deneyimi Temeli (User Flow Iskeleti)
- [ ] Acilis ekrani ve profil secim adimini gelistir (Bedensel / Gorme).
- [ ] Temel gezinme akisini kur: Profil -> Olcum/Analiz -> Sonuc -> Harita.
- [ ] Ekran durumlarini tasarla (yukleniyor, basarili, hata, izin reddedildi).
- [ ] Erişilebilirlik odakli UI standartlarini uygula (kontrast, buyuk buton, sade dil).

## 2) Sensor Modulu: Akilli Rampa Denetcisi
- [ ] Device Orientation API ile jiroskop/ivmeolcer verisini oku.
- [ ] Eğim hesaplama fonksiyonunu uygula ve yuzde/derece donusumunu dogrula.
- [ ] Kullanici profiline gore guvenli egim esiklerini tanimla (ornek: %8).
- [ ] Esik asildiginda sesli + gorsel "Riskli" uyarisi uret.
- [ ] Sensor verisi kalibrasyonunu test et ve ±1 derece hedefi icin olcum iyilestir.

## 3) Gemini Vision Entegrasyonu: Engel Analizi
- [ ] Kamera/fotograf yukleme akislarini ekle.
- [ ] Gemini 1.5 Flash API istemcisini yaz (`services/gemini.js` gibi).
- [ ] Prompt formatini standartlastir: nesne turu + gecis durumu + risk aciklamasi.
- [ ] API donusunu normalize et (`tur`, `durum`, `risk_puani`, `aciklama`).
- [ ] Hata yonetimini ekle (API limiti, internet kesintisi, gecersiz gorsel).

## 4) Voice-First Ozellikler (TTS + STT)
- [ ] TTS ile analiz sonucunu sesli betimleme olarak oynat.
- [ ] STT ile "sesli engel raporlama" komutlarini metne cevir.
- [ ] Sesli komutlardan yapilandirilmis rapor cikar (engel tipi, konum notu, siddet).
- [ ] Gorme engelli kullanici icin eller-serbest kullanim akisini tamamla.
- [ ] Sessiz mod / sadece metin modu gibi alternatif geri bildirim secenekleri ekle.

## 5) Canli Erisilebilirlik Haritasi (Crowdsourcing)
- [ ] Firebase veya Supabase secimini yap ve temel veri modelini olustur.
- [ ] Engel kaydi semasi tanimla (`id`, `lat`, `lng`, `tur`, `risk`, `timestamp`, `source`).
- [ ] Onayli analiz sonucunu veritabanina yazma akisini ekle.
- [ ] Gercek zamanli dinleyicilerle yeni engelleri haritada anlik goster.
- [ ] Harita ikonlari ve renklerini risk seviyesine gore standardize et.
- [ ] 5 saniye altinda senkronizasyon KPI'ini olc ve optimize et.

## 6) AI + Sensor Birlesik Karar Katmani
- [ ] Sensor sonucu ile goruntu analizini birlestiren karar mantigini yaz.
- [ ] "Guvenli / Riskli / Gecilemez" siniflandirma kurallarini netlestir.
- [ ] Celiskili durumlar icin fallback kurallari ekle (sensor guvenli, gorsel riskli vb.).
- [ ] Son karari hem gorsel hem sesli geri bildirim kanalina bagla.

## 7) Guvenlik, Gizlilik, ve Izinler
- [ ] Kamera, mikrofon, konum, hareket sensoru izin akislarini netlestir.
- [ ] Veri minimizasyonu uygula (gereksiz gorsel/veri saklamama).
- [ ] Kullaniciya acik onam ve bilgilendirme metinlerini ekle.
- [ ] API anahtari guvenligini sagla (sunucu/proxy yaklasimi degerlendir).

## 8) Test ve Kalite Guvencesi
- [ ] Birim testler: egim hesaplama, risk siniflandirma, veri donusumu.
- [ ] Entegrasyon testleri: sensor -> AI -> DB -> harita uca uca akis.
- [ ] Erişilebilirlik testleri: ekran okuyucu, klavye erisimi, kontrast.
- [ ] Performans testleri: API gecikmesi, harita guncelleme hizi, pil tuketimi.
- [ ] KPI dogrulama:
  - [ ] Eğim olcum dogrulugu ±1 derece.
  - [ ] Engel tanima dogrulugu %90+.
  - [ ] Veri yayilimi <= 5 saniye.

## 9) Yayina Hazirlik ve Dagitim
- [ ] Uygulamayi GitHub Pages icin build/deploy edilebilir hale getir.
- [ ] Staging ortami olustur ve son kabul testlerini yap.
- [ ] Uretim ortamina cikis plani hazirla (geri alma/plansiz kesinti senaryolari).
- [ ] Ilk pilot kullanici grubuyla saha testi yap ve geri bildirim topla.

## 10) Sonraki Asama (Post-MVP)
- [ ] Rota optimizasyonu (engel yogunluguna gore alternatif yol onerisi).
- [ ] Topluluk guven skoru ve rapor dogrulama mekanizmasi.
- [ ] Cevrimdisi mod ve dusuk baglanti senaryolari.
- [ ] Coklu dil destegi ve bolgesel erisilebilirlik standartlari.
