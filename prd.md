# 📄 AccessRoute: Ürün Gereksinim Belgesi (PRD)

## 1. Proje Vizyonu
**AccessRoute**, şehir içi mobilitede engelli bireylerin karşılaştığı "bilgi boşluğunu" sensör verisi ve yapay zeka ile dolduran bir mikro-navigasyon asistanıdır. Sadece bir harita değil, fiziksel çevreyi analiz eden ve bunu tüm toplulukla anlık paylaşan bir "akıllı yol arkadaşı" olmayı hedefler.

## 2. Kullanıcı Grupları ve İhtiyaçları
* **Bedensel Engelliler:** Standart dışı rampaları (%8+) önceden bilmek ve cihaz kapasitesine uygun (manuel/akülü) güvenli rota çizmek isterler.
* **Görme Engelliler:** Çevredeki fiziksel engellerin (araç, duba, çukur) sesli betimlenmesine ve bağımsız hareket desteğine ihtiyaç duyarlar.
* **Topluluk:** Diğer kullanıcıların geçtiği yollardaki anlık engelleri (inşaat, hatalı park) canlı harita üzerinde görerek vakit kazanmak isterler.

## 3. Temel Özellikler (Functional Requirements)

### 3.1. Akıllı Rampa Denetçisi (Sensör Entegrasyonu)
* **Fonksiyon:** Cihazın **Gyroscope** (Jiroskop) ve **Accelerometer** (İvmeölçer) sensörlerini kullanarak zemin eğimini anlık hesaplar.
* **AI Karar Mekanizması:** Ölçülen eğim kullanıcının güvenli sınırının (Örn: %8) üzerindeyse sesli ve görsel uyarı verir.

### 3.2. Gemini Vision Engel Analizi (Görüntü İşleme)
* **Fonksiyon:** Kullanıcının çektiği fotoğrafları **Gemini 1.5 Flash API** üzerinden analiz eder.
* **Çıktı:** Nesnenin türünü (Örn: "Kaldırıma park etmiş araç") ve geçiş durumunu ("Geçilemez", "Riskli") belirler.

### 3.3. Sesli Rehberlik Sistemi (Voice-First)
* **Text-to-Speech (TTS):** Gemini'nin analiz sonuçlarını görme engelliler için detaylı sesli betimlemeye dönüştürür.
* **Speech-to-Text (STT):** Kullanıcıların sadece konuşarak engel raporlamasına (Örn: "Burada yol çalışması var") imkan tanır.

### 3.4. Canlı Erişilebilirlik Haritası (Crowdsourcing)
* **Fonksiyon:** AI tarafından onaylanan engeller koordinatlarıyla birlikte merkezi veritabanına işlenir.
* **Anlık Senkronizasyon:** Bir kullanıcının tespit ettiği engel, o bölgedeki tüm kullanıcıların haritasında kırmızı bir uyarı ikonu olarak belirir.

## 4. Teknik Mimari (Tech Stack)
| Bileşen | Teknoloji |
| :--- | :--- |
| **Frontend** | HTML5, Tailwind CSS, JavaScript (ES6+) |
| **AI Beyni** | Google Gemini 1.5 Flash API (Multimodal) |
| **Sensör Erişimi** | Device Orientation API |
| **Veri Saklama** | Firebase veya Supabase (Real-time DB) |
| **Barındırma** | GitHub Pages |

## 5. Kullanıcı Akışı (User Flow)
1.  **Profil Seçimi:** Kullanıcı uygulamayı açar ve engel tipine göre (Bedensel/Görme) profilini belirler.
2.  **Gözlem/Ölçüm:** Rampa eğimini ölçer veya karşılaştığı engelin fotoğrafını çeker.
3.  **Yapay Zeka Analizi:** Gemini Vision görüntüyü yorumlar, sensör verisiyle birleştirir.
4.  **Geri Bildirim:** Kullanıcıya sesli ve görsel "Güvenli/Riskli" raporu sunulur.
5.  **Topluluk Paylaşımı:** Veri anında canlı haritaya işlenerek diğer kullanıcılar uyarılır.

## 6. Başarı Kriterleri (KPIs)
* Eğim ölçümlerinde ±1 derece hata payı ile yüksek hassasiyet.
* Gemini Vision'ın engelleri tanımlama ve risk puanlama doğruluğunun %90+ olması.
* Raporlanan engellerin harita üzerinde 5 saniye içinde tüm kullanıcılara yayılması.