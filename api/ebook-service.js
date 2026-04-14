const fs = require('fs');
const path = require('path');

/**
 * Service to manage content extraction from the project's Ebook.
 */
async function getEbookSnippet() {
    const dataDir = path.join(__dirname, '../data');
    
    // Attempt to find a .txt or .pdf file in the data directory
    const files = fs.readdirSync(dataDir);
    const ebookFile = files.find(f => f.endsWith('.txt') || f.endsWith('.pdf'));

    if (!ebookFile) {
        throw new Error("No ebook found in backend/data/ directory. Please add a .txt or .pdf file.");
    }

    const filePath = path.join(dataDir, ebookFile);

    if (ebookFile.endsWith('.txt')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Logic to pick a random or sequential paragraph
        const paragraphs = content.split('\n\n').filter(p => p.length > 50);
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        return {
            title: "Concepto del Ebook",
            body: paragraphs[randomIndex]
        };
    } else if (ebookFile.endsWith('.pdf')) {
        // Here we would use 'pdf-parse'
        // For now, returning a placeholder instruction
        return {
            title: "PDF Detectado",
            body: "El sistema ha detectado un PDF. Asegúrate de instalar 'pdf-parse' para extraer el texto automáticamente."
        };
    }

    return null;
}

module.exports = { getEbookSnippet };
