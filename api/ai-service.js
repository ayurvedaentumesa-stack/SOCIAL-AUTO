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
        Eres un experto en marketing digital. Basándote en esta información:
        "${JSON.stringify(data)}"
        
        Crea contenido atractivo para redes sociales:
        1. Un post para Instagram (incluye hashtags relevantes).
        2. Un tweet conciso (máximo 280 caracteres).
        3. Un post profesional para LinkedIn.
        4. Un guion breve o descripción para TikTok.
        
        Devuelve el resultado en formato JSON con las llaves: instagram, twitter, linkedin, tiktok.
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
