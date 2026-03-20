# 🚀 AccessRoute - İYTE Engelsiz Kampüs Asistanı

## 🎯 Proje Fikri ve Problem Tanımı
Geleneksel erişilebilirlik çözümleri engelleri **"statik"** kabul eder. Oysa İYTE gibi geniş ve eğimli bir kampüste engel dinamiktir: Bir rampa mimari olarak oradadır (statik), ancak yağmurlu bir günde mermer zemini kayganlaşmıştır (dinamik). Mevcut navigasyonlar bu "zaman" boyutunu ve anlık güvenlik riskini raporlayamaz. **AccessRoute**, kampüs navigasyonunu statik bir haritadan, yapay zeka destekli bir **"karar destek mekanizmasına"** dönüştürür.

## 👤 Hedef Kullanıcı ve Kapsayıcılık
Uygulama, kampüsü bir "mikrokozmos" olarak ele alır ve şu profillere özel çözüm sunar:
* **Tekerlekli Sandalye Kullanıcıları:** Eğim ($m = \tan(\theta)$) ve zemin çekiş gücü analizi.
* **Koltuk Değneği / Yürüteç Kullananlar:** Kayganlık ve kapı ağırlığı odaklı geri bildirim.
* **Beyaz Baston (Görme Desteği) İhtiyacı Olanlar:** Hissedilebilir yüzey sürekliliği takibi.
* **Destekçi Topluluk:** "Kaldırım Rampası Etkisi" (Curb Cut Effect) sayesinde bebek arabalı velilerden ağır yük taşıyan personele kadar tüm kampüse fayda sağlayan veri gönüllüleri.

## 🤖 AI'ın Rolü: Multimodal Analiz ve Deneyim Sentezi
Projenin kalbinde **Gemini 2.5 Flash** mimarisi yer alır. Yapay zeka iki devasa veri hattını birleştirir:
1.  **Görsel Analiz:** Fotoğraftaki perspektif derinlik üzerinden eğim kestirimi ve zemin doku segmentasyonu yapar.
2.  **Deneyim Sentezi:** Firebase'den gelen **topluluk hafızasını** (örn: "Zülal buranın ıslakken çok kaygan olduğunu belirtmiş") mevcut görselle harmanlayarak hibrit bir tavsiye üretir.

## 🏁 Rakip Analizi ve Farkımız
Mevcut kampüs navigasyonları (CampusGo, Evelity vb.) genellikle statik bina planlarına odaklanırken, AccessRoute anlık risk değerlendirmesi yapar.

| Özellik | Rakipler (CampusGo/Wheelmap) | AccessRoute |
| :--- | :--- | :--- |
| **Veri Tipi** | Statik / POI Odaklı | Dinamik / Yol Hattı Odaklı |
| **Analiz Metodu** | Etiketleme (Var/Yok) | AI Görsel Analiz + Deneyim Sentezi |
| **Kullanıcı Katkısı** | Sınırlı Geri Bildirim | Real-time Kolektif Hafıza (Firebase) |
| **AI Entegrasyonu** | Düşük / Yok | Çok Yüksek (Gemini 2.5 Flash) |

## ✅ Başarı Kriteri
Bu proje başarılı olduğunda, kampüsteki "görünmez engeller" görünür kılınacak. İYTE'de hiçbir öğrenci fiziksel bir engel karşısında kendini yalnız hissetmeyecek. Bilgi paylaşıldıkça asistanımız daha tecrübeli hale gelecek ve kentsel hareketliliğin demokratikleşmesi adına küresel bir prototip oluşturacak.