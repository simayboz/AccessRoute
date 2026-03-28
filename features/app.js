(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyC1zUYmKOTfjwSqYkoDUCSq73I4FPdp7yA",
        authDomain: "accessroute-iyte.firebaseapp.com",
        projectId: "accessroute-iyte",
        storageBucket: "accessroute-iyte.firebasestorage.app",
        messagingSenderId: "369877736663",
        appId: "1:369877736663:web:34f28c80313bb3f71b6492"
    };
    
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    let GEMINI_API_KEY = localStorage.getItem("gemini_api_key") || "";
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

    const STATIC_COMMENTS = [
        { locId: "chem", user: "Zülal", profile: "Manuel Tekerlekli Sandalye", photo: "", rating: 3, text: "Laboratuvar girişindeki rampa iyi ama koridor kapıları çok ağır. Tek başıma açarken zorlanıyorum.", date: "26 Mar 2026" },
        { locId: "lib", user: "Elif", profile: "Akülü Tekerlekli Sandalye", photo: "", rating: 5, text: "Kampüsün tartışmasız en erişilebilir binası. Asansörler geniş ve otomatik kapılar sorunsuz çalışıyor.", date: "27 Mar 2026" },
        { locId: "fak_fen", user: "Burak", profile: "Akülü Tekerlekli Sandalye", photo: "", rating: 2, text: "⚠️ DİKKAT: MBG çevresindeki inşaattan dolayı buradaki rampalar 21-28 Mar günleri kapalı. Mimarlık'tan ringe binin.", date: "20 Mar 2026" },
        { locId: "cafe", user: "Mert", profile: "Manuel Tekerlekli Sandalye", photo: "", rating: 4, text: "Girişteki rampa güzel fakat öğle arası turnikeler çok dar kalıyor. Güvenlikten kenar kapıyı açmasını istemek gerekiyor.", date: "28 Mar 2026" },
        { locId: "koy_yokusu", user: "Betül", profile: "Koltuk Değneği veya Yürüteç", rating: 2, photo: "", text: "Zemin maalesef çok bozuk. Özellikle yağmurlu günlerde koltuk değneğiyle inmek tehlikeli olabiliyor.", date: "25 Mar 2026" }
    ];

    const state = {
        tab: "giris", userName: STORED_USER_NAME, userProfile: STORED_USER_PROFILE,
        selectedLoc: "", imageSource: null, cameraActive: false, aiLoading: false, 
        aiResult: "", showModal: false, customQuestion: "", fullscreenImgSrc: null,
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
            "Fiziksel Destek İhtiyacı Yok": { style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "ph-person-arms-spread" },
            "Belirtilmedi": { style: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: "ph-user" }
        };
        const badge = badges[profile] || badges["Belirtilmedi"];
        return `<span class="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border ${badge.style}"><i class="ph-fill ${badge.icon}"></i> ${profile}</span>`;
    }

    function renderGiris() {
        const hasKey = (GEMINI_API_KEY && GEMINI_API_KEY.length > 5);
        return `<div class="flex flex-col items-center justify-center min-h-screen space-y-10 text-center px-10 animate-fade-in bg-[#0f172a]">
            <div class="relative w-32 h-32 flex items-center justify-center">
                <div class="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-20"></div>
                <div class="relative z-10 w-full h-full rounded-full bg-slate-900 border-4 border-red-600/30 flex items-center justify-center shadow-2xl">
                    <i class="ph-fill ph-map-pin text-5xl text-red-500"></i>
                </div>
            </div>
            <div class="space-y-2">
                <h1 class="text-5xl font-extrabold text-white tracking-tighter">Access<span class="text-red-500">Route</span></h1>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">İzmir Yüksek Teknoloji Enstitüsü</p>
            </div>
            <div class="w-full max-w-sm space-y-4">
                <input type="text" id="userNameInput" value="${state.userName}" placeholder="Adınız Soyadınız" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-white outline-none focus:border-red-600 shadow-inner">
                <select id="userProfileInput" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-slate-300 appearance-none outline-none focus:border-red-600">
                    <option value="Belirtilmedi" ${state.userProfile === 'Belirtilmedi' ? 'selected' : ''}>Hareketlilik Tercihi</option>
                    <option value="Manuel Tekerlekli Sandalye" ${state.userProfile === 'Manuel Tekerlekli Sandalye' ? 'selected' : ''}>Manuel Tekerlekli Sandalye</option>
                    <option value="Akülü Tekerlekli Sandalye" ${state.userProfile === 'Akülü Tekerlekli Sandalye' ? 'selected' : ''}>Akülü Tekerlekli Sandalye</option>
                    <option value="Koltuk Değneği veya Yürüteç" ${state.userProfile === 'Koltuk Değneği veya Yürüteç' ? 'selected' : ''}>Koltuk Değneği / Yürüteç</option>
                    <option value="Fiziksel Destek İhtiyacı Yok" ${state.userProfile === 'Fiziksel Destek İhtiyacı Yok' ? 'selected' : ''}>Fiziksel Destek İhtiyacı Yok</option>
                </select>
                ${!hasKey ? `<input type="password" id="apiKeyInput" placeholder="Gemini API Key (AIza...)" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 px-6 text-emerald-400 outline-none focus:border-emerald-500">` : 
                `<div class="bg-slate-900/50 py-4 px-5 rounded-2xl border border-slate-800 flex flex-col items-center gap-2">
                    <span class="text-xs text-emerald-400 font-medium">✅ Gemini AI Aktif</span>
                    <button data-action="reset-key" class="text-[10px] text-rose-500 underline uppercase font-bold">Anahtarı Sıfırla</button>
                </div>`}
                <button data-action="submit-login" class="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all text-lg mt-4">Uygulamaya Başla</button>
            </div>
        </div>`;
    }

    function renderAnaliz() {
        return `<div class="min-h-screen bg-[#0f172a] text-white p-4 space-y-4 pb-28 animate-fade-in">
            <div class="glass rounded-3xl p-5 border border-white/10 mt-2">
                <h2 class="text-xl font-bold flex items-center gap-2"><i class="ph-fill ph-scan text-red-500"></i> AI Analizi</h2>
            </div>
            <select id="locSelect" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm appearance-none outline-none focus:border-red-600">
                <option value="">Konum Seçin...</option>
                ${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}
            </select>
            <div class="relative w-full h-[320px] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
                ${state.cameraActive ? '<video id="cameraVideo" class="w-full h-full object-cover" autoplay playsinline muted></video>' : (state.imageSource ? `<img src="${state.imageSource}" class="w-full h-full object-cover" data-action="open-fullscreen" data-src="${state.imageSource}">` : '<div class="flex flex-col items-center justify-center h-full text-slate-500 gap-3"><i class="ph ph-camera text-4xl"></i><span class="text-xs italic">Fotoğraf Bekleniyor</span></div>')}
                ${state.cameraActive ? '<button data-action="take-photo" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-red-600 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all"><i class="ph-fill ph-camera text-2xl"></i></button>' : ''}
            </div>
            <div class="grid grid-cols-2 gap-3">
                <button data-action="${state.cameraActive?'stop-camera':'open-camera'}" class="glass rounded-2xl py-4 text-[10px] font-bold uppercase tracking-widest">${state.cameraActive?'Kapat':'Kamera'}</button>
                <label class="glass rounded-2xl py-4 text-[10px] font-bold uppercase tracking-widest text-center cursor-pointer">Galeri<input type="file" accept="image/*" class="hidden" id="galleryInput"></label>
            </div>
            <input type="text" id="customQuestionInput" placeholder="Yapay zekaya özel soru sor..." value="${state.customQuestion}" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-red-600 shadow-inner">
            <button data-action="run-ai" class="w-full bg-red-600 hover:bg-red-700 py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm mt-2">✨ Analizi Başlat</button>
        </div>`;
    }

    function renderTopluluk() {
        return `<div class="min-h-screen bg-[#0f172a] text-white p-4 space-y-6 pb-28 animate-fade-in pt-6">
            <h2 class="text-xl font-bold flex items-center gap-2 px-2"><i class="ph-fill ph-users-three text-red-500"></i> Kampüs Sesi</h2>
            
            <div class="bg-slate-900 rounded-[2rem] p-5 shadow-2xl border border-slate-800">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm shadow-lg border border-red-500/50">${state.userName.substring(0,2).toUpperCase()}</div>
                    <span class="text-sm font-semibold text-white">Deneyimini Paylaş</span>
                </div>
                <div class="space-y-3">
                    <select id="newLocSelect" class="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-xs text-white appearance-none focus:border-red-600 outline-none">
                        <option value="">Konum Seç...</option>
                        ${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}
                    </select>
                    <div class="flex gap-3">
                        <label class="border-2 border-dashed border-slate-600 rounded-2xl w-20 h-24 flex flex-col items-center justify-center cursor-pointer overflow-hidden shrink-0 hover:border-red-500 transition-colors">
                            ${state.newCommentPhoto ? `<img src="${state.newCommentPhoto}" class="w-full h-full object-cover">` : '<i class="ph ph-camera text-xl text-slate-500"></i>'}
                            <input type="file" accept="image/*" class="hidden" id="newCommentPhotoInput">
                        </label>
                        <textarea id="newCommentText" class="flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs outline-none focus:border-red-600 resize-none text-white shadow-inner" placeholder="Düşüncelerini paylaş..."></textarea>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                        <div class="star-rating">
                            <input type="radio" id="star5" name="rating" value="5" /><label for="star5" class="ph-fill ph-star"></label>
                            <input type="radio" id="star4" name="rating" value="4" /><label for="star4" class="ph-fill ph-star"></label>
                            <input type="radio" id="star3" name="rating" value="3" /><label for="star3" class="ph-fill ph-star"></label>
                            <input type="radio" id="star2" name="rating" value="2" /><label for="star2" class="ph-fill ph-star"></label>
                            <input type="radio" id="star1" name="rating" value="1" /><label for="star1" class="ph-fill ph-star"></label>
                        </div>
                        <button data-action="add-new-comment" class="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all">Gönder</button>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                ${IYTE_LOCATIONS.map(loc => { 
                    const locComments = state.comments.filter(c => c.locId === loc.id); 
                    if (locComments.length === 0) return ""; 
                    return `<div class="space-y-3">
                        <h3 class="font-bold text-white text-sm pl-2 flex items-center gap-2"><div class="w-1.5 h-4 bg-red-500 rounded-full"></div> ${loc.title}</h3>
                        ${locComments.map(c => `
                            <div class="bg-slate-900 rounded-[1.5rem] p-4 flex gap-4 items-start shadow-xl border border-slate-800 animate-fade-in">
                                ${c.photo ? `<img src="${c.photo}" class="w-20 h-24 object-cover rounded-xl border border-slate-700 cursor-pointer" data-action="open-fullscreen" data-src="${c.photo}">` : `<div class="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-700"><i class="ph-fill ph-chat-circle-dots text-slate-600 text-2xl"></i></div>`}
                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between items-start">
                                        <div class="flex flex-col truncate gap-1">
                                            <span class="font-bold text-sm text-white">@${c.user}</span>
                                            ${getProfileBadge(c.profile)}
                                        </div>
                                        <span class="text-[9px] text-slate-500 shrink-0 font-medium">${c.date}</span>
                                    </div>
                                    <p class="text-xs text-slate-300 pt-2 leading-relaxed">${c.text}</p>
                                    <div class="text-[10px] text-amber-400 mt-1">${'⭐'.repeat(c.rating)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`; 
                }).join('')}
            </div>
        </div>`;
    }

    function renderTabBar() {
        if (state.tab === "giris") return "";
        const tabs = [{ id: "analiz", label: "Analiz", icon: "ph-scan" }, { id: "topluluk", label: "Topluluk", icon: "ph-chats" }];
        return `<nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[380px] bg-slate-900/90 backdrop-blur-xl rounded-2xl p-2 flex justify-around shadow-2xl z-50 border border-slate-700">
            ${tabs.map(t => `<button data-action="tab" data-id="${t.id}" class="flex-1 py-2.5 rounded-xl ${state.tab===t.id?'bg-slate-800 text-white shadow-inner border border-slate-700':'text-slate-500'} flex flex-col items-center gap-1 transition-all active:scale-95"><i class="${state.tab===t.id ? 'ph-fill' : 'ph'} ${t.icon} text-2xl ${state.tab===t.id?'text-red-500':''}"></i><span class="text-[9px] font-bold uppercase tracking-widest">${t.label}</span></button>`).join('')}
        </nav>`;
    }

    function renderModal() {
        if (!state.showModal) return "";
        return `<div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md animate-fade-in">
            <div class="bg-slate-800 border border-slate-700 rounded-[2.5rem] p-7 w-full max-w-sm shadow-2xl relative">
                <h3 class="font-bold text-white text-lg mb-4 flex items-center gap-2"><i class="ph-fill ph-robot text-red-500"></i> AI Raporu</h3>
                <div class="text-xs leading-relaxed text-slate-200 bg-slate-900/80 p-5 rounded-2xl max-h-80 overflow-y-auto mb-6 border border-white/5 shadow-inner">
                    ${state.aiLoading ? '<div class="flex flex-col items-center gap-4 py-8"><div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div><p class="animate-pulse text-slate-400">Görsel, Profil ve Yorumlar İşleniyor...</p></div>' : state.aiResult}
                </div>
                ${!state.aiLoading ? `<button data-action="close-modal" class="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Kapat</button>` : ''}
            </div>
        </div>`;
    }

    function renderFullscreenImage() {
        if (!state.fullscreenImgSrc) return "";
        return `<div class="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-fade-in" data-action="close-fullscreen">
            <img src="${state.fullscreenImgSrc}" class="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10">
        </div>`;
    }

    function render() {
        let content = state.tab === "giris" ? renderGiris() : (state.tab === "analiz" ? renderAnaliz() : renderTopluluk());
        app.innerHTML = content + renderModal() + renderFullscreenImage() + renderTabBar();
        if (state.cameraActive && state.tab === "analiz") startVideo();
    }

    async function startVideo() {
        const v = document.getElementById("cameraVideo");
        if (v && !window.stream) {
            try { 
                window.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); 
                v.srcObject = window.stream; 
            } catch (e) { 
                alert("Kamera açılamadı."); 
                state.cameraActive = false; 
                render(); 
            }
        }
    }

    async function addNewComment() {
        const locId = document.getElementById("newLocSelect").value;
        const text = state.newCommentText.trim();
        const rating = state.newCommentRating;
        const photo = state.newCommentPhoto;
        
        if (!locId || !text || rating === 0) return alert("Lütfen konum, yorum ve puan seçin!");
        
        let finalPhoto = ""; 
        if (photo) finalPhoto = await resizeImage(photo, 600);
        
        const now = new Date();
        const formattedDate = `${now.getDate()} ${["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][now.getMonth()]} ${now.getFullYear()}`;
        
        db.collection("comments").add({ 
            locId: locId, user: state.userName, profile: state.userProfile, photo: finalPhoto, 
            rating: rating, text: text, date: formattedDate, timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        }).then(() => { 
            state.newCommentPhoto = null; state.newCommentText = ""; state.newCommentRating = 0; render(); 
        });
    }

    async function runAI() {
        if (!state.selectedLoc || !state.imageSource) return alert("Önce konum seçin ve fotoğraf çekin!");
        state.showModal = true; state.aiLoading = true; render();
        
        try {
            const compressedImg = await resizeImage(state.imageSource, 800);
            const base64Data = compressedImg.split(',')[1];
            
            const locInfo = IYTE_LOCATIONS.find(l => l.id === state.selectedLoc);
            const locTitle = locInfo ? locInfo.title : state.selectedLoc;

            const locComments = state.comments.filter(c => c.locId === state.selectedLoc);
            let commentsText = "";
            if (locComments.length > 0) {
                commentsText = `\nTopluluk Yorumları: ` + locComments.map(c => `"${c.text}"`).join(" | ");
            }

            const questionText = state.customQuestion ? `\nKullanıcının Özel Sorusu: "${state.customQuestion}"` : "";
            
            // YEPYENİ YAPILANDIRILMIŞ PROMPT
            const prompt = `Sen İYTE kampüsü için profesyonel ve empatik bir erişilebilirlik asistanısın.
Kullanıcı Adı: ${state.userName}
Konum: ${locTitle} 
Profil: ${state.userProfile}.${commentsText}${questionText} 

GÖREVİN (Aşağıdaki yapıyı ve emojileri KESİNLİKLE kullanarak yanıt ver):

👋 **Merhaba ${state.userName},**
(Buraya samimi bir giriş ve fotoğrafın genel durumu hakkında 1-2 cümle yaz)

🔍 **Fiziksel Analiz:**
(Fotoğraftaki eğim, zemin, korkuluk, basamak gibi detayları 2-3 madde ile profesyonelce incele)

💬 **Kampüsün Sesi:**
(Eğer topluluk yorumları verilmişse, onları tek tek saymadan genel bir özet çıkararak yaz. "Öğrenciler genel olarak..." gibi.)

🎯 **Sana Özel Tavsiyem:**
(Kullanıcının "${state.userProfile}" profiline KESİN OLARAK uygun, net bir güvenlik veya rahatlık tavsiyesi ver.)

${state.customQuestion ? `❓ **Sorunun Yanıtı:**\n(Kullanıcının sorduğu "${state.customQuestion}" sorusunu doğrudan yanıtla.)` : ''}`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: "image/jpeg", data: base64Data } }
                        ]
                    }]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                state.aiResult = `<span class="text-red-400">API Hatası: ${data.error?.message || 'Bilinmeyen hata'}</span>`;
            } else if (data.candidates && data.candidates.length > 0) {
                let res = data.candidates[0].content.parts[0].text;
                // Kalın yazıları ve listeleri stilize et
                res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white block mt-3 mb-1">$1</strong>');
                res = res.replace(/\* (.*?)/g, '<li class="ml-4 list-disc text-slate-300 py-0.5">$1</li>');
                state.aiResult = `<div class="text-left space-y-2">${res}</div>`;
            } else {
                state.aiResult = `<span class="text-red-400">Hata: Model cevap üretmedi.</span>`;
            }
        } catch (e) { 
            state.aiResult = `<span class="text-red-400">Sistem hatası: ${e.message}</span>`; 
        }
        state.aiLoading = false; render();
    }

    app.addEventListener("click", e => {
        const btn = e.target.closest("[data-action]"); if (!btn) return;
        const act = btn.dataset.action;
        
        if (act === "reset-key") { localStorage.removeItem("gemini_api_key"); GEMINI_API_KEY = ""; render(); }
        if (act === "tab") { state.tab = btn.dataset.id; render(); }
        if (act === "open-fullscreen") { state.fullscreenImgSrc = btn.dataset.src; render(); }
        if (act === "close-fullscreen") { state.fullscreenImgSrc = null; render(); }
        if (act === "add-new-comment") addNewComment();

        if (act === "submit-login") {
            const name = document.getElementById("userNameInput").value;
            const profile = document.getElementById("userProfileInput").value;
            const key = document.getElementById("apiKeyInput")?.value;
            if (name.length < 2) return alert("Lütfen isminizi girin.");
            if (key) { GEMINI_API_KEY = key; localStorage.setItem("gemini_api_key", key); }
            if (!GEMINI_API_KEY) return alert("Gemini API Key gerekli!");
            localStorage.setItem("userName", name); localStorage.setItem("userProfile", profile);
            state.userName = name; state.userProfile = profile; state.tab = "analiz"; render();
        }
        
        if (act === "open-camera") { state.cameraActive = true; render(); }
        if (act === "stop-camera") { 
            state.cameraActive = false; 
            if(window.stream) window.stream.getTracks().forEach(t=>t.stop()); window.stream = null; 
            render(); 
        }
        if (act === "take-photo") {
            const video = document.getElementById("cameraVideo");
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            state.imageSource = canvas.toDataURL("image/jpeg");
            state.cameraActive = false; 
            if(window.stream) window.stream.getTracks().forEach(t=>t.stop()); window.stream = null; 
            render();
        }
        if (act === "run-ai") runAI();
        if (act === "close-modal") { state.showModal = false; render(); }
    });

    app.addEventListener("input", e => {
        if (e.target.id === "customQuestionInput") state.customQuestion = e.target.value;
        if (e.target.id === "newCommentText") state.newCommentText = e.target.value; 
    });

    app.addEventListener("change", e => {
        if (e.target.name === "rating") state.newCommentRating = parseInt(e.target.value);
        if (e.target.id === "locSelect" || e.target.id === "newLocSelect") state.selectedLoc = e.target.value;
        if (e.target.id === "galleryInput" || e.target.id === "newCommentPhotoInput") {
            const reader = new FileReader();
            reader.onload = ev => { 
                if (e.target.id === "galleryInput") state.imageSource = ev.target.result;
                else state.newCommentPhoto = ev.target.result;
                render(); 
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    render();
})();