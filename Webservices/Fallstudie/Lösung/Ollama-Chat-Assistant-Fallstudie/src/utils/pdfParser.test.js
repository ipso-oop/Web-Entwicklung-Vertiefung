import { jest } from '@jest/globals';
import { parsePDF } from './pdfParser.js';

const mockPdfParser = {
    on: jest.fn(),
    parseBuffer: jest.fn()
};

jest.unstable_mockModule('pdf2json', () => ({
    default: jest.fn().mockImplementation(() => mockPdfParser)
}));

describe('PDF Parser', () => {
    let mockPdfData;

    beforeEach(() => {
        mockPdfData = {
            Pages: [
                {
                    Texts: [
                        { R: [{ T: 'Hello' }, { T: 'World' }] },
                        { R: [{ T: 'Test' }] }
                    ]
                },
                {
                    Texts: [
                        { R: [{ T: 'Page' }, { T: '2' }] }
                    ]
                }
            ]
        };
    });

    it('should parse PDF content correctly', async () => {
        // Arrange
        const pdfBuffer = Buffer.from('mock pdf content');
        const expectedText = 'Hello World Test\nPage 2';

        // Act
        const parsePromise = parsePDF(pdfBuffer);
        
        // Simulate the event handlers
        const dataReadyHandler = mockPdfParser.on.mock.calls.find(call => call[0] === 'pdfParser_dataReady');
        if (dataReadyHandler) {
            dataReadyHandler[1](mockPdfData);
        }

        // Assert
        const result = await parsePromise;
        expect(result).toBe(expectedText);
        expect(mockPdfParser.parseBuffer).toHaveBeenCalledWith(pdfBuffer);
    });

    it('should reject when PDF parsing fails', async () => {
        // Arrange
        const pdfBuffer = Buffer.from('mock pdf content');
        const error = new Error('PDF parsing failed');

        // Act
        const parsePromise = parsePDF(pdfBuffer);
        
        // Simulate the error handler
        const errorHandler = mockPdfParser.on.mock.calls.find(call => call[0] === 'pdfParser_dataError');
        if (errorHandler) {
            errorHandler[1](error);
        }

        // Assert
        await expect(parsePromise).rejects.toThrow('PDF parsing failed');
    });
}); 