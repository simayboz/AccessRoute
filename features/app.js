(function () {
    // BURAYA KENDİ GEMINI API KEY'İNİ YAPIŞTIR (Tırnakların arasına)
    // Not: GitHub bunu iptal ederse, jüriye göndereceğin açıklamada anahtarı not olarak eklersin.
    const DEFAULT_GEMINI_KEY = "AIzaSyAdfYrdBu3SNA40VoNj7OiAP0WHIsjY4zI"; 

    const firebaseConfig = {
        apiKey: "AIzaSyC1zUYmKOTfjwSqYkoDUCSq73I4FPdp7yA",
        authDomain: "accessroute-iyte.firebaseapp.com",
        projectId: "accessroute-iyte",
        storageBucket: "accessroute-iyte.firebasestorage.app",
        messagingSenderId: "369877736663",
        appId: "1:369877736663:web:34f28c80313bb3f71b6492"
    };
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Öncelik: Kaydedilmiş key > Kodun içindeki default key > Null
    let GEMINI_API_KEY = localStorage.getItem("gemini_api_key") || DEFAULT_GEMINI_KEY;
    let STORED_USER_NAME = localStorage.getItem("userName") || "";
    let STORED_USER_PROFILE = localStorage.getItem("userProfile") || "Belirtilmedi";
    
    // ... (Geri kalan tüm IYTE_LOCATIONS ve STATIC_COMMENTS kısımları aynı kalacak) ...
    // HIZLI OLMASI İÇİN SADECE GİRİŞ EKRANI FONKSİYONUNU GÜNCELLİYORUM:

    function renderGiris() {
        // Eğer kodun içinde anahtar varsa veya daha önce girilmişse jüri doğrudan geçebilsin
        const hasKey = (GEMINI_API_KEY && GEMINI_API_KEY !== "BURAYA_API_ANAHTARINI_YAZ");

        return `<div class="flex flex-col items-center justify-center h-screen space-y-10 text-center px-10 animate-fade-in -mt-4 bg-transparent">
            <div class="relative w-36 h-36 mb-4 flex items-center justify-center">
                <div class="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-30"></div>
                <div class="relative z-10 w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center border-4 border-red-600/50 shadow-2xl shadow-red-600/20">
                    <i class="ph-fill ph-map-pin text-6xl text-red-500"></i>
                </div>
            </div>
            
            <div class="space-y-3">
                <h1 class="text-5xl font-extrabold text-white tracking-tighter">Access<span class="text-red-500">Route</span></h1>
                <p class="text-sm text-slate-400 mt-2 font-medium tracking-wide">İYTE Engelsiz Kampüs Rehberi</p>
            </div>

            <div class="w-full max-w-sm space-y-4">
                <input type="text" id="userNameInput" value="${state.userName}" placeholder="Adınız Soyadınız" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-base outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 text-white shadow-inner transition">
                
                <select id="userProfileInput" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-base outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 text-slate-300 appearance-none [&>option]:bg-slate-950 shadow-inner transition">
                    <option value="Belirtilmedi" ${state.userProfile === 'Belirtilmedi' ? 'selected' : ''}>Hareketlilik Tercihi (İsteğe Bağlı)</option>
                    <option value="Manuel Tekerlekli Sandalye" ${state.userProfile === 'Manuel Tekerlekli Sandalye' ? 'selected' : ''}>Manuel Tekerlekli Sandalye</option>
                    <option value="Akülü Tekerlekli Sandalye" ${state.userProfile === 'Akülü Tekerlekli Sandalye' ? 'selected' : ''}>Akülü Tekerlekli Sandalye</option>
                    <option value="Koltuk Değneği veya Yürüteç" ${state.userProfile === 'Koltuk Değneği veya Yürüteç' ? 'selected' : ''}>Koltuk Değneği / Yürüteç</option>
                    <option value="Beyaz Baston (Görme Desteği)" ${state.userProfile === 'Beyaz Baston (Görme Desteği)' ? 'selected' : ''}>Beyaz Baston / Görme Desteği</option>
                    <option value="Fiziksel Destek İhtiyacı Yok" ${state.userProfile === 'Fiziksel Destek İhtiyacı Yok' ? 'selected' : ''}>Fiziksel Destek İhtiyacım Yok</option>
                </select>
                
                ${!hasKey ? `<input type="password" id="apiKeyInput" placeholder="Gemini API Key (Opsiyonel)" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-base outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 text-emerald-400 transition">` : `<div class="bg-slate-900/50 py-4 px-5 rounded-2xl flex justify-between items-center border border-slate-800"><span class="text-sm text-emerald-400 font-medium">✅ AI Sistemi Aktif</span><button data-action="reset-key" class="text-xs text-rose-400 font-bold underline">Anahtarı Sıfırla</button></div>`}

                <button data-action="submit-login" class="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-transform text-lg mt-6">Uygulamaya Başla</button>
            </div>
        </div>`;
    }
    
    // ... (Kodun geri kalanını bir önceki tam kopyadan buraya ekleyebilirsin) ...
})();