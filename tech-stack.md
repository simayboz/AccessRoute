# 💻 AccessRoute: Teknoloji Seçimi ve Mimari Yapı

Proje geliştirme sürecinde, "En Basit ve En Etkili" felsefesini koruyarak, uygulamanın performansını ve veri doğruluğunu artıracak profesyonel teknolojilere geçiş yaptık.

## 🛠️ Güncel Teknoloji Yığını (Tech Stack)

### 1. Frontend: Vanilla JavaScript (ES6+), Tailwind CSS & Glassmorphism
* **Neden?** Projenin her cihazda ve her internet hızında ışık hızında açılması için ağır framework karmaşasından (React/Vue vb.) uzak durduk. 
* **Tasarım & UI:** Modern ve temiz bir kullanıcı deneyimi için **Glassmorphism** (Buzlu Cam) efekti, **Phosphor Icons** kütüphanesi ve erişilebilirliği (accessibility) artıran yüksek kontrastlı renk paletleri tercih edildi.

### 2. Yapay Zeka (AI Beyni): Google Gemini 2.5 Flash API
* **Neden Natively Multimodal?** Gemini 2.5 Flash'ın doğuştan çok modlu yapısı, görsel veriyi (eğim ve zemin analizi) ve metin verisini (topluluk yorumları) tek bir işlem adımında sentezlememize olanak tanıyor.
* **Neden NLP (Doğal Dil İşleme)?** Sadece analiz yapmakla kalmayıp, kullanıcının "Buradan manuel sandalyemle geçebilir miyim?" gibi sorularını anlayan ve kişiselleştirilmiş **bilişsel akıl yürütme (cognitive reasoning)** ile cevaplayan interaktif bir asistan yaratmak için seçildi.
* **Hız:** Kampüsteki anlık durum analizlerini milisaniyeler içinde sonuçlandırarak gerçek zamanlı karar desteği sunuyor.

### 3. Veritabanı: Firebase Firestore (Cloud Document DB)
* **Neden?** Başlangıçtaki Realtime DB planımızı, daha esnek sorgulama yeteneklerine ve veri modelleme yapısına sahip olan **Firestore** ile güncelledik. 
* **Anlık Senkronizasyon:** Bir öğrenci kampüsün bir noktasında engel bildirdiği an, tüm kullanıcıların ekranına sayfa yenilemeye gerek kalmadan (Snapshot Listener ile) anında yansır.

### 4. Görüntü İşleme: HTML5 Canvas API (Client-side Resizing)
* **Neden?** Mobil cihazlardan çekilen yüksek çözünürlüklü fotoğrafların (3-5 MB) API isteklerini yavaşlatmaması, Firebase limitlerini aşmaması ve kullanıcı kotasından tasarruf sağlaması için; fotoğraflar sunucuya gönderilmeden önce tarayıcıda otomatik olarak **800px** genişliğe sıkıştırılıyor.

### 5. Durumsal Farkındalık: Kolektif Deneyim Sentezi
* **Neden?** Uygulama, donanımsal sensör hatalarını (jiroskop sapmaları, GPS kaymaları) egale etmek için yapay zekayı **topluluk hafızasıyla** birleştirdi. Bu sayede sadece kameranın "gördüğü" değil, topluluğun "deneyimlediği" (örn: ıslak mermer zeminin kayganlığı) verisi de işlenmiş oluyor.

---

## 🚀 Barındırma ve Güvenlik
* **Deployment:** Proje, **GitHub Pages** üzerinden statik bir web uygulaması olarak sunulmaktadır (Sıfır sunucu maliyeti ve yüksek uptime).
* **Veri Yönetimi:** Kullanıcı tercihleri ve profilleri `LocalStorage` üzerinde güvenli bir şekilde tutulurken, Firestore güvenlik kuralları (Security Rules) ile "sadece kendi yorumunu silme" özelliği aktiftir.