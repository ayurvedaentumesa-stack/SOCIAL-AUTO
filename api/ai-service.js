const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Generates social media content based on source data.
 * @param {Object} data - Information from external APIs (news, weather, etc.)
 * @returns {Promise<Object>} - Content for different platforms
 */
async function generateContent(data) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
        Eres un experto en marketing digital viral especializado en contenido vertical (Reels, TikTok, Shorts). 
        Basándote en esta información extraída de un ebook:
        "${JSON.stringify(data)}"
        
        Crea contenido de alto impacto:
        1. REEL/TIKTOK: Un guion dinámico con un gancho (hook) en los primeros 3 segundos, 3 puntos clave y un CTA (llamada a la acción).
        2. INSTAGRAM: Un copy optimizado para captar la atención, con hashtags estratégicos.
        3. TIKTOK DESCRIPTION: Una descripción breve y viral con hashtags tendencia.
        4. TWITTER/X: Un hilo o post corto y controversial/educativo.
        5. LINKEDIN: Un post profesional que aporte valor sobre el tema.
        
        IMPORTANTE: El tono debe ser cercano y persuasivo.
        Devuelve el resultado ÚNICAMENTE en formato JSON con las llaves: instagram, twitter, linkedin, tiktok, script_vertical.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Basic cleanup in case text is wrapped in markdown code blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate content with AI");
    }
}

module.exports = { generateContent };
