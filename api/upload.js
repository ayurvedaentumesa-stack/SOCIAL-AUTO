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
    
    // Explicitly parse the incoming request
    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                res.status(500).json({ error: 'Error parsing upload: ' + err.message });
                return resolve();
            }

            // Handle different formidable versions (files.ebook might be an array or object)
            const ebookFile = Array.isArray(files.ebook) ? files.ebook[0] : files.ebook;
            
            if (!ebookFile) {
                res.status(400).json({ error: 'No file uploaded under "ebook" field' });
                return resolve();
            }

            try {
                let extractedText = '';
                const filePath = ebookFile.filepath || ebookFile.path;

                if (!filePath) {
                    throw new Error("File path not found in upload data.");
                }

                if (ebookFile.originalFilename.toLowerCase().endsWith('.pdf')) {
                    const dataBuffer = fs.readFileSync(filePath);
                    const data = await pdf(dataBuffer);
                    extractedText = data.text;
                } else {
                    extractedText = fs.readFileSync(filePath, 'utf-8');
                }

                if (!extractedText || extractedText.trim().length === 0) {
                    throw new Error("No text could be extracted from the file. Is it a scanned image?");
                }

                // Save to Supabase
                await db.saveSourceContent(extractedText, ebookFile.originalFilename || 'ebook.pdf');

                res.status(200).json({
                    message: 'File uploaded and processed successfully',
                    fileName: ebookFile.originalFilename,
                    extractedLength: extractedText.length
                });
                resolve();
            } catch (error) {
                console.error('Processing error:', error);
                res.status(500).json({ error: error.message });
                resolve();
            }
        });
    });
};

// Vercel config: ESSENTIAL for formidable to work
handler.config = {
    api: {
        bodyParser: false,
    },
};

module.exports = handler;


