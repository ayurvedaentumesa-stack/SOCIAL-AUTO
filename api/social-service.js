const axios = require('axios');

/**
 * Schedules a post on Buffer.
 * @param {string} text - Post content
 * @param {string} mediaUrl - URL of the image or video to include
 * @param {boolean} isVideo - Flag to indicate if media is a video
 * @returns {Promise<Object>} - Buffer API response
 */
async function schedulePost(text, mediaUrl, isVideo = false) {
    const ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
    const PROFILE_IDS = process.env.BUFFER_PROFILE_IDS.split(',');

    if (!ACCESS_TOKEN || !PROFILE_IDS) {
        throw new Error("Buffer configuration missing");
    }

    const results = [];

    for (const profileId of PROFILE_IDS) {
        try {
            const mediaObj = {};
            if (mediaUrl) {
                if (isVideo) {
                    mediaObj.video = mediaUrl;
                } else {
                    mediaObj.photo = mediaUrl;
                }
            }

            const response = await axios.post(
                `https://api.bufferapp.com/1/updates/create.json`,
                new URLSearchParams({
                    access_token: ACCESS_TOKEN,
                    profile_ids: [profileId],
                    text: text,
                    media: mediaObj,
                    shorten: true,
                    now: false
                })
            );
            results.push(response.data);
        } catch (error) {
            console.error(`Error scheduling for profile ${profileId}:`, error.response ? error.response.data : error.message);
        }
    }

    return results;
}

module.exports = { schedulePost };
