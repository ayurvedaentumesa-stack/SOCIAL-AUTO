const { generateContent } = require('./ai-service');
const { generateImage } = require('./abyssale-service');
const { getStockVideo } = require('./video-service');
const { getEbookSnippet } = require('./ebook-service');
const { schedulePost } = require('./social-service');
const db = require('./db-service');

/**
 * Main function triggered by a scheduler.
 */
async function runAutomation(req, res) {
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
        const staticResults = await schedulePost(content.linkedin || content.instagram, imageUrl);
        
        let videoResults = [];
        if (videoUrl) {
            videoResults = await schedulePost(content.tiktok || content.instagram, videoUrl, true);
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

        if (res) {
            res.status(200).send({
                message: "Automation completed and logged",
                data: content,
                imageUrl: imageUrl,
                videoUrl: videoUrl
            });
        }
    } catch (error) {
        console.error("CRITICAL FALLBACK:", error);
        // Here you would send a Slack/Email notification
        if (res) {
            res.status(500).send({ error: error.message });
        }
    }
}

// For local testing or Cloud Function deployment
if (require.main === module) {
    runAutomation();
}

module.exports = { runAutomation };
