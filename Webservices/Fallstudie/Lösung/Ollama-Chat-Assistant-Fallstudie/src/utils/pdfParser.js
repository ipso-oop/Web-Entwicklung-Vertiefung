import PDFParser from 'pdf2json';

export function parsePDF(pdfBuffer) {
    return new Promise((resolve, reject) => {
        try {
            const pdfParser = new PDFParser();
            
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
                try {
                    const text = pdfData.Pages.map(page => 
                        page.Texts.map(text => text.R.map(r => r.T).join(' ')).join(' ')
                    ).join('\n');
                    resolve(text);
                } catch (error) {
                    console.error('Error processing PDF data:', error);
                    reject(new Error('Failed to process PDF content'));
                }
            });
            
            pdfParser.on('pdfParser_dataError', (error) => {
                console.error('PDF parsing error:', error);
                reject(new Error('Failed to parse PDF file'));
            });

            // Ensure we have a valid buffer
            if (!Buffer.isBuffer(pdfBuffer)) {
                reject(new Error('Invalid PDF buffer'));
                return;
            }

            pdfParser.parseBuffer(pdfBuffer);
        } catch (error) {
            console.error('PDF parser error:', error);
            reject(new Error('Failed to initialize PDF parser'));
        }
    });
} 