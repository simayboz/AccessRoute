# 📍 AccessRoute: Dinamik Erişilebilirlik ve Akıllı Sesli Rehberlik Sistemi

## ⚠️ Problem (Fiziksel Çevredeki Görünmez Bariyerler)
Engelli bireyler, pusetli ebeveynler ve yaşlılar için şehir içi hareketlilik büyük bir "bilinmezlik" ve "güvenlik kaygısı" zinciridir. Yol üzerindeki standart dışı dik rampalar (%8+ eğim), yoldaki geçici inşaat çalışmaları veya kaldırıma hatalı park etmiş araçlar gibi fiziksel engeller mevcut dijital verilerde yer almaz. Bu durum, "erişilebilir seyahat zinciri"nin kırılmasına, ciddi vakit kaybına ve kullanıcının fiziksel güvenliğinin tehlikeye girmesine yol açar.

## 👥 Kullanıcı (Kapsayıcı Mobilite Grupları)
- **Bedensel Engelliler:** Manuel veya akülü sandalye kullanan, rampa eğimi ve zemin kalitesine hassas bireyler.
- **Görme Engelliler:** Çevredeki nesneleri algılamak, yön bulmak ve sesli navigasyon desteği almak isteyen bireyler.
- **Dezavantajlı Gruplar:** Pusetli ebeveynler, valiz taşıyan turistler ve kampüs içi güvenli rota arayan yaşlılar.

## 🤖 AI'ın Rolü (Sensör Füzyonu ve Görsel/İşitsel Zeka)
- **Akıllı Rampa Denetçisi:** Telefonun jiroskobundan (gyroscope) gelen ham veriyi işleyerek rampaların güvenliğini (eğim yüzdesini) objektif olarak ölçer.
- **Gemini Vision Engel Analizi:** Kullanıcının çektiği fotoğrafları analiz ederek engelin türünü (çukur, araç, duba) ve "geçilebilirliğini" saniyeler içinde belirler.
- **Sesli Rehberlik (Voice-First):** Görme engelliler için çevreyi sesli betimler (Örn: "2 metre sağda engel var") ve sesli komutla raporlama yapılmasını sağlar.
- **Canlı Topluluk Haritası:** AI tarafından onaylanan engelleri anlık olarak veritabanına işleyerek diğer kullanıcılara "Canlı Erişim Ağı" sunar.

## 🏁 Rakip Durum (Teknik ve Operasyonel Analiz)
- **Küresel Devler (Google Maps vb.):** Verileri kullanıcı beyanına dayalı ve statiktir; mikro düzeyde eğim analizi veya canlı engel takibi yapamazlar.
- **Niş Uygulamalar (Wheelmap vb.):** Bölgesel veri kısıtlılığı yaşarlar ve "rota optimizasyonu" yerine sadece mekan puanlamasına odaklanırlar.
- **AccessRoute Farkı:** Sensör doğrulamalı (objektif), sesli rehberlik destekli (kapsayıcı) ve mikro-alanlarda (kampüs vb.) derinleşen, "canlı" ve AI denetimli bir çözüm sunar.

## 🏆 Başarı Kriteri
İYTE kampüsü pilot bölgesinde tüm kritik rampaların %95 doğrulukla haritalandırılması, engelli bireylerin seyahat belirsizliğinin %80 oranında azaltılması ve ilk 10 gün sonunda en az 50 aktif engel bildirimi içeren canlı bir veri bankasına ulaşılması.