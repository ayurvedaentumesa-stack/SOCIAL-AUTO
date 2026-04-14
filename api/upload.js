const formidable = require('formidable');
const fs = require('fs');
const pdf = require('pdf-parse');
const db = require('./db-service');

// Vercel config to disable built-in body parser for formidable
module.exports.config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req, res) => {
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

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            res.status(500).json({ error: 'Error parsing upload' });
            return;
        }

        const file = files.ebook[0] || files.ebook;
        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        try {
            let extractedText = '';
            const filePath = file.filepath || file.path;

            if (file.originalFilename.endsWith('.pdf') || file.mimetype === 'application/pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                extractedText = data.text;
            } else {
                extractedText = fs.readFileSync(filePath, 'utf-8');
            }

            if (!extractedText || extractedText.trim().length === 0) {
                throw new Error("No text could be extracted from the file.");
            }

            // Save to Supabase
            await db.saveSourceContent(extractedText, file.originalFilename || 'ebook.pdf');

            res.status(200).json({
                message: 'File uploaded and processed successfully',
                fileName: file.originalFilename,
                extractedLength: extractedText.length
            });
        } catch (error) {
            console.error('Processing error:', error);
            res.status(500).json({ error: error.message });
        }
    });
};

module.exports = handler;

