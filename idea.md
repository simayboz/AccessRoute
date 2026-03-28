# 🚀 AccessRoute - İYTE Engelsiz Kampüs Asistanı

## 🎯 Proje Fikri ve Problem Tanımı
GÜniversite kampüsleri, özellikle de İYTE gibi eğimli araziye sahip yerler, hareket kısıtlılığı olan öğrenciler için "görünmez engellerle" doludur. Standart haritalar bir rampanın eğimini, bir kapının ağırlığını veya o anki zemin durumunu söylemez. Bu durum, öğrencilerin kampüste bağımsız hareket etmesini zorlaştırıyor. **AccessRoute**, kampüs navigasyonunu statik bir haritadan, yapay zeka destekli bir **"karar destek mekanizmasına"** dönüştürür.

## 👤 Hedef Kullanıcı ve Kapsayıcılık
Uygulama, kampüsü bir "mikrokozmos" olarak ele alır ve şu profillere özel çözüm sunar:
* **Tekerlekli Sandalye Kullanıcıları:** Eğim ($m = \tan(\theta)$) ve zemin çekiş gücü analizi.
* **Koltuk Değneği / Yürüteç Kullananlar:** Kayganlık ve kapı ağırlığı odaklı geri bildirim.
* **Destekçi Topluluk:** "Kaldırım Rampası Etkisi" (Curb Cut Effect) sayesinde bebek arabalı velilerden ağır yük taşıyan personele kadar tüm kampüse fayda sağlayan veri gönüllüleri.

## 🤖 AI'ın Rolü: Multimodal Analiz, Kolektif Hafıza ve İnteraktif Karar Desteği

AccessRoute projesinin teknolojik çekirdeğini oluşturan **Gemini 2.5 Flash**, basit bir görüntü tanımlama aracından ziyade, kampüs ekosistemini anlayan "bilişsel bir asistan" olarak konumlanmaktadır. Yapay zeka, aşağıdaki dört kritik katmanda eş zamanlı analiz yaparak kullanıcıya en güvenli rotayı sunar:

### 1. Natively Multimodal (Doğuştan Çok Modlu) Görsel Analiz
Gemini 2.5 Flash, metin ve görsel veriyi ayrı ayrı işlemek yerine tek bir sinir ağı üzerinden aynı anda analiz eder. Bu sayede:
* **Perspektif Tabanlı Eğim Kestirimi:** Yapay zeka, fotoğraftaki kaçış noktalarını ve doku gradyanlarını kullanarak rampaların dikey yükselme/yatay mesafe oranını analiz eder ve eğim açısını ($m = \tan(\theta)$) tahmin eder.
* **Doku ve Yüzey Segmentasyonu:** Zemindeki materyali (cilalı mermer, çakıl, asfalt, ıslak beton) ayırt eder. Örneğin; "Görseldeki yüzey mermerdir; tekerlekli sandalye için düşük çekişli ve yüksek riskli bir alandır" şeklinde niteliksel çıkarımlar yapar.
* **Dinamik Engel Tespiti:** Yola bırakılmış bir scooter, bozuk bir kaldırım taşı veya geçici yol çalışması gibi anlık engelleri saniyeler içinde saptayarak kullanıcıyı uyarır.

### 2. Kolektif Hafıza ve Deneyim Sentezi (Experience Synthesis)
Yapay zeka sadece "o an gördüğüne" güvenmez; Firebase Firestore üzerinden kampüsün "topluluk hafızasına" erişir.
* **Veri Harmanlama:** AI, kameradan gelen canlı görüntüyü, geçmişte diğer öğrencilerin (örn: Zülal, Elif) o nokta için bıraktığı yorumlarla kıyaslar.
* **Bağlamsal Çıkarım:** "Görüntüde yol temiz duruyor ancak geçmiş veriler bu rampanın yağmurlu havalarda çok kaygan olduğunu gösteriyor" diyerek kullanıcıya **"Öngörülü Güvenlik" (Predictive Safety)** sunar.

### 3. İnteraktif Rehberlik ve Doğal Dil Sorgulama (NLP)
AccessRoute bir navigasyondan öte, interaktif bir danışmandır. Kullanıcı yapay zekaya dilediği soruyu sorabilir:
* **Özel Durum Sorguları:** "Manuel sandalyemle bu rampayı yardım almadan çıkabilir miyim?" veya "Koltuk değneğiyle kütüphaneye giden en düz yol burası mı?" gibi sorulara yanıt üretir.
* **Bilişsel Akıl Yürütme (Reasoning):** Yapay zeka, kullanıcının profiline (akülü sandalye, manuel sandalye veya baston kullanımı) göre cevaplarını kişiselleştirir. Eğer kullanıcı "akülü sandalye" kullanıyorsa rampa dikliği sorun teşkil etmezken, "manuel sandalye" kullanan birine alternatif bir güzergah önerir.

### 4. Kişiselleştirilmiş Karar Destek Mekanizması
Yapay zeka burada nihai kararı veren değil, **bilgilendirilmiş karar (informed decision)** verilmesini sağlayan bir mekanizmadır. 
* Kullanıcıya sadece "geç veya geçme" demez; görsel veri, topluluk yorumu ve kullanıcının özel hareketlilik profilini sentezleyerek bir **"Güvenlik Skoru"** sunar. Bu, engelli bireyin kampüs içindeki bağımsızlığını (autonomy) artıran en kritik teknolojik dokunuştur.

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