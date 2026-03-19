# 💻 AccessRoute: Teknoloji Seçimi ve Mimarisi

Başlangıç seviyesinde olduğum için, projenin karmaşıklığında boğulmamak adına "En Basit ve En Etkili" teknoloji yığınını (Tech Stack) seçtik.

## 🛠️ Seçtiğimiz Teknolojiler ve Nedenleri:

1. **HTML5, CSS ve Vanilla JavaScript (ES6)**
   * **Neden?** React veya Vue gibi karmaşık framework'leri öğrenmekle vakit kaybetmek yerine, doğrudan tarayıcının anladığı dillerle (Vanilla JS) hızlıca prototip çıkaracağız.
   * **CSS Framework:** Arayüzü hızlıca güzelleştirmek için **Tailwind CSS** (CDN üzerinden) kullanacağız.

2. **Sensör Yönetimi: Device Orientation API**
   * **Neden?** Harici bir kütüphane indirmemize gerek yok. HTML5'in kendi içindeki bu API sayesinde, akıllı telefonun jiroskop ve ivmeölçer verilerine doğrudan erişip rampa eğimini hesaplayabiliriz.

3. **Yapay Zeka: Google Gemini 1.5 Flash API**
   * **Neden?** Görüntü (fotoğraf) işleme konusunda çok hızlı ve başarılı. Üstelik Google AI Studio üzerinden API anahtarımız hazır. Engellerin ne olduğunu saniyeler içinde metne ve sese çevirmemizi sağlayacak.

4. **Veritabanı: Firebase Realtime Database**
   * **Neden?** Canlı haritadaki "5 saniye içinde diğer kullanıcılara yayılma" hedefini kurması en kolay sistemdir. Gerçek zamanlı senkronizasyon sağlar.

## 🚀 Kurulum Adımları
1. Proje klasöründe `index.html`, `style.css` ve `app.js` dosyaları oluşturulacak.
2. `index.html` dosyasının `<head>` etiketleri arasına Tailwind CSS eklenecek.
3. Google AI Studio'dan alınan Gemini API anahtarı `app.js` içine (güvenli bir şekilde) entegre edilecek.
4. Telefon sensörlerinden izin alma kodları (iOS ve Android için) eklenecek.
5. GitHub Desktop/Terminal üzerinden dosyalar GitHub'a pushlanıp, GitHub Pages ile tüm dünyanın kullanımına ücretsiz olarak canlıya alınacak.