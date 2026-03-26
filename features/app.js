(function () {
    const DEFAULT_GEMINI_KEY = ""; 

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

    let GEMINI_API_KEY = localStorage.getItem("gemini_api_key") || DEFAULT_GEMINI_KEY;
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
        selectedLoc: "", imageSource: null, cameraActive: false, geminiLoading: false, 
        geminiResult: "", showModal: false, customQuestion: "", comments: []
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

    function render() {
        if (state.tab === "giris") {
            app.innerHTML = `
                <div class="flex flex-col items-center justify-center h-screen space-y-10 text-center px-10">
                    <h1 class="text-5xl font-extrabold text-white tracking-tighter">Access<span class="text-red-500">Route</span></h1>
                    <div class="w-full max-w-sm space-y-4">
                        <input type="text" id="userNameInput" value="${state.userName}" placeholder="Adınız" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-white">
                        <input type="password" id="apiKeyInput" placeholder="Gemini API Key" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-emerald-400">
                        <button id="loginBtn" class="w-full bg-red-600 py-5 rounded-2xl font-bold text-white shadow-lg">Başla</button>
                    </div>
                </div>`;
            document.getElementById("loginBtn").onclick = () => {
                state.userName = document.getElementById("userNameInput").value;
                const key = document.getElementById("apiKeyInput").value;
                if (key) { GEMINI_API_KEY = key; localStorage.setItem("gemini_api_key", key); }
                state.tab = "analiz"; render();
            };
        } else if (state.tab === "analiz") {
            app.innerHTML = `
                <div class="space-y-4 px-3 pt-6 pb-24">
                    <div class="glass rounded-2xl p-4 border border-white/10">
                        <select id="locSelect" class="w-full bg-slate-800 text-white p-3 rounded-xl">
                            <option value="">Konum seçin...</option>
                            ${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}
                        </select>
                    </div>
                    <div class="camera-box relative w-full h-[400px] bg-slate-800 rounded-3xl overflow-hidden">
                        ${state.cameraActive ? '<video id="cameraVideo" class="w-full h-full object-cover" autoplay playsinline muted></video>' : (state.imageSource ? `<img src="${state.imageSource}" class="w-full h-full object-cover">` : '<div class="flex items-center justify-center h-full text-slate-500 italic">Fotoğraf Bekleniyor</div>')}
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <button id="camBtn" class="glass rounded-2xl py-4 text-xs font-bold text-white">${state.cameraActive ? 'Fotoğraf Çek' : 'Kamerayı Aç'}</button>
                        <label class="glass rounded-2xl py-4 text-xs font-bold text-white text-center cursor-pointer">Galeri<input type="file" accept="image/*" class="hidden" id="galleryInput"></label>
                    </div>
                    <button id="runAiBtn" class="w-full bg-red-600 py-4 rounded-3xl font-bold text-white shadow-xl mt-2 uppercase tracking-widest">✨ AI Analizi Başlat</button>
                </div>
                ${state.showModal ? `
                    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
                        <div class="bg-slate-800 border border-slate-700 rounded-[2rem] p-6 w-full max-w-sm">
                            <h3 class="font-bold text-white text-lg mb-4">AI Kararı</h3>
                            <div class="text-xs text-slate-200 bg-slate-900 p-4 rounded-xl max-h-60 overflow-y-auto mb-6">
                                ${state.geminiLoading ? 'Analiz ediliyor...' : state.geminiResult}
                            </div>
                            ${!state.geminiLoading ? '<button id="closeModal" class="w-full py-3 bg-white text-slate-900 rounded-xl font-bold">Kapat</button>' : ''}
                        </div>
                    </div>` : ''}
            `;

            // Event listener'ları manuel bağlama (En garantisi bu!)
            document.getElementById("locSelect").onchange = (e) => state.selectedLoc = e.target.value;
            
            document.getElementById("camBtn").onclick = async () => {
                if (!state.cameraActive) {
                    state.cameraActive = true; render();
                    const v = document.getElementById("cameraVideo");
                    window.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                    v.srcObject = window.stream;
                } else {
                    const video = document.getElementById("cameraVideo");
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
                    canvas.getContext("2d").drawImage(video, 0, 0);
                    state.imageSource = canvas.toDataURL("image/jpeg");
                    state.cameraActive = false;
                    window.stream.getTracks().forEach(t => t.stop());
                    render();
                }
            };

            document.getElementById("galleryInput").onchange = (e) => {
                const reader = new FileReader();
                reader.onload = ev => { state.imageSource = ev.target.result; render(); };
                reader.readAsDataURL(e.target.files[0]);
            };

            if(document.getElementById("closeModal")) document.getElementById("closeModal").onclick = () => { state.showModal = false; render(); };

            document.getElementById("runAiBtn").onclick = runAI;
        }
    }

    async function runAI() {
        if (!state.selectedLoc) return alert("Lütfen önce bir konum seçin!");
        if (!state.imageSource) return alert("Lütfen önce bir fotoğraf çekin veya galeriden seçin!");
        
        state.showModal = true; state.geminiLoading = true; render();
        
        try {
            const compressedImg = await resizeImage(state.imageSource, 800);
            const base64Data = compressedImg.split(',')[1];
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: "Görseldeki erişilebilirlik engellerini maddeleyerek açıkla." }, { inline_data: { mime_type: "image/jpeg", data: base64Data } }] }] })
            });
            const data = await response.json();
            if (data.error) {
                state.geminiResult = `Hata: ${data.error.message}`;
            } else {
                state.geminiResult = data.candidates[0].content.parts[0].text;
            }
        } catch (e) {
            state.geminiResult = `Bağlantı Hatası: ${e.message}`;
        }
        state.geminiLoading = false; render();
    }

    render();
})();