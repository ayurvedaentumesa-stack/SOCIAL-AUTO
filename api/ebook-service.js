const fs = require('fs');
const path = require('path');
const db = require('./db-service');

/**
 * Service to manage content extraction from the project's Ebook.
 */
async function getEbookSnippet() {
    // 1. Try to get content from Database (Uploaded via Dashboard)
    const dbSource = await db.getLatestSourceContent();
    
    if (dbSource && dbSource.content) {
        console.log("Using source content from database:", dbSource.file_name);
        const paragraphs = dbSource.content.split('\n\n').filter(p => p.length > 50);
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        return {
            title: `Ebook DB: ${dbSource.file_name}`,
            body: paragraphs[randomIndex]
        };
    }

    // 2. Fallback to local files (if any)
    const dataDir = path.join(__dirname, '../data');
    
    if (fs.existsSync(dataDir)) {
        const files = fs.readdirSync(dataDir);
        const ebookFile = files.find(f => f.endsWith('.txt') || f.endsWith('.pdf'));

        if (ebookFile) {
            const filePath = path.join(dataDir, ebookFile);
            if (ebookFile.endsWith('.txt')) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const paragraphs = content.split('\n\n').filter(p => p.length > 50);
                const randomIndex = Math.floor(Math.random() * paragraphs.length);
                return { title: ebookFile, body: paragraphs[randomIndex] };
            }
        }
    }

    throw new Error("No content source found. Please upload a PDF or TXT via the dashboard.");
}

module.exports = { getEbookSnippet };
