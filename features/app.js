(function () {
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

    let GEMINI_API_KEY = localStorage.getItem("gemini_api_key");
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
        { locId: "chem", user: "Zülal", profile: "Manuel Tekerlekli Sandalye", photo: "", rating: 2, text: "Bölümün önündeki yokuş gerçekten çok dik. Tek başıma çıkmam mümkün olmadı.", date: "15 Mar 2026" },
        { locId: "lib", user: "Elif", profile: "Akülü Tekerlekli Sandalye", photo: "", rating: 5, text: "Kütüphaneye giriş çok rahat, asansörler ve rampalar standartlara uygun.", date: "16 Mar 2026" },
        { locId: "cafe", user: "Melis", profile: "Koltuk Değneği veya Yürüteç", photo: "", rating: 4, text: "Yemekhane girişi geniş ama kapılar biraz ağır, destek gerekebiliyor.", date: "17 Mar 2026" },
        { locId: "fak_fen", user: "Arda", profile: "Beyaz Baston (Görme Desteği)", photo: "", rating: 3, text: "Hissedilebilir yüzeyler bazı noktalarda kesiliyor, yenilenmesi iyi olur.", date: "18 Mar 2026" },
        { locId: "fak_mimarlik", user: "Selin", profile: "Fiziksel Destek İhtiyacı Yok", photo: "", rating: 4, text: "Mimarlık fakültesi girişindeki rampayı test ettim, gayet güvenli duruyor.", date: "19 Mar 2026" }
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
    }, (error) => console.error("Firestore Dinleme Hatası:", error));

    // YENİ: Gelişmiş Fotoğraf Sıkıştırma (Mobil için hayat kurtarır)
    function resizeImage(base64Str, maxWidth = 800) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7)); // %70 kalite, JPEG formatı (en hafifi)
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
        return `
            <div class="flex flex-col items-center justify-center h-screen space-y-6 text-center px-6 animate-fade-in -mt-4">
                <div class="relative w-28 h-28 mb-2"><div class="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-20"></div><img src="https://upload.wikimedia.org/wikipedia/tr/0/08/Izmir_Yuksek_Teknoloji_Enstitusu_Logo.png" class="relative z-10 w-full h-full drop-shadow-2xl"></div>
                <div class="iyte-red p-6 rounded-[2rem] shadow-2xl w-full max-w-xs border border-white/10">
                    <h1 class="text-3xl font-black text-white tracking-wide">Access<span class="text-red-200">Route</span></h1>
                    <p class="text-xs text-red-100/80 mt-2 font-medium tracking-widest uppercase">İYTE Engelsiz Kampüs</p>
                </div>
                <div class="w-full max-w-xs space-y-3">
                    <input type="text" id="userNameInput" value="${state.userName}" placeholder="Adınız Soyadınız" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-red-500 text-white shadow-inner">
                    <select id="userProfileInput" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-red-500 text-slate-200 appearance-none [&>option]:bg-slate-900 shadow-inner">
                        <option value="Belirtilmedi" ${state.userProfile === 'Belirtilmedi' ? 'selected' : ''}>Hareketlilik Tercihi (İsteğe Bağlı)</option>
                        <option value="Manuel Tekerlekli Sandalye" ${state.userProfile === 'Manuel Tekerlekli Sandalye' ? 'selected' : ''}>Manuel Tekerlekli Sandalye</option>
                        <option value="Akülü Tekerlekli Sandalye" ${state.userProfile === 'Akülü Tekerlekli Sandalye' ? 'selected' : ''}>Akülü Tekerlekli Sandalye</option>
                        <option value="Koltuk Değneği veya Yürüteç" ${state.userProfile === 'Koltuk Değneği veya Yürüteç' ? 'selected' : ''}>Koltuk Değneği / Yürüteç</option>
                        <option value="Beyaz Baston (Görme Desteği)" ${state.userProfile === 'Beyaz Baston (Görme Desteği)' ? 'selected' : ''}>Beyaz Baston / Görme Desteği</option>
                        <option value="Fiziksel Destek İhtiyacı Yok" ${state.userProfile === 'Fiziksel Destek İhtiyacı Yok' ? 'selected' : ''}>Fiziksel Destek İhtiyacım Yok</option>
                    </select>
                    ${!GEMINI_API_KEY ? `<input type="password" id="apiKeyInput" placeholder="Gemini API Key" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-red-500 text-emerald-400">` : `<div class="glass py-3 px-4 rounded-2xl flex justify-between items-center"><span class="text-xs text-emerald-400 font-medium">✅ API Hazır</span><button data-action="reset-key" class="text-[10px] text-rose-400 font-bold underline">Değiştir</button></div>`}
                    <button data-action="submit-login" class="w-full iyte-red py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-transform text-base mt-4">Uygulamaya Başla</button>
                </div>
            </div>`;
    }

    function renderAnaliz() {
        const imgClass = state.imageSource ? "w-full h-full object-cover cursor-pointer" : "";
        return `
            <div class="space-y-4 px-3 pt-6 animate-fade-in pb-8">
                <div class="glass rounded-3xl p-5 shadow-xl border border-white/10"><h1 class="text-xl font-bold tracking-wide flex items-center gap-2 text-white"><i class="ph-fill ph-scan text-red-500"></i> Analiz Modu</h1><p class="text-[10px] text-slate-400 mt-1">Hoş geldin, <span class="text-white">${state.userName}</span></p></div>
                <div class="glass rounded-2xl p-1 relative"><select id="locSelect" class="w-full bg-transparent border-none py-3 px-4 text-sm outline-none text-white appearance-none [&>option]:bg-slate-900"><option value="">Analiz için konum seçin...</option>${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}</select></div>
                <div class="camera-box shadow-2xl relative">
                    ${state.cameraActive ? '<video id="cameraVideo" class="w-full h-full object-cover" autoplay playsinline muted></video>' : (state.imageSource ? `<img src="${state.imageSource}" class="${imgClass}" data-action="open-fullscreen" data-src="${state.imageSource}">` : '<div class="flex flex-col items-center justify-center h-full text-slate-500 text-xs italic"><i class="ph ph-camera text-4xl mb-2"></i>Fotoğraf Bekleniyor</div>')}
                    ${state.cameraActive ? '<button data-action="take-photo" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-red-600 w-16 h-16 rounded-full text-2xl shadow-xl flex items-center justify-center"><i class="ph-fill ph-camera"></i></button>' : ''}
                </div>
                <div class="grid grid-cols-2 gap-3"><button data-action="${state.cameraActive?'stop-camera':'open-camera'}" class="glass rounded-xl py-3.5 text-xs font-bold text-white uppercase tracking-wider">${state.cameraActive?'Kapat':'Kamerayı Aç'}</button><label class="glass rounded-xl py-3.5 text-xs font-bold text-white uppercase tracking-wider text-center cursor-pointer">Galeri<input type="file" accept="image/*" class="hidden" id="galleryInput"></label></div>
                <input type="text" id="customQuestionInput" value="${state.customQuestion}" placeholder="Yapay zekaya özel bir sorun var mı?" class="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-xs outline-none text-slate-200 focus:border-red-500/50">
                <button data-action="run-ai" class="w-full iyte-red py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-transform uppercase tracking-widest text-sm">✨ AI Analizi Başlat</button>
            </div>`;
    }

    function renderTopluluk() {
        return `
            <div class="space-y-6 pt-6 px-3 animate-fade-in pb-24">
                <h2 class="text-xl font-bold flex items-center gap-2 text-white"><i class="ph-fill ph-users-three text-red-500"></i> Kampüs Sesi</h2>
                <div class="glass rounded-[2rem] p-5 shadow-2xl border border-white/5">
                    <div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-full iyte-red flex items-center justify-center font-bold text-sm">${state.userName.substring(0,2).toUpperCase()}</div><span class="text-sm font-semibold text-white">Deneyimini Paylaş</span></div>
                    <div class="space-y-3">
                        <select id="newLocSelect" class="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-xs text-white appearance-none [&>option]:bg-slate-900"><option value="">Konum Seç...</option>${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}</select>
                        <div class="flex gap-3"><label class="border-2 border-dashed border-slate-600 rounded-2xl w-20 h-24 flex flex-col items-center justify-center cursor-pointer overflow-hidden shrink-0">${state.newCommentPhoto ? `<img src="${state.newCommentPhoto}" class="w-full h-full object-cover">` : '<i class="ph ph-camera text-xl text-slate-500"></i><span class="text-[8px] mt-1 text-slate-500">Fotoğraf</span>'}<input type="file" accept="image/*" class="hidden" id="newCommentPhotoInput"></label><textarea id="newCommentText" class="flex-1 bg-black/20 border border-white/10 rounded-2xl p-3 text-xs outline-none resize-none text-white placeholder-slate-500" placeholder="Erişilebilirlik hakkında ne düşünüyorsun?"></textarea></div>
                        <div class="flex items-center justify-between mt-2">
                            <div class="star-rating">
                                <input type="radio" id="star5" name="rating" value="5" /><label for="star5" class="ph-fill ph-star"></label><input type="radio" id="star4" name="rating" value="4" /><label for="star4" class="ph-fill ph-star"></label><input type="radio" id="star3" name="rating" value="3" /><label for="star3" class="ph-fill ph-star"></label><input type="radio" id="star2" name="rating" value="2" /><label for="star2" class="ph-fill ph-star"></label><input type="radio" id="star1" name="rating" value="1" /><label for="star1" class="ph-fill ph-star"></label>
                            </div>
                            <button data-action="add-new-comment" class="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs active:scale-95 transition-transform">Gönder</button>
                        </div>
                    </div>
                </div>
                <div class="space-y-6">
                ${IYTE_LOCATIONS.map(loc => {
                    const locComments = state.comments.filter(c => c.locId === loc.id);
                    if (locComments.length === 0) return "";
                    return `<div class="space-y-3"><h3 class="font-bold text-white text-sm pl-2 flex items-center gap-2"><div class="w-1 h-3 bg-red-500 rounded-full"></div> ${loc.title}</h3>${locComments.map(c => `<div class="glass rounded-[1.5rem] p-4 flex gap-4 items-start shadow-md border border-white/5 animate-fade-in">${c.photo ? `<img src="${c.photo}" class="w-20 h-24 object-cover rounded-xl border border-white/10 cursor-pointer" data-action="open-fullscreen" data-src="${c.photo}">` : `<div class="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-white/5"><i class="ph-fill ph-chat-circle-dots text-slate-600 text-2xl"></i></div>`}<div class="flex-1 space-y-1 min-w-0"><div class="flex justify-between items-center"><div class="flex flex-col gap-1 truncate"><span class="font-bold text-sm text-white truncate">@${c.user}</span>${getProfileBadge(c.profile)}</div><span class="text-[9px] text-slate-500 bg-black/20 px-2 py-1 rounded-md shrink-0">${c.date}</span></div><p class="text-xs text-slate-300 leading-relaxed pt-1">${c.text}</p><div class="text-[10px] text-amber-400 font-bold">${'⭐'.repeat(c.rating)}</div></div></div>`).join('')}</div>`;
                }).join('')}
                </div>
            </div>`;
    }

    function renderModal() {
        if (!state.showModal) return "";
        return `<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in"><div class="bg-slate-800 border border-slate-700 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl relative"><h3 class="font-bold text-white text-lg mb-4 flex items-center gap-2"><i class="ph-fill ph-robot text-red-500 text-2xl"></i> AI Kararı</h3>${state.geminiLoading ? `<div class="py-12 flex flex-col items-center gap-4"><div class="ai-spinner w-12 h-12 bg-red-600/30"></div><p class="text-xs text-slate-400 animate-pulse">Analiz ediliyor...</p></div>` : `<div class="text-xs leading-relaxed text-slate-200 bg-black/20 p-4 rounded-xl max-h-60 overflow-y-auto mb-6">${state.geminiResult}</div>`}${!state.geminiLoading ? `<button data-action="close-modal" class="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase shadow-lg">Kapat</button>` : ''}</div></div>`;
    }

    function renderFullscreenImage() {
        if (!state.fullscreenImgSrc) return "";
        return `<div class="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-fade-in" data-action="close-fullscreen"><img src="${state.fullscreenImgSrc}" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"></div>`;
    }

    function renderTabBar() {
        if (state.tab === "giris") return "";
        const tabs = [{ id: "analiz", label: "Analiz", icon: "ph-scan" }, { id: "topluluk", label: "Topluluk", icon: "ph-chats" }];
        return `<nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[380px] glass rounded-2xl p-2 flex justify-around shadow-2xl z-50 border border-white/10">${tabs.map(t => `<button data-action="tab" data-id="${t.id}" class="flex-1 py-2 rounded-xl ${state.tab===t.id?'bg-white/10 text-white':'text-slate-500'} flex flex-col items-center gap-1 transition-all"><i class="${t.icon} text-2xl"></i><span class="text-[9px] font-bold uppercase tracking-widest">${t.label}</span></button>`).join('')}</nav>`;
    }

    function render() {
        let content = state.tab === "giris" ? renderGiris() : (state.tab === "analiz" ? renderAnaliz() : renderTopluluk());
        app.innerHTML = content + renderModal() + renderFullscreenImage() + renderTabBar();
        if (state.cameraActive && state.tab === "analiz") startVideo();
    }

    async function startVideo() {
        const v = document.getElementById("cameraVideo");
        if (v && !window.stream) {
            try { window.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); v.srcObject = window.stream; } 
            catch (e) { alert("Kamera hatası!"); state.cameraActive = false; render(); }
        }
    }

    async function runAI() {
        if (!state.selectedLoc || !state.imageSource) return alert("Konum seçin ve fotoğraf çekin!");
        state.showModal = true; state.geminiLoading = true; render();
        const locInfo = IYTE_LOCATIONS.find(l => l.id === state.selectedLoc);
        const locComments = state.comments.filter(c => c.locId === state.selectedLoc);
        const context = locComments.map(c => `${c.profile}: ${c.text}`).join(" | ");
        const prompt = `SİSTEM MESAJI: Sen İYTE kampüsündeki öğrencilere rehberlik eden uzman bir 'Erişilebilirlik Danışmanı'sın. Konum: ${locInfo.title}, Profil: ${state.userProfile}, Özel Soru: ${state.customQuestion || 'Yok'}, Topluluk Deneyimleri: ${context}. Fotoğrafı analiz et, madde işaretli ve nazikçe yanıtla.`;
        try {
            const compressedImg = await resizeImage(state.imageSource, 1000); // AI için 1000px yeterli
            const base64Data = compressedImg.split(',')[1];
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64Data } }] }] })
            });
            const data = await response.json();
            let resultText = data.candidates[0].content.parts[0].text;
            resultText = resultText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white block mt-2 mb-1">$1</strong>');
            resultText = resultText.replace(/\* (.*?)/g, '<li class="ml-4 list-disc text-slate-300 py-0.5">$1</li>');
            state.geminiResult = `<div class="space-y-1">${resultText}</div>`;
        } catch (error) { state.geminiResult = `❌ Hata: ${error.message}`; }
        state.geminiLoading = false; render();
    }

    async function addNewComment() {
        const locId = document.getElementById("newLocSelect").value;
        const text = state.newCommentText.trim();
        const rating = state.newCommentRating;
        const photo = state.newCommentPhoto;
        
        if (!locId || !text || rating === 0) return alert("Eksik bilgi!");
        
        // YENİ: Fotoğrafı kaydetmeden önce küçültüyoruz
        let finalPhoto = "";
        if (photo) {
            finalPhoto = await resizeImage(photo, 600); // 600px genişlik Firebase için idealdir
        }

        const now = new Date();
        const formattedDate = `${now.getDate()} ${["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][now.getMonth()]} ${now.getFullYear()}`;
        
        db.collection("comments").add({ 
            locId: locId, user: state.userName, profile: state.userProfile, photo: finalPhoto, 
            rating: rating, text: text, date: formattedDate, timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        })
        .then(() => { 
            state.newCommentPhoto = null; state.newCommentText = ""; state.newCommentRating = 0; 
            alert("Yorumun kaydedildi!"); 
            render(); 
        })
        .catch((error) => {
            alert("⚠️ Kayıt Hatası: " + error.message);
            console.error(error);
        });
    }

    app.addEventListener("click", e => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const act = btn.dataset.action;
        if (act === "reset-key") { localStorage.removeItem("gemini_api_key"); GEMINI_API_KEY = null; render(); }
        if (act === "submit-login") {
            const name = document.getElementById("userNameInput").value;
            const profile = document.getElementById("userProfileInput").value;
            const key = document.getElementById("apiKeyInput")?.value;
            if (name.length < 2) return alert("İsim giriniz");
            localStorage.setItem("userName", name); localStorage.setItem("userProfile", profile);
            state.userName = name; state.userProfile = profile;
            if (key) { GEMINI_API_KEY = key; localStorage.setItem("gemini_api_key", key); }
            if (!GEMINI_API_KEY) return alert("API Key girin!");
            state.tab = "analiz"; render();
        }
        if (act === "tab") { state.tab = btn.dataset.id; render(); }
        if (act === "open-camera") { state.cameraActive = true; render(); }
        if (act === "take-photo") {
            const video = document.getElementById("cameraVideo");
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            state.imageSource = canvas.toDataURL("image/jpeg"); state.newCommentPhoto = state.imageSource;
            state.cameraActive = false; if(window.stream) window.stream.getTracks().forEach(t=>t.stop()); window.stream = null; render();
        }
        if (act === "run-ai") runAI();
        if (act === "close-modal") { state.showModal = false; render(); }
        if (act === "add-new-comment") addNewComment();
        if (act === "delete-comment") { if (confirm("Yorumu sil?")) db.collection("comments").doc(btn.dataset.id).delete(); }
        if (act === "open-fullscreen") { state.fullscreenImgSrc = btn.dataset.src; render(); }
        if (act === "close-fullscreen") { state.fullscreenImgSrc = null; render(); }
    });

    app.addEventListener("change", e => {
        if (e.target.name === "rating") state.newCommentRating = parseInt(e.target.value);
        if (e.target.id === "locSelect" || e.target.id === "newLocSelect") state.selectedLoc = e.target.value;
        if (e.target.id === "galleryInput" || e.target.id === "newCommentPhotoInput") {
            const reader = new FileReader();
            reader.onload = ev => { state.imageSource = ev.target.result; state.newCommentPhoto = ev.target.result; render(); };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    app.addEventListener("input", e => { 
        if (e.target.id === "newCommentText") state.newCommentText = e.target.value; 
        if (e.target.id === "customQuestionInput") state.customQuestion = e.target.value;
    });

    render();
})();