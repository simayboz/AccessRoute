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
                // Groq tam base64 istiyor (data:image/jpeg;base64, kısmı dahil)
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        });
    }

    function renderGiris() {
        const hasKey = (GROQ_API_KEY && GROQ_API_KEY.length > 5);
        return `<div class="flex flex-col items-center justify-center h-screen space-y-10 text-center px-10 animate-fade-in">
            <h1 class="text-5xl font-extrabold text-white tracking-tighter">Access<span class="text-red-500">Route</span></h1>
            <div class="w-full max-w-sm space-y-4">
                <input type="text" id="userNameInput" value="${state.userName}" placeholder="Adınız" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-white shadow-inner outline-none">
                <select id="userProfileInput" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-slate-300 appearance-none shadow-inner outline-none">
                    <option value="Belirtilmedi">Hareketlilik Tercihi</option>
                    <option value="Manuel Tekerlekli Sandalye">Manuel Tekerlekli Sandalye</option>
                    <option value="Akülü Tekerlekli Sandalye">Akülü Tekerlekli Sandalye</option>
                    <option value="Koltuk Değneği veya Yürüteç">Koltuk Değneği / Yürüteç</option>
                    <option value="Beyaz Baston (Görme Desteği)">Beyaz Baston / Görme Desteği</option>
                </select>
                ${!hasKey ? `<input type="password" id="apiKeyInput" placeholder="Groq API Key (gsk_...)" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-emerald-400">` : `<div class="text-emerald-400 text-sm font-medium">✅ Groq AI Sistemi Hazır</div>`}
                <button data-action="submit-login" class="w-full bg-red-600 py-5 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-transform text-lg">Başla</button>
            </div>
        </div>`;
    }

    function renderAnaliz() {
        return `<div class="space-y-4 px-3 pt-6 animate-fade-in pb-24">
            <div class="glass rounded-3xl p-5 border border-white/10"><h1 class="text-xl font-bold text-white">Analiz Modu</h1></div>
            <select id="locSelect" class="w-full bg-slate-800 text-white p-4 rounded-2xl outline-none border border-slate-700">
                <option value="">Konum seçin...</option>
                ${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}
            </select>
            <div class="camera-box relative w-full h-[400px] bg-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                ${state.cameraActive ? '<video id="cameraVideo" class="w-full h-full object-cover" autoplay playsinline muted></video>' : (state.imageSource ? `<img src="${state.imageSource}" class="w-full h-full object-cover">` : '<div class="flex items-center justify-center h-full text-slate-500 italic">Fotoğraf Bekleniyor</div>')}
            </div>
            <div class="grid grid-cols-2 gap-3">
                <button data-action="${state.cameraActive?'take-photo':'open-camera'}" class="glass rounded-2xl py-4 font-bold text-white uppercase text-xs">${state.cameraActive?'Fotoğraf Çek':'Kamerayı Aç'}</button>
                <label class="glass rounded-2xl py-4 font-bold text-white text-center cursor-pointer text-xs uppercase">Galeri<input type="file" accept="image/*" class="hidden" id="galleryInput"></label>
            </div>
            <button data-action="run-ai" class="w-full bg-red-600 py-4 rounded-3xl font-bold text-white shadow-xl uppercase tracking-widest text-sm mt-2">✨ Groq ile Analiz Et</button>
        </div>`;
    }

    async function runAI() {
        if (!state.selectedLoc || !state.imageSource) return alert("Konum seçin ve fotoğraf çekin!");
        state.showModal = true; state.aiLoading = true; render();
        
        try {
            const compressedImg = await resizeImage(state.imageSource, 800);
            const prompt = `Sen İYTE kampüsü için bir erişilebilirlik uzmanısın. Kullanıcı Profili: ${state.userProfile}. Fotoğraftaki fiziksel engelleri (basamak, rampa, zemin vb.) kısa ve net bir dille madde madde analiz et.`;

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    model: "llama-3.2-90b-vision-preview",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                { type: "image_url", image_url: { url: compressedImg } }
                            ]
                        }
                    ],
                    temperature: 0.5,
                    max_tokens: 1024
                })
            });

            const data = await response.json();

            if (data.error) {
                state.aiResult = `❌ Groq Hatası: ${data.error.message}`;
            } else if (data.choices && data.choices[0]) {
                let resultText = data.choices[0].message.content;
                resultText = resultText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white block mt-2 mb-1">$1</strong>');
                resultText = resultText.replace(/\* (.*?)/g, '<li class="ml-4 list-disc text-slate-300 py-0.5">$1</li>');
                state.aiResult = `<div class="space-y-1 text-left">${resultText}</div>`;
            } else {
                state.aiResult = "⚠️ Analiz yapılamadı.";
            }
        } catch (error) {
            state.aiResult = `❌ Sistem Hatası: ${error.message}`;
        }
        state.aiLoading = false;
        render();
    }

    function renderModal() {
        if (!state.showModal) return "";
        return `<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md"><div class="bg-slate-800 border border-slate-700 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl relative"><h3 class="font-bold text-white text-lg mb-4">AI Kararı</h3><div class="text-xs leading-relaxed text-slate-200 bg-slate-900 p-4 rounded-xl max-h-60 overflow-y-auto mb-6">${state.aiLoading ? 'Analiz ediliyor...' : state.aiResult}</div>${!state.aiLoading ? `<button data-action="close-modal" class="w-full py-3 bg-white text-slate-900 rounded-xl font-bold">Kapat</button>` : ''}</div></div>`;
    }

    function render() {
        let content = state.tab === "giris" ? renderGiris() : renderAnaliz();
        app.innerHTML = content + renderModal();
        if (state.cameraActive && state.tab === "analiz") startVideo();
    }

    async function startVideo() {
        const v = document.getElementById("cameraVideo");
        if (v && !window.stream) {
            try { window.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); v.srcObject = window.stream; } 
            catch (e) { alert("Kamera hatası!"); state.cameraActive = false; render(); }
        }
    }

    app.addEventListener("click", e => {
        const btn = e.target.closest("[data-action]"); if (!btn) return;
        const act = btn.dataset.action;
        if (act === "submit-login") {
            const name = document.getElementById("userNameInput").value;
            const profile = document.getElementById("userProfileInput").value;
            const key = document.getElementById("apiKeyInput")?.value;
            if (name.length < 2) return alert("İsim giriniz");
            localStorage.setItem("userName", name);
            localStorage.setItem("userProfile", profile);
            if (key) { GROQ_API_KEY = key; localStorage.setItem("groq_api_key", key); }
            state.userName = name; state.userProfile = profile; state.tab = "analiz"; render();
        }
        if (act === "open-camera") { state.cameraActive = true; render(); }
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