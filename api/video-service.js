const axios = require('axios');

/**
 * Fetches a vertical video from Pexels based on keywords.
 * @param {string} query - Search term for the video
 * @returns {Promise<string>} - URL of the video file
 */
async function getStockVideo(query) {
    const API_KEY = process.env.PEXELS_API_KEY;

    if (!API_KEY) {
        console.warn("Pexels API key missing, skipping video search.");
        return null;
    }

    try {
        const response = await axios.get(`https://api.pexels.com/videos/search`, {
            params: {
                query: query,
                orientation: 'portrait',
                per_page: 1
            },
            headers: { 'Authorization': API_KEY }
        });

        const videos = response.data.videos;
        if (videos && videos.length > 0) {
            // Get the first link of the first video (usually SD or HD)
            return videos[0].video_files[0].link;
        }
        return null;
    } catch (error) {
        console.error("Video Fetch Error:", error.response ? error.response.data : error.message);
        return null;
    }
}

/**
 * (Optional) Implementation for AI Video Generation like Shotstack or Creatomate
 * @param {string} text - Text to overlay on video
 * @returns {Promise<string>} - Video URL
 */
async function generateAiVideo(text) {
    // This would be a more complex implementation using Shotstack or similar
    // for now we stick to Pexels as requested for 'videos gratuitos'
    return null;
}

module.exports = { getStockVideo };
