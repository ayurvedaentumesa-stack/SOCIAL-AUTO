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
     * Saves the ebook text content to the database.
     * @param {string} text - Extracted text from PDF or TXT
     */
    async saveSourceContent(text, fileName) {
        try {
            const { data, error } = await this.supabase
                .from('source_content')
                .upsert([
                    {
                        id: 1, // We keep only one active source for now
                        content: text,
                        file_name: fileName,
                        updated_at: new Date()
                    }
                ]);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Supabase Save Error:", error.message);
            throw error;
        }
    }

    /**
     * Gets the latest source content from the database.
     */
    async getLatestSourceContent() {
        try {
            const { data, error } = await this.supabase
                .from('source_content')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) return null;
            return data;
        } catch (error) {
            console.error("Supabase Fetch Error:", error.message);
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
