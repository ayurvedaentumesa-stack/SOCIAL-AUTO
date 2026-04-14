const { generateContent } = require('./ai-service');
const { generateImage } = require('./abyssale-service');
const { getStockVideo } = require('./video-service');
const { getEbookSnippet } = require('./ebook-service');
const { schedulePost } = require('./social-service');
const db = require('./db-service');

/**
 * Main function triggered by a scheduler.
 */
/**
 * Main function for Vercel Serverless Hook
 */
module.exports = async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    console.log("Starting Content Automation Flow (from Ebook)...");

    try {
        // 1. Fetch Snippet from Ebook
        const sourceData = await getEbookSnippet();

        if (!sourceData || !sourceData.body) {
            throw new Error("No content found in the ebook to process.");
        }

        console.log("Ebook snippet retrieved:", sourceData.title);

        // 2. Generate Text Content via AI
        const content = await generateContent(sourceData.body);
        console.log("Content generated successfully.");

        // 3. Generate Image (optional)
        const imageUrl = await generateImage(content.instagram || content.twitter);
        console.log("Image status:", imageUrl ? "Generated" : "Skipped");

        // 4. Fetch Stock Video (For TikTok/Shorts)
        const videoUrl = await getStockVideo(sourceData.body.split(' ').slice(0, 3).join(' '));
        console.log("Video status:", videoUrl ? "Fetched from Pexels" : "Skipped");

        // 5. Schedule via Buffer
        // We use the vertical script for TikTok if available
        const mainCaption = content.linkedin || content.instagram;
        const staticResults = await schedulePost(mainCaption, imageUrl);
        
        let videoResults = [];
        if (videoUrl) {
            const tiktokCaption = content.script_vertical || content.tiktok || content.instagram;
            videoResults = await schedulePost(tiktokCaption, videoUrl, true);
        }

        const results = [...staticResults, ...videoResults];
        console.log("Automation completed successfully.");

        // 6. Log to Supabase
        await db.logPublication({
            content: JSON.stringify(content),
            platform: 'multiple',
            mediaUrl: videoUrl || imageUrl,
            status: 'scheduled'
        });

        res.status(200).send({
            message: "Automation completed and logged",
            data: content,
            imageUrl: imageUrl,
            videoUrl: videoUrl,
            results: results
        });
    } catch (error) {
        console.error("CRITICAL FALLBACK:", error);
        res.status(500).send({ error: error.message });
    }
};
