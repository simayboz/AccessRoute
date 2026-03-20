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
        { id: "lib", title: "Kütüphane Rampası" }, { id: "cafe", title: "Yemekhane Girişi" },
        { id: "chem", title: "Kimya Müh. Yokuşu" }, { id: "kyk_kiz", title: "KYK Kız Yurdu" },
        { id: "kyk_erkek", title: "KYK Erkek Yurdu" }, { id: "hazirlik", title: "Hazırlık Binası" },
        { id: "opera_kafe", title: "Opera Kafe" }, { id: "koy_yokusu", title: "Köy Yokuşu" },
        { id: "muh_bilgisayar", title: "Bilgisayar Mühendisliği" }, { id: "muh_biyomuhendislik", title: "Biyomühendislik" },
        { id: "muh_cevre", title: "Çevre Mühendisliği" }, { id: "muh_enerji", title: "Enerji Sistemleri Mühendisliği" },
        { id: "muh_elektronik", title: "Elektronik ve Haberleşme Mühendisliği" }, { id: "muh_gida", title: "Gıda Mühendisliği" },
        { id: "muh_insaat", title: "İnşaat Mühendisliği" }, { id: "muh_kimya", title: "Kimya Mühendisliği" },
        { id: "muh_makine", title: "Makine Mühendisliği" }, { id: "muh_malzeme", title: "Malzeme Bilimi ve Mühendisliği" },
        { id: "fak_fen", title: "Fen Fakültesi" }, { id: "fak_mimarlik", title: "Mimarlık Fakültesi" }
    ];

    const state = {
        tab: "giris", userName: STORED_USER_NAME, userProfile: STORED_USER_PROFILE,
        selectedLoc: "", imageSource: null, cameraActive: false, geminiLoading: false, 
        geminiResult: "", showModal: false, customQuestion: "", fullscreenImgSrc: null,
        comments: [], newCommentPhoto: null, newCommentText: "", newCommentRating: 0
    };

    const app = document.getElementById("app");

    db.collection("comments").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        state.comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (state.tab === "topluluk") render(); 
    });

    // YENİ: Profil Rozetleri Oluşturucu
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
                <div class="relative w-28 h-28 mb-2">
                    <div class="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-20"></div>
                    <img src="https://upload.wikimedia.org/wikipedia/tr/0/08/Izmir_Yuksek_Teknoloji_Enstitusu_Logo.png" class="relative z-10 w-full h-full drop-shadow-2xl">
                </div>
                <div class="iyte-red p-6 rounded-[2rem] shadow-2xl w-full max-w-xs border border-white/10">
                    <h1 class="text-3xl font-black text-white tracking-wide">Access<span class="text-red-200">Route</span></h1>
                    <p class="text-xs text-red-100/80 mt-2 font-medium tracking-widest uppercase">İYTE Engelsiz Kampüs</p>
                </div>
                <div class="w-full max-w-xs space-y-3">
                    <div class="relative">
                        <i class="ph ph-user absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400"></i>
                        <input type="text" id="userNameInput" value="${state.userName}" placeholder="Adınız Soyadınız" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-red-500 focus:bg-white/10 transition-all text-white placeholder-slate-400 shadow-inner">
                    </div>
                    
                    <div class="relative">
                        <i class="ph ph-wheelchair absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 z-10"></i>
                        <select id="userProfileInput" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-red-500 focus:bg-white/10 transition-all text-slate-200 appearance-none [&>option]:bg-slate-900 shadow-inner">
                            <option value="Belirtilmedi" ${state.userProfile === 'Belirtilmedi' ? 'selected' : ''}>Hareketlilik Tercihi (İsteğe Bağlı)</option>
                            <option value="Manuel Tekerlekli Sandalye" ${state.userProfile === 'Manuel Tekerlekli Sandalye' ? 'selected' : ''}>Manuel Tekerlekli Sandalye</option>
                            <option value="Akülü Tekerlekli Sandalye" ${state.userProfile === 'Akülü Tekerlekli Sandalye' ? 'selected' : ''}>Akülü Tekerlekli Sandalye</option>
                            <option value="Koltuk Değneği veya Yürüteç" ${state.userProfile === 'Koltuk Değneği veya Yürüteç' ? 'selected' : ''}>Koltuk Değneği / Yürüteç</option>
                            <option value="Beyaz Baston (Görme Desteği)" ${state.userProfile === 'Beyaz Baston (Görme Desteği)' ? 'selected' : ''}>Beyaz Baston / Görme Desteği</option>
                            <option value="Fiziksel Destek İhtiyacı Yok" ${state.userProfile === 'Fiziksel Destek İhtiyacı Yok' ? 'selected' : ''}>Fiziksel Destek İhtiyacım Yok</option>
                        </select>
                        <i class="ph ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>

                    ${!GEMINI_API_KEY ? `
                    <div class="relative">
                        <i class="ph ph-key absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400"></i>
                        <input type="password" id="apiKeyInput" placeholder="Gemini API Key (Zorunlu)" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-red-500 focus:bg-white/10 transition-all text-emerald-400 placeholder-slate-400 shadow-inner">
                    </div>` : `
                    <div class="glass py-3 px-4 rounded-2xl flex justify-between items-center border-emerald-500/30 bg-emerald-500/5">
                        <span class="text-xs text-emerald-400 font-medium flex items-center gap-2"><i class="ph-fill ph-check-circle text-base"></i> API Anahtarı Hazır</span>
                        <button data-action="reset-key" class="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded bg-rose-500/10">Değiştir</button>
                    </div>`}
                    
                    <button data-action="submit-login" class="w-full iyte-red py-4 rounded-2xl font-bold text-white shadow-lg shadow-red-900/50 hover:shadow-red-900/80 active:scale-[0.98] transition-all text-base mt-4 flex items-center justify-center gap-2">
                        Uygulamaya Başla <i class="ph-bold ph-arrow-right"></i>
                    </button>
                </div>
            </div>`;
    }

    function renderAnaliz() {
        const imgClass = state.imageSource ? "w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500" : "";
        return `
            <div class="space-y-4 px-3 pt-6 animate-fade-in pb-8">
                <div class="glass rounded-3xl p-5 shadow-xl border border-white/10 flex justify-between items-center relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl"></div>
                    <div class="relative z-10">
                        <h1 class="text-xl font-bold tracking-wide flex items-center gap-2"><i class="ph-fill ph-scan text-red-500 text-2xl"></i> Analiz Modu</h1>
                        <p class="text-[10px] text-slate-400 mt-1">Merhaba, <span class="text-white font-medium">${state.userName}</span></p>
                    </div>
                </div>

                <div class="glass rounded-2xl p-1 relative">
                    <i class="ph-fill ph-map-pin absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 z-10"></i>
                    <select id="locSelect" class="w-full bg-transparent border-none py-3 pl-10 pr-4 text-sm outline-none text-white focus:ring-0 appearance-none [&>option]:bg-slate-900 cursor-pointer">
                        <option value="">Nereyi analiz ediyoruz?</option>
                        ${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}
                    </select>
                    <i class="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                </div>

                <div class="camera-box shadow-2xl relative group">
                    ${state.cameraActive ? '<video id="cameraVideo" class="w-full h-full object-cover" autoplay playsinline muted></video>' : 
                     (state.imageSource ? `<img src="${state.imageSource}" class="${imgClass}" data-action="open-fullscreen" data-src="${state.imageSource}" alt="Analiz Görüntüsü">` : 
                     '<div class="flex flex-col items-center justify-center h-full text-slate-400/60 text-sm gap-3"><i class="ph-thin ph-camera-plus text-5xl"></i><span>Görsel bekleniyor...</span></div>')}
                    
                    ${state.cameraActive ? '<button data-action="take-photo" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-red-600 w-16 h-16 rounded-full text-2xl shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><i class="ph-fill ph-camera"></i></button>' : ''}
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <button data-action="${state.cameraActive?'stop-camera':'open-camera'}" class="glass rounded-xl py-3.5 text-xs font-semibold flex items-center justify-center gap-2 ${state.cameraActive?'text-rose-400':'text-white hover:bg-white/5'} transition-colors">
                        <i class="ph-bold ${state.cameraActive?'ph-x':'ph-camera'} text-lg"></i> ${state.cameraActive?'Kapat':'Kamera'}
                    </button>
                    <label class="glass rounded-xl py-3.5 text-xs font-semibold flex items-center justify-center gap-2 text-white hover:bg-white/5 cursor-pointer transition-colors">
                        <i class="ph-bold ph-image text-lg text-sky-400"></i> Galeri
                        <input type="file" accept="image/*" class="hidden" id="galleryInput">
                    </label>
                </div>
                
                <div class="relative mt-2">
                    <i class="ph-fill ph-chat-teardrop-text absolute left-4 top-4 text-slate-400"></i>
                    <textarea id="customQuestionInput" placeholder="Yapay zekaya bu mekanla ilgili özel bir şey sor (İsteğe bağlı)" class="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none text-slate-200 focus:border-red-500/50 focus:bg-white/5 transition-all resize-none h-16 shadow-inner">${state.customQuestion}</textarea>
                </div>
                
                <button data-action="run-ai" class="w-full iyte-red py-4 rounded-2xl font-bold text-white shadow-lg shadow-red-900/40 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 tracking-wide uppercase mt-2">
                    <i class="ph-fill ph-sparkle text-lg"></i> AI ile Analiz Et
                </button>
            </div>`;
    }

    function renderTopluluk() {
        const addPhotoBtnClass = state.newCommentPhoto ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-slate-600/50 bg-black/20 text-slate-400 hover:border-slate-400";
        
        return `
            <div class="space-y-6 pt-6 px-3 animate-fade-in">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xl font-bold flex items-center gap-2"><i class="ph-fill ph-users-three text-red-500"></i> Kampüs Sesi</h2>
                </div>
                
                <div class="glass rounded-[2rem] p-5 shadow-2xl border border-white/5">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full iyte-red flex items-center justify-center font-bold text-sm shadow-inner">${state.userName.substring(0,2).toUpperCase()}</div>
                        <div class="flex flex-col">
                            <span class="text-sm font-semibold text-white">${state.userName}</span>
                            <span class="text-[10px] text-slate-400">Deneyimini paylaş</span>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="glass rounded-xl p-1 relative">
                            <i class="ph-fill ph-map-pin absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <select id="newLocSelect" class="w-full bg-transparent border-none py-2.5 pl-9 pr-3 text-xs outline-none text-white focus:ring-0 appearance-none [&>option]:bg-slate-900">
                                <option value="">Konum Seç...</option>
                                ${IYTE_LOCATIONS.map(l => `<option value="${l.id}" ${state.selectedLoc === l.id ? 'selected' : ''}>${l.title}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div class="flex gap-3">
                            <label class="border-2 border-dashed ${addPhotoBtnClass} rounded-2xl w-24 h-24 flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 overflow-hidden relative group">
                                ${state.newCommentPhoto ? 
                                    `<img src="${state.newCommentPhoto}" class="w-full h-full object-cover"><div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i class="ph-bold ph-pencil-simple text-white text-xl"></i></div>` : 
                                    '<i class="ph-bold ph-camera-plus text-2xl mb-1"></i><span class="text-[9px] font-medium">Fotoğraf</span>'}
                                <input type="file" accept="image/*" class="hidden" id="newCommentPhotoInput">
                            </label>
                            <textarea id="newCommentText" class="flex-1 bg-black/20 border border-white/5 rounded-2xl p-3 text-xs outline-none resize-none text-white placeholder-slate-500 focus:border-red-500/50 transition-colors" placeholder="Bu alanın erişilebilirliği nasıldı?"></textarea>
                        </div>
                        
                        <div class="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-2xl mt-1">
                            <div class="star-rating">
                                <input type="radio" id="star5" name="rating" value="5" /><label for="star5" class="ph-fill ph-star"></label>
                                <input type="radio" id="star4" name="rating" value="4" /><label for="star4" class="ph-fill ph-star"></label>
                                <input type="radio" id="star3" name="rating" value="3" /><label for="star3" class="ph-fill ph-star"></label>
                                <input type="radio" id="star2" name="rating" value="2" /><label for="star2" class="ph-fill ph-star"></label>
                                <input type="radio" id="star1" name="rating" value="1" /><label for="star1" class="ph-fill ph-star"></label>
                            </div>
                            <button data-action="add-new-comment" class="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-transform flex items-center gap-1.5 hover:bg-slate-100">
                                <i class="ph-bold ph-paper-plane-right"></i> Gönder
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-6 pb-20">
                ${IYTE_LOCATIONS.map(loc => {
                    const locComments = state.comments.filter(c => c.locId === loc.id);
                    if (locComments.length === 0) return "";
                    return `
                    <div class="space-y-3">
                        <h3 class="font-bold text-white text-sm pl-2 flex items-center gap-2"><div class="w-1.5 h-4 bg-red-500 rounded-full"></div> ${loc.title}</h3>
                        ${locComments.map(c => `
                            <div class="glass rounded-[1.5rem] p-4 flex gap-4 items-start shadow-lg border border-white/5">
                                <div class="relative shrink-0">
                                    <img src="${c.photo}" class="w-20 h-24 object-cover rounded-xl border border-white/10 cursor-pointer hover:opacity-80 transition-opacity" data-action="open-fullscreen" data-src="${c.photo}">
                                    <div class="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-amber-400 flex items-center gap-0.5 shadow-lg"><i class="ph-fill ph-star"></i> ${c.rating}</div>
                                </div>
                                <div class="flex-1 space-y-2 min-w-0">
                                    <div class="flex justify-between items-start">
                                        <div class="flex flex-col">
                                            <span class="font-bold text-sm text-white truncate">@${c.user}</span>
                                            ${c.profile ? getProfileBadge(c.profile) : ''}
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <span class="text-[9px] text-slate-400 font-medium">${c.date}</span>
                                            ${c.user === state.userName ? `<button data-action="delete-comment" data-id="${c.id}" class="text-rose-400 hover:text-rose-300 transition-colors p-1" title="Sil"><i class="ph-bold ph-trash text-lg"></i></button>` : ''}
                                        </div>
                                    </div>
                                    <p class="text-xs text-slate-300 leading-relaxed">${c.text}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
                }).join('')}
                
                ${state.comments.length === 0 ? `
                    <div class="glass rounded-[2rem] p-8 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-600/30 my-6">
                        <div class="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <i class="ph-thin ph-ghost text-5xl text-slate-400"></i>
                        </div>
                        <h4 class="text-white font-bold mb-2 text-lg">Buralar Çok Sessiz</h4>
                        <p class="text-xs text-slate-400 max-w-[200px] leading-relaxed">Kampüsü daha erişilebilir yapmak için ilk deneyimini paylaşan sen ol!</p>
                    </div>
                ` : ''}
                </div>
            </div>`;
    }

    function renderModal() {
        if (!state.showModal) return "";
        return `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-fade-in">
            <div class="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl flex flex-col max-h-[85vh] relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500"></div>
                
                <h3 class="font-bold text-white text-lg mb-4 flex items-center gap-2 shrink-0">
                    <i class="ph-fill ph-robot text-red-400 text-2xl"></i> AI Danışman
                </h3>
                
                ${state.geminiLoading ? `
                <div class="flex flex-col items-center justify-center py-12 space-y-6">
                    <div class="w-20 h-20 bg-red-600/20 ai-spinner flex items-center justify-center">
                        <i class="ph-fill ph-brain text-red-500 text-4xl"></i>
                    </div>
                    <div class="text-center space-y-1">
                        <p class="text-sm font-bold text-white tracking-wide">Analiz Ediliyor</p>
                        <p class="text-[10px] text-slate-400">Fotoğraf ve yorumlar taranıyor...</p>
                    </div>
                </div>` : `
                <div class="text-xs leading-relaxed mb-6 bg-black/30 p-5 rounded-2xl border border-white/5 overflow-y-auto flex-1 text-slate-200 custom-scrollbar">
                    ${state.geminiResult}
                </div>`}
                
                ${!state.geminiLoading ? `
                <div class="space-y-3 mt-2 shrink-0">
                    <button data-action="go-to-comments" class="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2">
                        <i class="ph-bold ph-chat-teardrop-text text-base"></i> Deneyimini Paylaş
                    </button>
                    <button data-action="close-modal" class="w-full py-3 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        Kapat
                    </button>
                </div>` : ''}
            </div>
        </div>`;
    }

    function renderFullscreenImage() {
        if (!state.fullscreenImgSrc) return "";
        return `
            <div class="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fade-in" data-action="close-fullscreen">
                <button data-action="close-fullscreen" class="absolute top-6 right-6 text-white bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                    <i class="ph-bold ph-x text-xl"></i>
                </button>
                <img src="${state.fullscreenImgSrc}" class="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10" onclick="event.stopPropagation()">
            </div>
        `;
    }

    function renderTabBar() {
        if (state.tab === "giris") return "";
        const tabs = [{ id: "analiz", label: "Analiz", icon: "ph-scan" }, { id: "topluluk", label: "Topluluk", icon: "ph-chats" }];
        return `
        <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] glass rounded-2xl p-2 flex justify-around shadow-2xl z-50 border border-white/10">
            ${tabs.map(t => `
            <button data-action="tab" data-id="${t.id}" class="flex-1 py-2.5 rounded-xl ${state.tab===t.id?'bg-white/10 text-white shadow-inner':'text-slate-400 hover:text-white hover:bg-white/5'} font-medium text-[10px] flex flex-col items-center gap-1 transition-all">
                <i class="${state.tab===t.id?'ph-fill text-red-400':'ph'} ${t.icon} text-2xl mb-0.5 transition-colors"></i>${t.label}
            </button>`).join('')}
        </nav>`;
    }

    function render() {
        let content = state.tab === "giris" ? renderGiris() : (state.tab === "analiz" ? renderAnaliz() : renderTopluluk());
        app.innerHTML = content + renderModal() + renderFullscreenImage() + renderTabBar();
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
        
        const prompt = `SİSTEM MESAJI: Sen İYTE kampüsündeki öğrencilere rehberlik eden uzman bir 'Erişilebilirlik Danışmanı'sın.
KULLANICI DURUMU: 
- Konum: ${locInfo.title}
- Hareketlilik Profili: ${state.userProfile}
- Özel Not/Soru: ${state.customQuestion || 'Belirtilmedi.'}
- Önceki Yorumlar: ${communityContext || 'Henüz yorum yok.'}

GÖREV: Ekli fotoğrafı analiz et. Şık ve kolay okunur (madde işaretli, bold başlıklar vb.) bir dille yanıt ver:
1. GÖRSEL ANALİZİ
2. ERİŞİLEBİLİRLİK DURUMU (${state.userProfile} profiline göre)
3. TAVSİYE (Özel sorusu varsa cevapla, yorumları dikkate al)`;

        try {
            const base64Data = state.imageSource.split(',')[1];
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64Data } }] }] })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            // AI metnini HTML tagleriyle süslüyoruz
            let resultText = data.candidates[0].content.parts[0].text;
            resultText = resultText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white text-sm block mt-2 mb-1">$1</strong>');
            resultText = resultText.replace(/\* (.*?)/g, '<li class="ml-4 list-disc text-slate-300 py-0.5">$1</li>');
            state.geminiResult = `<div class="space-y-1">${resultText}</div>`;
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
        const formattedDate = `${now.getDate()} ${["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][now.getMonth()]} ${now.getFullYear()}`;

        // Veritabanına 'profile' bilgisini de kaydediyoruz ki rozet çıkabilsin!
        db.collection("comments").add({ 
            locId: locId, user: state.userName, profile: state.userProfile, photo: photo, rating: rating, text: text, date: formattedDate, timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        }).then(() => { state.newCommentPhoto = null; state.newCommentText = ""; state.newCommentRating = 0; render(); })
        .catch((error) => alert("Hata: " + error.message));
    }

    // --- EVENT DİNLEYİCİLERİ ---
    app.addEventListener("click", e => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const act = btn.dataset.action;
        
        if (act === "reset-key") { localStorage.removeItem("gemini_api_key"); GEMINI_API_KEY = null; render(); return; }
        if (act === "submit-login") {
            const name = document.getElementById("userNameInput").value;
            const profile = document.getElementById("userProfileInput").value;
            const key = document.getElementById("apiKeyInput")?.value;
            if (name.length < 2) return alert("İsim giriniz");
            
            localStorage.setItem("userName", name);
            localStorage.setItem("userProfile", profile);
            state.userName = name;
            state.userProfile = profile;

            if (key) { GEMINI_API_KEY = key; localStorage.setItem("gemini_api_key", key); }
            if (!GEMINI_API_KEY) return alert("Lütfen API Anahtarı girin!");
            state.tab = "analiz"; render();
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
        if (act === "delete-comment") { if (confirm("Yorumu silmek istediğinize emin misiniz?")) db.collection("comments").doc(btn.dataset.id).delete(); }
        if (act === "open-fullscreen") { state.fullscreenImgSrc = btn.dataset.src; render(); }
        if (act === "close-fullscreen") { state.fullscreenImgSrc = null; render(); }
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

    app.addEventListener("input", e => { 
        if (e.target.id === "newCommentText") state.newCommentText = e.target.value; 
        if (e.target.id === "customQuestionInput") state.customQuestion = e.target.value;
    });

    render();
})();