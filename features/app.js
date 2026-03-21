(function () {
    // JÜRİ İÇİN: Kendi API anahtarını buraya yapıştır
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

    let GEMINI_API_KEY = localStorage.getItem("gemini_api_key") || (DEFAULT_GEMINI_KEY !== "BURAYA_API_ANAHTARINI_YAPIŞTIR" ? DEFAULT_GEMINI_KEY : null);
    let STORED_USER_NAME = localStorage.getItem("userName") || "";
    let STORED_USER_PROFILE = localStorage.getItem("userProfile") || "Belirtilmedi";
    
    const IYTE_LOCATIONS = [
        { id: "lib", title: "Kütüphane" }, { id: "cafe", title: "Yemekhane Girişi" },
        { id: "chem", title: "Kimya Mühendisliği" }, { id: "kyk_kiz", title: "KYK Kız Yurdu" },
        { id: "kyk_erkek", title: "KYK Erkek Yurdu" }, { id: "hazirlik", title: "Hazırlık Binası" },
        { id: "opera_kafe", title: "Opera Kafe" }, { id: "koy_yokusu", title: "Köy Yokuşu" },
        { id: "muh_bilgisayar", title: "Bilgisayar Mühendisliği" }, { id: "muh_biyomuhendislik", title: "Biyomühendislik" },
        { id: "muh_cevre", title: "Çevre Mühendisliği" }, { id: "muh_enerji", title: "Enerji Sistemleri Mühendisliği" },
        { id: "muh_elektronik", title: "Elektronik ve Haberleşme Mühendisliği" }, { id: "muh_gida", title: "Gıda Mühendisliği" },
        { id: "muh_insaat", title: "İnşaat Mühendisliği" }, { id: "muh_kimya", title: "Kimya Mühendisliği" },
        { id: "muh_makine", title: "Makine Mühendisliği" }, { id: "muh_malzeme", title: "Malzeme Bilimi ve Mühendisliği" },
        { id: "fak_fen", title: "Fen Fakültesi" }, { id: "fak_mimarlik", title: "Mimarlık Fakültesi" }
    ];

    const STATIC_COMMENTS = [
        { locId: "chem", user: "Zülal", profile: "Manuel Tekerlekli Sandalye", photo: "", rating: 2, text: "Yokuş çok dik, kışın ıslakken tekerlekler kayıyor. Yanımda biri olmadan çıkmam imkansız.", date: "15 Mar 2026" },
        { locId: "chem", user: "Caner", profile: "Akülü Tekerlekli Sandalye", photo: "", rating: 4, text: "Akülüyle çıkılıyor ama bataryayı çok zorluyor. Zemin biraz tırtıklı, sarsıyor.", date: "16 Mar 2026" },
        { locId: "lib", user: "Elif", profile: "Akülü Tekerlekli Sandalye", photo: "", rating: 5, text: "Kampüsün en erişilebilir binası kesinlikle burası.", date: "16 Mar 2026" },
        { locId: "koy_yokusu", user: "Deniz", profile: "Manuel Tekerlekli Sandalye", photo: "", rating: 1, text: "Burası bir engel parkuru gibi. Eğim standartların çok üstünde.", date: "15 Mar 2026" }
    ];

    const state = {
        tab: "giris", userName: STORED_USER_NAME, userProfile: STORED_USER_PROFILE,
        selectedLoc: "", imageSource: null, cameraActive: false, geminiLoading: false, 
        geminiResult: "", showModal: false, customQuestion: "", fullscreenImgSrc: null,
        comments: [...STATIC_COMMENTS],
        newCommentPhoto: null, newCommentText: "", newCommentRating: 0
    };

    const app = document.getElementById("app");

    db.collection("comments").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        const liveComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        state.comments = [...liveComments, ...STATIC_COMMENTS]; 
        if (state.tab === "topluluk") render(); 
    });

    async function resizeImage(base64Str, maxWidth = 800) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width; let height = img.height;
                if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        });
    }

    function getProfileBadge(profile) {
        const badges = {
            "Manuel Tekerlekli Sandalye": { style: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "ph-wheelchair" },
            "Akülü Tekerlekli Sandalye": { style: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: "ph-wheelchair" },
            "Koltuk Değneği veya Yürüteç": { style: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: "ph-person" },
            "Beyaz Baston (Görme Desteği)": { style: "bg-teal-500/10 text-teal-400 border-teal-500/20", icon: "ph-eye-slash" },
            "Fiziksel Destek İhtiyacı Yok": { style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "ph-person-arms-spread" },
            "Belirtilmedi": { style: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: "ph-user" }
        };
        const badge = badges[profile] || badges["Belirtilmedi"];
        return `<span class="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border ${badge.style}"><i class="ph-fill ${badge.icon}"></i> ${profile}</span>`;
    }

    function renderGiris() {
        const hasKey = (GEMINI_API_KEY && GEMINI_API_KEY !== "BURAYA_API_ANAHTARINI_YAPIŞTIR");
        
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
                
                ${!hasKey ? `<input type="password" id="apiKeyInput" placeholder="Gemini API Key (Opsiyonel)" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-base outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 text-emerald-400 transition">` : `<div class="bg-slate-900/50 py-4 px-5 rounded-2xl flex justify-between items-center border border-slate-800"><span class="text-sm text-emerald-400 font-medium">✅ AI Sistemi Aktif</span><button data-action="reset-key" class="text-xs text-rose-400 font-bold underline">Sıfırla</button></div>`}

                <button data-action="submit-login" class="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-transform text-lg mt-6">Uygulamaya Başla</button>
            </div>
        </div>`;
    }

    function renderAnaliz() {
        const imgClass = state.imageSource ? "w-full h-full object-cover cursor-pointer" : "";
        return `<div class="space-y-4 px-3 pt-6 animate-fade-in pb-8">
            <div class="glass rounded-3xl p-5 shadow-xl border border-white/10">
                <h1 class="text-xl font-bold tracking-wide flex items-center gap-2 text-white"><i class="ph-fill ph-scan text-red-500"></i> Analiz Modu</h1>
                <p class="text-[10px] text-slate-400 mt-1">Hoş geldin, <span class="text-white">${state.userName}</span></p>
            </div>
            <div class="glass rounded-2xl