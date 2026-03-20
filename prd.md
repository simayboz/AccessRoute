# 📋 AccessRoute - Ürün Gereksinim Belgesi (PRD)

## 1. Proje Özeti
**AccessRoute**, İYTE kampüsündeki fiziksel engelleri engelli öğrenciler için birer "bilinmezlik" olmaktan çıkaran dijital bir rehberdir. Kullanıcılar çektikleri fotoğrafları yapay zekaya analiz ettirirken, sistem bu veriyi topluluktan gelen gerçek deneyimlerle harmanlayarak en güvenli rotayı önerir.

## 2. Hedef Kullanıcılar
Uygulama, kampüste hareket etmek için farklı araçlar kullanan bireyleri tanır ve onlara özel tavsiyeler üretir:
* **Manuel veya Akülü Tekerlekli Sandalye** kullanıcıları.
* **Koltuk değneği veya yürüteç** kullananlar.
* **Beyaz baston** kullanan (görme desteği ihtiyacı olan) öğrenciler.
* Kampüsün erişilebilirliğine katkı sunmak isteyen **destekçi gönüllüler**.

## 3. Temel Özellikler

### 3.1. Kişiselleştirilmiş Hareketlilik Profili
Kullanıcı giriş yaptığında adını ve hareketlilik tercihini seçer. Uygulama bu bilgileri `LocalStorage` kullanarak hatırlar, böylece kullanıcı her seferinde veri girmek zorunda kalmaz.

### 3.2. Kolektif Yapay Zeka Analizi (AI + Topluluk)
Yapay Zeka (Gemini 2.5 Flash), kullanıcının gönderdiği fotoğrafı analiz ederken sadece görsel veriye bakmaz:
* Kullanıcının **hareketlilik profilini** (örn: manuel sandalye) dikkate alır.
* Firebase'deki **topluluk yorumlarını ve geçmiş deneyimleri** saniyeler içinde sentezler.
* **Sonuç:** "Görüntüde rampa açısı uygun görünüyor ama geçmiş yorumlarda buranın yağmurlu havalarda çok kaygan olduğu belirtilmiş, dikkatli olmalısın!" gibi akıllı raporlar sunar.

### 3.3. Gerçek Zamanlı Topluluk Beslemesi
Kullanıcılar deneyimlerini fotoğraf ekleyerek veya eklemeden paylaşabilir. 
* **Firestore Entegrasyonu:** Yorumlar ve puanlar anlık olarak tüm kullanıcıların ekranına düşer.
* **Yetkilendirme:** Kullanıcılar sadece kendi yazdıkları yorumları silebilir.
* **Görselleştirme:** Fotoğraflar tıklanarak tam ekran incelenebilir.

## 4. Uygulama Ekranları
1. **Giriş Ekranı:** Ad, hareketlilik tercihi ve API Key girişi yapılan modern karşılama alanı.
2. **Analiz Ekranı:** Konum seçimi, fotoğraf yükleme alanı, özel AI soru kutusu ve analiz sonuçlarının sunulduğu bölüm.
3. **Topluluk Ekranı:** Kampüs genelindeki yorumların listelendiği, etkileşimli sosyal alan.

## 5. Teknik Altyapı
* **Frontend:** HTML5, Tailwind CSS (Modern UI).
* **Zeka:** Gemini 2.5 Flash API (Multimodal sentez).
* **Veritabanı:** Firebase Firestore (Real-time DB).
* **Tasarım:** Phosphor Icons & Glassmorphism (Buzlu cam efekti).
* **Mobil Optimizasyon:** İstemci tarafında otomatik fotoğraf boyutlandırma ve sıkıştırma.

## 6. Başarı Kriteri
Bu projenin başarısı, İYTE kampüsünde hiçbir öğrencinin fiziksel bir engel karşısında "yalnız" hissetmemesidir. Bilgi paylaşıldıkça engeller azalır.