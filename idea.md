# 📍 AccessRoute: Mikro-Erişilebilirlik Navigasyonu

> "Şehirde engel yok, sadece eksik veri var."

## 🔍 Problem Tanımı
Mevcut navigasyon devleri (Google Maps vb.), engelli bireyler için hayati önem taşıyan "mikro" detayları göz ardı etmektedir. 
* **Statik Veri Sorunu:** Bir lokasyonda "rampa var" bilgisi olsa bile, o rampanın güncel durumu veya önüne park edilmiş bir araç bilinmemektedir.
* **Standart Dışı Eğimler:** Rampanın sadece varlığı değil, eğim derecesi (%6 kuralı) tekerlekli sandalye kullanıcıları için hayati risk taşır.
* **Kampüs Detay Eksikliği:** İYTE gibi geniş ve engebeli kampüslerde, binalar arası erişilebilir en güvenli rota verisi bulunmamaktadır.

## 👥 Hedef Kullanıcılar
* **Tekerlekli Sandalye Kullanıcıları:** Eğim ve zemin hassasiyeti olan bireyler.
* **Pusetli Ebeveynler:** Asansör ve rampa ihtiyacı duyan aileler.
* **Hareket Kısıtlılığı Olan Bireyler:** En kısa değil, en güvenli yolu arayan yaşlılar.

## 🤖 Yapay Zeka (AI) ve Teknolojinin Rolü
1. **Sensör Tabanlı Eğim Analizi:** Telefonun **jiroskobundan** gelen verilerle rampanın gerçek eğim açısı anlık hesaplanır.
2. **Gemini Vision ile Engel Tespiti:** Kullanıcı bir engel fotoğrafı yüklediğinde, AI görüntüyü analiz ederek engelin türünü belirler ve haritayı günceller.
3. **Akıllı Rota Skorlama:** Verileri harmanlayarak rotaya %0-100 arası bir "erişilebilirlik güven skoru" verir.

## 🏁 Rakip Analizi ve Farkımız
* **Google Maps:** Kullanıcı beyanına dayalı (Subjektif).
* **AccessRoute:** Sensör ve AI verisine dayalı (Objektif) ve İYTE kampüsü gibi alanlarda mikro-haritalama odaklı.

## 🏆 Başarı Kriterleri
* Kullanıcıların rotaya olan güveninin %80 artması.
* İYTE kampüsündeki engel bildirimlerinin %100 doğrulukla izlenebilmesi.