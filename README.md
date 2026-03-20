# 🚀 AccessRoute - İYTE Engelsiz Kampüs Asistanı

> **🔗 Uygulama Linki:** [AccessRoute Canlı İzle](https://simayboz.github.io/AccessRoute/)  
> **📺 Demo Videosu:** [Proje Tanıtım ve Kullanım Videosu]([BURAYA_VIDEO_LINKINI_YAPISTIR])

**"Görünmez engelleri görünür kılan, topluluk hafızasıyla güçlendirilmiş yapay zeka asistanı."**

---

## ## Problem
İYTE gibi geniş ve engebeli bir kampüste, statik haritalar hareket kısıtlılığı olan öğrenciler için yeterli güvenlik bilgisi sunmamaktadır. Bir rampanın varlığı haritada görünse de; o anki zemin durumu (ıslak mermerin kayganlığı, yaprak birikintisi, anlık buzlanma) veya rampanın dikliği gibi **"dinamik engeller"** ancak yerinde görülebilen ve ciddi yaralanma riski oluşturan faktörlerdir.

## ## Çözüm & 🤖 AI'ın Rolü
AccessRoute, kampüs navigasyonunu basit bir yol tarifinden çıkarıp, yapay zeka destekli bir **"bilişsel karar destek mekanizmasına"** dönüştürür. Projenin kalbinde yer alan **Gemini 2.5 Flash**, şu üç temel katmanda analiz yaparak kullanıcıyı korur:

1. **Multimodal Görsel Analiz:** Yapay zeka, kullanıcının çektiği fotoğraftaki perspektif kaçış noktalarını analiz ederek rampanın eğimini ($m = \tan(\theta)$) ve zemin dokusunu (cilalı mermer, asfalt, çakıl vb.) piksel düzeyinde segmentlere ayırır.
2. **Kolektif Hafıza Sentezi (Experience Synthesis):** AI, kameradan gelen canlı görüntüyü Firebase üzerindeki topluluk hafızasıyla (diğer öğrencilerin geçmiş deneyimleri) harmanlar. "Görüntüde yol temiz duruyor ancak geçmiş veriler bu noktanın yağmurlu havalarda çok kaygan olduğunu bildirmiş" diyerek **Öngörülü Güvenlik** sağlar.
3. **İnteraktif NLP Rehberliği:** Kullanıcılar AI'ya "Manuel sandalyemle buradan tek başıma geçebilir miyim?" gibi doğal dilde sorular sorabilir. AI, hem görsel veriyi hem de kullanıcının hareketlilik profilini sentezleyerek kişiselleştirilmiş rehberlik sunar.

## ## Kullanılan Teknolojiler
- **Google Gemini 2.5 Flash:** Multimodal görsel analiz ve bilişsel akıl yürütme (AI Engine).
- **Firebase Firestore:** Gerçek zamanlı topluluk veritabanı ve deneyim sentezi.
- **Vanilla JavaScript (ES6+):** Hafif, hızlı ve framework bağımlılığı olmayan frontend mantığı.
- **Tailwind CSS & Glassmorphism:** Modern, erişilebilir ve şık kullanıcı arayüzü.
- **HTML5 Canvas API:** İstemci tarafında otomatik görüntü sıkıştırma ve optimizasyon.

## ## Nasıl Çalıştırılır?
1. **Repoyu Klonlayın:** `git clone https://github.com/simayboz/AccessRoute.git`
2. **Uygulamayı Açın:** Proje klasöründeki `index.html` dosyasını modern bir tarayıcıda çalıştırın.
3. **API Anahtarı:** Giriş ekranında sizden istenen alana kendi **Gemini API Key**'inizi girin. Anahtarınız `LocalStorage` alanında güvenli bir şekilde saklanacaktır.

---
**Geliştirici:** Simay (İzmir Yüksek Teknoloji Enstitüsü - Kimya Mühendisliği)