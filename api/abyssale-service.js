const axios = require('axios');

/**
 * Generates an image using Abyssale API.
 * @param {string} textContent - Text to overlay on the image
 * @returns {Promise<string>} - URL of the generated image
 */
async function generateImage(textContent) {
    const API_KEY = process.env.ABYSSALE_API_KEY;
    const TEMPLATE_ID = process.env.ABYSSALE_TEMPLATE_ID;

    if (!API_KEY || !TEMPLATE_ID) {
        console.warn("Abyssale config missing, skipping image generation.");
        return null;
    }

    try {
        const response = await axios.post(
            'https://api.abyssale.com/v1/banners/generate',
            {
                template_id: TEMPLATE_ID,
                elements: {
                    "text_content": { "payload": textContent }
                }
            },
            {
                headers: { 
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.cdn_url || response.data.file_url;
    } catch (error) {
        console.error("Abyssale Generation Error:", error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = { generateImage };
