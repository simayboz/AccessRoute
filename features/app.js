// runAI fonksiyonunu şu şekilde GÜNCELLE:
async function runAI() {
    if (!state.selectedLoc || !state.imageSource) return alert("Konum seçin ve fotoğraf çekin!");
    state.showModal = true; state.geminiLoading = true; render();
    
    const locInfo = IYTE_LOCATIONS.find(l => l.id === state.selectedLoc);
    const prompt = `İYTE Erişilebilirlik Danışmanısın. Konum: ${locInfo.title}, Profil: ${state.userProfile}. Fotoğrafı analiz et, erişilebilirlik önerileri ver.`;

    try {
        const compressedImg = await resizeImage(state.imageSource, 800);
        // LOVABLE HATASINI DÜZELTEN KISIM: Veriyi saf hale getiriyoruz
        const base64Data = compressedImg.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                    ]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            state.geminiResult = `❌ Google Hatası: ${data.error.message}`;
        } else if (data.candidates && data.candidates[0]) {
            let resultText = data.candidates[0].content.parts[0].text;
            // Markdown formatını temizle
            resultText = resultText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            resultText = resultText.replace(/\* (.*?)/g, '<li>$1</li>');
            state.geminiResult = `<div class="text-left space-y-2">${resultText}</div>`;
        } else {
            state.geminiResult = "⚠️ Yanıt alınamadı, lütfen tekrar deneyin.";
        }
    } catch (error) {
        state.geminiResult = `❌ Sistemsel Hata: ${error.message}`;
    }
    state.geminiLoading = false;
    render();
}