# 📋 AccessRoute - Ürün Gereksinim Belgesi (PRD)

## 1. Proje Özeti
**AccessRoute**, İYTE kampüsündeki fiziksel engelleri engelli öğrenciler için birer "bilinmezlik" olmaktan çıkaran dijital bir rehberdir. Kullanıcılar çektikleri fotoğrafları yapay zekaya analiz ettirirken, sistem bu veriyi topluluktan gelen gerçek deneyimlerle harmanlayarak en güvenli rotayı önerir.

## 2. Hedef Kullanıcılar
Uygulama, kampüste hareket etmek için farklı araçlar kullanan bireyleri tanır ve onlara özel tavsiyeler üretir:
* **Manuel veya Akülü Tekerlekli Sandalye** kullanıcıları.
* **Koltuk değneği veya yürüteç** kullananlar.
* Kampüsün erişilebilirliğine katkı sunmak isteyen ve fiziksel engelleri raporlayan **destekçi gönüllüler**.

## 3. Temel Özellikler

### 3.1. Kişiselleştirilmiş Hareketlilik Profili
Kullanıcı giriş yaptığında adını ve hareketlilik tercihini seçer. Uygulama bu bilgileri `LocalStorage` kullanarak hatırlar, böylece kullanıcı her seferinde veri girmek zorunda kalmaz.

### 3.2. Çok Katmanlı AI Analiz Sistemi (AI + Kolektif Hafıza)
Yapay Zeka (Gemini 2.5 Flash), multimodal mimarisi sayesinde şu analizleri eş zamanlı gerçekleştirir:
* **Görsel Segmentasyon ve Fiziksel Analiz:** Fotoğraftaki eğim durumunu, basamak engellerini ve zemin dokusunu (mermer, çakıl, asfalt vb.) genel bağlamda analiz eder.
* **Deneyim Sentezi:** Firebase'deki topluluk yorumlarını tarayarak görsel veriyi geçmiş deneyimlerle (örn: "ıslakken kaygan") harmanlar.
* **İnteraktif NLP (Soru-Cevap):** Kullanıcının sorduğu "Manuel sandalyemle buradan geçebilir miyim?" gibi doğal dil sorularına, görsel ve profil verilerini birleştirerek kişiselleştirilmiş yanıtlar üretir.
* **Risk Skorlaması:** Tüm verileri sentezleyerek kullanıcıya düşük, orta veya yüksek risk seviyesi bildirir.

### 3.3. Gerçek Zamanlı Topluluk Beslemesi
Kullanıcılar deneyimlerini fotoğraf ekleyerek veya eklemeden paylaşabilir. 
* **Firestore Entegrasyonu:** Yorumlar ve puanlar anlık olarak tüm kullanıcıların ekranına düşer.
* **Yetkilendirme:** Kullanıcılar sadece kendi yazdıkları yorumları silebilir.
* **Görselleştirme:** Fotoğraflar tıklanarak tam ekran incelenebilir.

## 4. Uygulama Ekranları
1. **Giriş Ekranı:** Ad, hareketlilik tercihi ve API Key girişi yapılan modern karşılama alanı.
2. **Analiz Ekranı:** Konum seçimi, fotoğraf yükleme alanı, **AI ile İnteraktif Soru-Cevap Kutusu** ve analiz sonuçlarının sunulduğu bölüm.
3. **Topluluk Ekranı:** Kampüs genelindeki yorumların listelendiği, etkileşimli sosyal alan.

## 5. Teknik Altyapı
* **Frontend:** HTML5, Tailwind CSS (Modern UI).
* **AI Engine:** Gemini 2.5 Flash API (Multimodal sentez ve bilişsel akıl yürütme).
* **Veritabanı:** Firebase Firestore (Real-time DB).
* **Tasarım:** Phosphor Icons & Glassmorphism (Buzlu cam efekti).
* **Mobil Optimizasyon:** HTML5 Canvas API ile istemci tarafında otomatik fotoğraf sıkıştırma.

## 6. Başarı Kriteri
Bu projenin başarısı, İYTE kampüsünde hiçbir öğrencinin fiziksel bir engel karşısında "yalnız" hissetmemesidir. Bilgi paylaşıldıkça engeller azalır ve kentsel hareketliliğin demokratikleşmesi adına dijital bir standart oluşur.