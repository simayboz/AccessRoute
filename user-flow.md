# 🚶 AccessRoute: Kullanıcı Akışı (User Flow)

Bu belge, kullanıcının uygulamaya girdiği andan itibaren yaşayacağı deneyimi adım adım özetler.

**Adım 1: Uygulamayı Açılış ve Profil Seçimi**
* Kullanıcı uygulamayı açtığında sade bir ekranla karşılaşır.
* Karşısına iki seçenek çıkar: "Bedensel Engelli Modu" veya "Görme Engelli Modu". Seçimine göre arayüz şekillenir (Örn: Görme engelliler için sesli asistan anında devreye girer).

**Adım 2: Ana Ekran (Gözlem)**
* Ekranda iki büyük, kolay basılabilir buton bulunur: **"Rampa Ölç"** ve **"Engel Bildir"**. 
* Alt kısımda ise çevredeki diğer kullanıcıların raporladığı engelleri gösteren bir Canlı Harita yer alır.

**Adım 3a: Rampa Ölçümü Yapma**
* Kullanıcı "Rampa Ölç" butonuna basar ve telefonunu rampa zeminine paralel tutar.
* **Sonuç:** Ekranda anlık eğim yüzdesi görünür. Eğer eğim %8'den yüksekse ekran kırmızıya döner ve sesli olarak "Dikkat, bu rampa güvenli limitlerin üzerinde!" uyarısı verir.

**Adım 3b: Engel Bildirme (Gemini Devrede)**
* Kullanıcı yolda bir engel (hatalı park etmiş araç, çukur vb.) gördüğünde "Engel Bildir"e basar ve fotoğraf çeker.
* **Sonuç:** Gemini AI fotoğrafı inceler. Ekrana ve sese şu çıktıyı verir: *"Önünüzdeki kaldırıma bir araç park etmiş, geçiş alanı kapalı. Haritaya riskli alan olarak eklendi."*

**Adım 4: Haritaya Yansıma ve Topluluk**
* Kullanıcının yaptığı bu ölçüm veya engel tespiti, o an haritada olan diğer tüm "AccessRoute" kullanıcılarının ekranında kırmızı bir uyarı ikonu (📍) olarak saniyeler içinde belirir.