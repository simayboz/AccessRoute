(function () {
    // API Anahtarı ve Kalıcı Yorumları Hafızadan Çekme
    let GEMINI_API_KEY = localStorage.getItem("gemini_api_key");
    const savedComments = localStorage.getItem("iyte_comments");
    
    const IYTE_LOCATIONS = [
        { id: "lib", title: "Kütüphane Rampası" },
        { id: "cafe", title: "Yemekhane Girişi" },
        { id: "chem", title: "Kimya Müh. Yokuşu" },
        { id: "kyk_kiz", title: "KYK Kız Yurdu" },
        { id: "kyk_erkek", title: "KYK Erkek Yurdu" },
        { id: "hazirlik", title: "Hazırlık Binası" },
        { id: "opera_kafe", title: "Opera Kafe" },
        { id: "koy_yokusu", title: "Köy Yokuşu" },
        { id: "muh_bilgisayar", title: "Bilgisayar Mühendisliği" },
        { id: "muh_biyomuhendislik", title: "Biyomühendislik" },
        { id: "muh_cevre", title: "Çevre Mühendisliği" },
        { id: "muh_enerji", title: "Enerji Sistemleri Mühendisliği" },
        { id: "muh_elektronik", title: "Elektronik ve Haberleşme Mühendisliği" },
        { id: "muh_gida", title: "Gıda Mühendisliği" },
        { id: "muh_insaat", title: "İnşaat Mühendisliği" },
        { id: "muh_kimya", title: "Kimya Mühendisliği" },
        { id: "muh_makine", title: "Makine Mühendisliği" },
        { id: "muh_malzeme", title: "Malzeme Bilimi ve Mühendisliği" }
    ];

    const INITIAL_COMMENTS = savedComments ? JSON.parse(savedComments) : [
        { id: "c1", locId: "chem", user: "Zülal Y.", photo: "https://images.unsplash.com/photo-1618510050511-62778523318f?q=80&w=400", rating: 2, text: "Çok dik, tekerlekli sandalye ile tek başıma çıkamadım.", date: "18 Mart 2026" },
        { id: "c2", locId: "cafe", user: "Ahmet K.", photo: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=400", rating: 4, text: "Rampa güzel ama kapı ağır, yardım gerekebilir.", date: "19 Mart 2026" }
    ];

    const state = {
        tab: "giris", userName: "", selectedLoc: "", imageSource: null,
        cameraActive: false, geminiLoading: false, geminiResult: "", showModal: false,
        comments: INITIAL_COMMENTS, newCommentPhoto: null, newCommentText: "", newCommentRating: 0
    };

    const app = document.getElementById("app");
    const fullscreenOverlay = document.getElementById("fullscreenOverlay");
    const fullscreenImage = document.getElementById("fullscreenImage");

    // Tam Ekran Fonksiyonları (Global Alanda Kalmalılar)
    window.openFullscreen = function (imageSrc) {
        if (!imageSrc) return;
        fullscreenImage.src = imageSrc;
        fullscreenOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Kaydırmayı kapat
    }

    window.closeFullscreen = function () {
        fullscreenOverlay.classList.remove("active");
        fullscreenImage.src = "";
        document.body.style.overflow = "auto"; // Kaydırmayı aç
    }

    function renderGiris() {
        return `
            <div class="flex flex-col items-center justify-center h-screen space-y-6 text-center -mt-10">
                <img src="https://upload.wikimedia.org/wikipedia/tr/0/08/Izmir_Yuksek_Teknoloji_Enstitusu_Logo.png" class="h-24 w-24 mb-4 opacity-90">
                <div class="iyte-red p-5 rounded-3xl shadow-2xl w-full max-w-xs">
                    <h1 class="text-3xl font-black italic text-white">AccessRoute</h1>
                    <p class="text-sm text-red-100 mt-1">İYTE Engelsiz Kampüs Asistanı</p>
                </div>
                <div class="w-full max-w-xs space-y-4">
                    <input type="text" id="userNameInput" placeholder="Adınız Soyadınız" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-lg outline-none focus:border-red-500">
                    ${!GEMINI_API_KEY ? `<input type="password" id="apiKeyInput" placeholder="Gemini API Key (Zorunlu)" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-sm outline-none focus:border-red-500 text-emerald-400">` : `<div class="space-y-2"><p class="text-xs text-emerald-500 font-bold">✅ API Anahtarı Cihazda Kayıtlı</p><button data-action="reset-key" class="text-[10px] text-rose-400 underline">Anahtarı Sıfırla</button></div>`}
                    <button data-action="submit-login" class="w-full iyte-red py-4 rounded-xl font-black text-white shadow-lg active:scale-95 transition-transform text-lg mt-2">Uygulamaya Başla</button>
                </div>
            </div>`;
    }

    function renderAnaliz() {
        // Analiz kısmındaki fotoğraf için cursor-pointer ve openFullscreen ekledik
        const imgClass = state.imageSource ? "w-full h-full object-cover cursor-pointer" : "";
        const imgOnClick = state.imageSource ? `onclick="openFullscreen('${state.imageSource}')"` : "";

        return `
            <div class="space-y-4">
                <div class="iyte-red rounded-3xl p-6 shadow-xl flex justify-between items-center">
                    <div><h1 class="text-2xl font-black italic">ANALİZ</h1><p class="text-xs opacity-80">Hoş geldin, <span class="font-bold">${state.userName}</span></p></div>
                    <img src="https://upload.wikimedia.org/wikipedia/tr/0/08/Izmir_Yuksek_Teknoloji_Enstitusu_Logo.png" class="h-12 w-12 opacity-80">
                </div>
                <div class="glass rounded-2xl p-4">
                    <select id="locSelect" class="w-full bg-transparent border-b border-slate-600 py-2 text-sm outline-none text-slate-100 focus:border-red-500">
                        <option value="" class="bg-slate-900">Haritadan Konum Seç...</option>
                        ${IYTE_LOCATIONS.map(l => `<option value="${l.id}" class="bg-slate-900" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}
                    </select>
                </div>
                <div class="camera-box shadow-2xl">
                    ${state.cameraActive ? '<video id="cameraVideo" autoplay playsinline muted></video>' : 
                     (state.imageSource ? `<img src="${state.imageSource}" class="${imgClass}" ${imgOnClick} alt="Analiz Görüntüsü">` : 
                     '<div class="flex items-center justify-center h-full text-slate-500 text-sm italic">Fotoğraf Çekin...</div>')}
                    ${state.cameraActive ? '<button data-action="take-photo" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-red-600 p-4 rounded-full text-2xl shadow-lg">📸</button>' : ''}
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button data-action="${state.cameraActive?'stop-camera':'open-camera'}" class="glass rounded-xl py-4 text-xs font-bold uppercase ${state.cameraActive?'text-rose-400':'text-emerald-400'}">${state.cameraActive?'Kapat':'Kamerayı Aç'}</button>
                    <label class="glass rounded-xl py-4 text-xs font-bold uppercase text-sky-400 flex items-center justify-center cursor-pointer">Galeri<input type="file" accept="image/*" class="hidden" id="galleryInput"></label>
                </div>
                <button data-action="run-ai" class="w-full iyte-red py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95">✨ YAPAY ZEKA İLE ANALİZ ET</button>
            </div>`;
    }

    function renderTopluluk() {
        const addPhotoBtnClass = state.newCommentPhoto ? "border-emerald-500" : "border-slate-600";
        return `
            <div class="space-y-6 pt-2">
                <h2 class="text-xl font-bold border-b border-red-600 pb-2 inline-block">Topluluk Notları</h2>
                
                <div class="glass rounded-2xl p-5 space-y-4">
                    <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-full iyte-red flex items-center justify-center font-bold text-xs">${state.userName.substring(0,2).toUpperCase()}</div><span class="text-sm font-bold">${state.userName} olarak yorum yap</span></div>
                    <select id="newLocSelect" class="w-full bg-slate-800 rounded-xl p-3 text-sm text-slate-200"><option value="">Konum Seç...</option>${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}</select>
                    <div class="flex gap-3 items-center">
                        <label class="border-2 border-dashed ${addPhotoBtnClass} rounded-xl w-24 h-24 flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-slate-300 flex-shrink-0 overflow-hidden">${state.newCommentPhoto ? `<img src="${state.newCommentPhoto}" class="w-full h-full object-cover">` : '<span class="text-3xl">+</span><span class="text-[10px] mt-1">Fotoğraf</span>'}<input type="file" accept="image/*" class="hidden" id="newCommentPhotoInput"></label>
                        <textarea id="newCommentText" class="flex-1 bg-slate-800 rounded-xl p-3 text-sm h-24 outline-none resize-none" placeholder="Buradaki deneyimini anlat..."></textarea>
                    </div>
                    <div class="flex items-center justify-between gap-2 bg-slate-900/50 p-3 rounded-xl">
                        <div class="star-rating">
                            <input type="radio" id="star5" name="rating" value="5" /><label for="star5">★</label>
                            <input type="radio" id="star4" name="rating" value="4" /><label for="star4">★</label>
                            <input type="radio" id="star3" name="rating" value="3" /><label for="star3">★</label>
                            <input type="radio" id="star2" name="rating" value="2" /><label for="star2">★</label>
                            <input type="radio" id="star1" name="rating" value="1" /><label for="star1">★</label>
                        </div>
                        <button data-action="add-new-comment" class="iyte-red px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95">Paylaş</button>
                    </div>
                </div>

                <div class="space-y-5 pb-20">
                ${IYTE_LOCATIONS.map(loc => {
                    const locComments = state.comments.filter(c => c.locId === loc.id);
                    if (locComments.length === 0) return "";
                    // Topluluk yorumlarındaki fotoğraflara openFullscreen ekledik
                    return `<div class="space-y-3"><h3 class="font-bold text-red-400 text-sm pl-2 flex items-center gap-2">📍 ${loc.title}</h3>${locComments.map(c => `<div class="glass rounded-2xl p-4 flex gap-4 items-start shadow-md"><img src="${c.photo}" class="comment-photo border border-white/10" onclick="openFullscreen('${c.photo}')" alt="Kullanıcı Fotoğrafı"><div class="flex-1 space-y-1"><div class="flex justify-between items-center"><span class="font-bold text-sm text-slate-100">@${c.user}</span><span class="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded-md">${c.date}</span></div><p class="text-xs text-slate-300 leading-relaxed py-1">${c.text}</p><div class="text-xs font-bold text-amber-400">${'⭐'.repeat(c.rating)}${'<span class="text-slate-600">★</span>'.repeat(5-c.rating)}</div></div></div>`).join('')}</div>`;
                }).join('')}
                </div>
            </div>`;
    }

    function renderModal() {
        if (!state.showModal) return "";
        return `<div class="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md"><div class="bg-white text-slate-900 rounded-[32px] p-8 w-full shadow-2xl border-t-8 border-red-600"><h3 class="font-black italic text-red-700 text-xl mb-4 uppercase">🤖 AI Kararı</h3>${state.geminiLoading ? '<div class="flex flex-col items-center justify-center py-8 space-y-4"><div class="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div><p class="text-sm font-bold text-slate-500 animate-pulse">Analiz Ediliyor...</p></div>' : `<div class="text-sm leading-relaxed mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 max-h-60 overflow-y-auto">${state.geminiResult}</div>`}${!state.geminiLoading ? `<div class="space-y-3 mt-2"><button data-action="go-to-comments" class="w-full py-4 iyte-red text-white rounded-xl font-bold text-xs uppercase shadow-md">Bu Konuma Yorum Yap</button><button data-action="close-modal" class="w-full py-3 text-slate-500 text-xs font-bold uppercase">Kapat</button></div>` : ''}</div></div>`;
    }

    function renderTabBar() {
        if (state.tab === "giris") return "";
        const tabs = [{ id: "analiz", label: "Analiz", icon: "📷" }, { id: "topluluk", label: "Topluluk", icon: "💬" }];
        return `<nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[400px] glass rounded-full p-2 flex justify-around shadow-2xl z-50">${tabs.map(t => `<button data-action="tab" data-id="${t.id}" class="flex-1 py-3 rounded-full ${state.tab===t.id?'iyte-red text-white shadow-lg':'text-slate-400 hover:text-white'} font-bold text-[10px] uppercase flex flex-col items-center gap-1 transition-all"><span class="text-lg mb-1">${t.icon}</span>${t.label}</button>`).join('')}</nav>`;
    }

    function render() {
        let content = state.tab === "giris" ? renderGiris() : (state.tab === "analiz" ? renderAnaliz() : renderTopluluk());
        app.innerHTML = content + renderModal() + renderTabBar();
        if (state.cameraActive && state.tab === "analiz") startVideo();
    }

    // --- İŞLEVLER ---
    async function startVideo() {
        const v = document.getElementById("cameraVideo");
        if (v && !window.stream) {
            try { window.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); v.srcObject = window.stream; } 
            catch (e) { alert("Kamera izni alınamadı!"); state.cameraActive = false; render(); }
        }
    }

    async function runAI() {
        if (!state.selectedLoc || !state.imageSource) return alert("Lütfen haritadan konum seçin ve fotoğraf çekin!");
        state.showModal = true; state.geminiLoading = true; render();
        
        const locInfo = IYTE_LOCATIONS.find(l => l.id === state.selectedLoc);
        const locComments = state.comments.filter(c => c.locId === state.selectedLoc);
        const communityContext = locComments.map(c => `Puan: ${c.rating}/5, Yorum: "${c.text}"`).join(" | ");
        
        const prompt = `SİSTEM MESAJI: Sen uzman bir 'Engelsiz Yaşam ve Fiziksel Erişilebilirlik Danışmanı'sın. Amacın, üniversite öğrencilerinin (özellikle tekerlekli sandalye kullanan veya hareket kısıtlılığı olan bireylerin) kampüs içindeki fiziksel engelleri aşmalarına yardımcı olmaktır. Cevapların empatik, net ve doğrudan çözüm odaklı olmalıdır.

KULLANICI DURUMU:
- Kullanıcı Adı: ${state.userName}
- Bulunduğu Konum: ${locInfo.title}
- Bu Konumla İlgili Önceki Topluluk Yorumları: ${communityContext || 'Henüz yorum yok.'}

GÖREV: Ekli fotoğrafı detaylıca analiz et ve aşağıdaki 3 başlıklı formatta (kısa ve öz) yanıt ver:

1. GÖRSEL ANALİZİ: (Fotoğrafta ne görüyorsun? Bu bir yol/rampa mı yoksa ilgisiz bir obje/insan mı? İlgisizse sadece uyarı ver ve bitir).
2. ERİŞİLEBİLİRLİK DURUMU: (Eğer bu bir yolsa/rampaysa eğimi nasıl? Tekerlekli sandalye ile tek başına çıkılabilir mi?)
3. UZMAN TAVSİYESİ: (Önceki topluluk yorumlarını da dikkate alarak kullanıcıya ne tavsiye edersin? Yanında biri olmalı mı, yoksa alternatif bir yol mu aramalı?)`;

        try {
            const base64Data = state.imageSource.split(',')[1];
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64Data } }] }] })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            state.geminiResult = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } catch (error) {
            state.geminiResult = `❌ Hata: ${error.message}`;
            if(error.message.includes("API key")) { localStorage.removeItem("gemini_api_key"); GEMINI_API_KEY = null; }
        }
        state.geminiLoading = false; render();
    }

    function addNewComment() {
        const locId = document.getElementById("newLocSelect").value;
        const text = state.newCommentText.trim();
        const rating = state.newCommentRating;
        const photo = state.newCommentPhoto;
        
        if (!locId || !text || !photo || rating === 0) return alert("Konum, fotoğraf, yorum ve yıldız puanı eksiksiz olmalı!");

        const now = new Date();
        const formattedDate = `${now.getDate()} ${["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"][now.getMonth()]} ${now.getFullYear()}`;

        const newComment = { id: "c" + Date.now(), locId, user: state.userName, photo, rating, text, date: formattedDate };
        state.comments = [newComment, ...state.comments];
        
        localStorage.setItem("iyte_comments", JSON.stringify(state.comments));
        
        state.newCommentPhoto = null; state.newCommentText = ""; state.newCommentRating = 0;
        alert("Yorumun başarıyla topluluğa kaydedildi!");
        render();
    }

    // --- EVENT DİNLEYİCİLERİ ---
    app.addEventListener("click", e => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const act = btn.dataset.action;
        
        if (act === "reset-key") { localStorage.removeItem("gemini_api_key"); GEMINI_API_KEY = null; render(); return; }
        if (act === "submit-login") {
            const name = document.getElementById("userNameInput").value;
            const key = document.getElementById("apiKeyInput")?.value;
            if (name.length < 2) return alert("İsim giriniz");
            if (key) { GEMINI_API_KEY = key; localStorage.setItem("gemini_api_key", key); }
            if (!GEMINI_API_KEY) return alert("Lütfen API Anahtarı girin!");
            state.userName = name; state.tab = "analiz"; render();
        }
        if (act === "tab") { state.tab = btn.dataset.id; render(); }
        if (act === "open-camera") { state.cameraActive = true; render(); }
        if (act === "take-photo") {
            const video = document.getElementById("cameraVideo");
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            state.imageSource = canvas.toDataURL("image/jpeg");
            state.newCommentPhoto = state.imageSource;
            state.cameraActive = false; if(window.stream) window.stream.getTracks().forEach(t=>t.stop()); window.stream = null; render();
        }
        if (act === "run-ai") runAI();
        if (act === "close-modal") { state.showModal = false; render(); }
        if (act === "go-to-comments") { state.showModal = false; state.tab = "topluluk"; render(); }
        if (act === "add-new-comment") addNewComment();
    });

    app.addEventListener("change", e => {
        if (e.target.name === "rating") state.newCommentRating = parseInt(e.target.value);
        if (e.target.id === "locSelect") { state.selectedLoc = e.target.value; const n = document.getElementById("newLocSelect"); if(n) n.value = e.target.value; }
        if (e.target.id === "newLocSelect") state.selectedLoc = e.target.value;
        if (e.target.id === "galleryInput" && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = ev => { state.imageSource = ev.target.result; state.newCommentPhoto = ev.target.result; render(); };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target.id === "newCommentPhotoInput" && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = ev => { state.newCommentPhoto = ev.target.result; render(); };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    app.addEventListener("input", e => { if (e.target.id === "newCommentText") state.newCommentText = e.target.value; });

    render();
})();