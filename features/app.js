(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyC1zUYmKOTfjwSqYkoDUCSq73I4FPdp7yA",
        authDomain: "accessroute-iyte.firebaseapp.com",
        projectId: "accessroute-iyte",
        storageBucket: "accessroute-iyte.firebasestorage.app",
        messagingSenderId: "369877736663",
        appId: "1:369877736663:web:34f28c80313bb3f71b6492"
    };
    
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    let GROQ_API_KEY = localStorage.getItem("groq_api_key") || "";
    let STORED_USER_NAME = localStorage.getItem("userName") || "";
    let STORED_USER_PROFILE = localStorage.getItem("userProfile") || "Belirtilmedi";
    
    const IYTE_LOCATIONS = [
        { id: "lib", title: "Kütüphane" }, { id: "cafe", title: "Yemekhane Girişi" },
        { id: "chem", title: "Kimya Mühendisliği" }, { id: "kyk_kiz", title: "KYK Kız Yurdu" },
        { id: "kyk_erkek", title: "KYK Erkek Yurdu" }, { id: "hazirlik", title: "Hazırlık Binası" },
        { id: "opera_kafe", title: "Opera Kafe" }, { id: "koy_yokusu", title: "Köy Yokuşu" },
        { id: "muh_bilgisayar", title: "Bilgisayar Mühendisliği" }, { id: "muh_insaat", title: "İnşaat Mühendisliği" },
        { id: "fak_fen", title: "Fen Fakültesi" }, { id: "fak_mimarlik", title: "Mimarlık Fakültesi" }
    ];

    const state = {
        tab: "giris", userName: STORED_USER_NAME, userProfile: STORED_USER_PROFILE,
        selectedLoc: "", imageSource: null, cameraActive: false, aiLoading: false, 
        aiResult: "", showModal: false
    };

    const app = document.getElementById("app");

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

    function renderGiris() {
        const hasKey = (GROQ_API_KEY && GROQ_API_KEY.length > 5);
        return `<div class="flex flex-col items-center justify-center min-h-screen space-y-10 text-center px-10 animate-fade-in bg-[#0f172a]">
            <div class="relative w-32 h-32 flex items-center justify-center">
                <div class="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-20"></div>
                <div class="relative z-10 w-full h-full rounded-full bg-slate-900 border-4 border-red-600/30 flex items-center justify-center shadow-2xl">
                    <i class="ph-fill ph-map-pin text-5xl text-red-500"></i>
                </div>
            </div>
            <div class="space-y-2">
                <h1 class="text-5xl font-extrabold text-white tracking-tighter">Access<span class="text-red-500">Route</span></h1>
                <p class="text-xs text-slate-400 font-medium">İzmir Yüksek Teknoloji Enstitüsü</p>
            </div>
            <div class="w-full max-w-sm space-y-4">
                <input type="text" id="userNameInput" value="${state.userName}" placeholder="Adınız Soyadınız" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-white outline-none focus:border-red-600 shadow-inner">
                <select id="userProfileInput" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-slate-300 appearance-none outline-none focus:border-red-600">
                    <option value="Belirtilmedi">Hareketlilik Tercihi</option>
                    <option value="Manuel Tekerlekli Sandalye">Manuel Tekerlekli Sandalye</option>
                    <option value="Akülü Tekerlekli Sandalye">Akülü Tekerlekli Sandalye</option>
                    <option value="Koltuk Değneği veya Yürüteç">Koltuk Değneği / Yürüteç</option>
                    <option value="Beyaz Baston (Görme Desteği)">Beyaz Baston / Görme Desteği</option>
                </select>
                ${!hasKey ? `<input type="password" id="apiKeyInput" placeholder="Groq API Key (gsk_...)" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-emerald-400 outline-none focus:border-emerald-500">` : `<div class="bg-slate-900/50 py-4 px-5 rounded-2xl border border-slate-800 flex items-center justify-center gap-2"><span class="text-xs text-emerald-400 font-medium">✅ Groq AI Hazır</span></div>`}
                <button data-action="submit-login" class="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all text-lg mt-4">Uygulamaya Başla</button>
            </div>
        </div>`;
    }

    function renderAnaliz() {
        return `<div class="min-h-screen bg-[#0f172a] text-white p-4 space-y-4 pb-24">
            <div class="glass rounded-3xl p-5 border border-white/10 mt-2">
                <h2 class="text-xl font-bold flex items-center gap-2"><i class="ph-fill ph-scan text-red-500"></i> AI Analizi</h2>
            </div>
            <div class="relative">
                <select id="locSelect" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm appearance-none outline-none focus:border-red-600">
                    <option value="">Konum Seçin...</option>
                    ${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}
                </select>
            </div>
            <div class="relative w-full h-[400px] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
                ${state.cameraActive ? '<video id="cameraVideo" class="w-full h-full object-cover" autoplay playsinline muted></video>' : (state.imageSource ? `<img src="${state.imageSource}" class="w-full h-full object-cover">` : '<div class="flex flex-col items-center justify-center h-full text-slate-500 gap-3"><i class="ph ph-camera text-4xl"></i><span class="text-xs italic">Fotoğraf Bekleniyor</span></div>')}
                ${state.cameraActive ? '<button data-action="take-photo" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-red-600 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all"><i class="ph-fill ph-camera text-2xl"></i></button>' : ''}
            </div>
            <div class="grid grid-cols-2 gap-3">
                <button data-action="${state.cameraActive?'stop-camera':'open-camera'}" class="glass rounded-2xl py-4 text-xs font-bold uppercase tracking-widest">${state.cameraActive?'Kapat':'Kamerayı Aç'}</button>
                <label class="glass rounded-2xl py-4 text-xs font-bold uppercase tracking-widest text-center cursor-pointer">Galeri<input type="file" accept="image/*" class="hidden" id="galleryInput"></label>
            </div>
            <button data-action="run-ai" class="w-full bg-red-600 hover:bg-red-700 py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm mt-2">✨ Analizi Başlat</button>
        </div>`;
    }

    async function runAI() {
        if (!state.selectedLoc || !state.imageSource) return alert("Lütfen önce konum seçin ve fotoğraf çekin!");
        state.showModal = true; state.aiLoading = true; render();
        
        try {
            const compressedImg = await resizeImage(state.imageSource, 800);
            const prompt = `Analiz yap: ${state.selectedLoc}. Kullanıcı: ${state.userProfile}. Fotoğraftaki fiziksel engelleri (rampa, basamak vb.) kısa ve net şekilde raporla.`;

            // DEĞİŞEN KRİTİK MODEL İSMİ BURADA: llama-3.2-11b-vision-preview (Veya 90b yerine stabil olan hangisiyse)
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.2-11b-vision-preview",
                    messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: compressedImg } }] }],
                    temperature: 0.5
                })
            });

            const data = await response.json();
            if (data.error) {
                state.aiResult = `<span class="text-red-400">Hata: ${data.error.message}</span>`;
            } else {
                let res = data.choices[0].message.content;
                res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white block mt-2">$1</strong>');
                res = res.replace(/\* (.*?)/g, '<li class="ml-4 list-disc text-slate-300 py-0.5">$1</li>');
                state.aiResult = `<div class="text-left">${res}</div>`;
            }
        } catch (e) { state.aiResult = `<span class="text-red-400">Sistem hatası: ${e.message}</span>`; }
        state.aiLoading = false; render();
    }

    function renderModal() {
        if (!state.showModal) return "";
        return `<div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fade-in"><div class="bg-slate-800 border border-slate-700 rounded-[2.5rem] p-7 w-full max-w-sm shadow-2xl overflow-hidden relative"><h3 class="font-bold text-white text-lg mb-4 flex items-center gap-2"><i class="ph-fill ph-robot text-red-500"></i> AI Raporu</h3><div class="text-xs leading-relaxed text-slate-200 bg-slate-900/50 p-5 rounded-2xl max-h-80 overflow-y-auto mb-6 border border-white/5 shadow-inner">${state.aiLoading ? '<div class="flex flex-col items-center gap-4 py-8"><div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div><p class="animate-pulse">Görsel işleniyor...</p></div>' : state.aiResult}</div>${!state.aiLoading ? `<button data-action="close-modal" class="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Kapat</button>` : ''}</div></div>`;
    }

    function render() {
        app.innerHTML = (state.tab === "giris" ? renderGiris() : renderAnaliz()) + renderModal();
        if (state.cameraActive && state.tab === "analiz") startVideo();
    }

    async function startVideo() {
        const v = document.getElementById("cameraVideo");
        if (v && !window.stream) {
            try { window.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); v.srcObject = window.stream; } 
            catch (e) { alert("Kamera açılamadı."); state.cameraActive = false; render(); }
        }
    }

    app.addEventListener("click", e => {
        const btn = e.target.closest("[data-action]"); if (!btn) return;
        const act = btn.dataset.action;
        if (act === "submit-login") {
            const name = document.getElementById("userNameInput").value;
            const key = document.getElementById("apiKeyInput")?.value;
            if (name.length < 2) return alert("Lütfen isminizi girin.");
            if (key) { GROQ_API_KEY = key; localStorage.setItem("groq_api_key", key); }
            if (!GROQ_API_KEY) return alert("API Key gerekli!");
            state.userName = name; state.tab = "analiz"; render();
        }
        if (act === "open-camera") { state.cameraActive = true; render(); }
        if (act === "stop-camera") { state.cameraActive = false; if(window.stream) window.stream.getTracks().forEach(t=>t.stop()); window.stream = null; render(); }
        if (act === "take-photo") {
            const video = document.getElementById("cameraVideo");
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            state.imageSource = canvas.toDataURL("image/jpeg");
            state.cameraActive = false; if(window.stream) window.stream.getTracks().forEach(t=>t.stop()); window.stream = null; render();
        }
        if (act === "run-ai") runAI();
        if (act === "close-modal") { state.showModal = false; render(); }
    });

    app.addEventListener("change", e => {
        if (e.target.id === "locSelect") state.selectedLoc = e.target.value;
        if (e.target.id === "galleryInput") {
            const reader = new FileReader();
            reader.onload = ev => { state.imageSource = ev.target.result; render(); };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    render();
})();