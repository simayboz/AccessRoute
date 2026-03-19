# AccessRoute

Bu repo, `prd.md` ve `tasks.md` uzerinden MVP gelistirme baslangic iskeletidir.

## Calistirma

Bu asamada proje saf HTML + ES module oldugu icin dosyayi tarayicida acmaniz yeterlidir:

1. `index.html` dosyasini acin.
2. Mobil test icin HTTPS uzerinden servis edin (telefon sensor API'leri icin onerilir).

## Mevcut Akis (MVP Iskelet)

- Profil secimi (`Bedensel` / `Gorme`)
- Olcum/analiz ekrani
- Sensor tabanli egim olcumu (Device Orientation API)
- Sonuc ekrani (`guvenli` / `riskli`)
- Harita placeholder ekrani

## Ortam Degiskenleri

Ornek anahtarlar icin `.env.example` dosyasini inceleyin:

- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `FIREBASE_API_KEY`

## Mobil ve Sensor Uyumlulugu

- `DeviceOrientationEvent` destegi gerekir.
- iOS Safari'de hareket sensoru icin kullanici izni gerekir.
- Kamera/mikrofon/konum adimlari sonraki gorevlerde eklenecektir.
- Telefon testleri icin HTTPS tercih edin.
