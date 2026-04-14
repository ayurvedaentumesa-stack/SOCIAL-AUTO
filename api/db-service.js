const { createClient } = require('@supabase/supabase-js');

/**
 * Service to manage Supabase database interactions.
 */
class DbService {
    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );
    }

    /**
     * Logs a publication to the history table.
     * @param {Object} postData - Content and metadata of the post
     */
    async logPublication(postData) {
        try {
            const { data, error } = await this.supabase
                .from('publications')
                .insert([
                    {
                        content: postData.content,
                        platform: postData.platform,
                        media_url: postData.mediaUrl,
                        status: postData.status || 'pending',
                        created_at: new Date()
                    }
                ]);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Supabase Log Error:", error.message);
            return null;
        }
    }

    /**
     * Optional: Fetch or update ebook snippets state
     */
    async getNextSnippetIndex() {
        // Logic to keep track of what part of the ebook we are at
    }
}

module.exports = new DbService();
