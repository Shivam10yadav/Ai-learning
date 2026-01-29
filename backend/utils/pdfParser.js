import { PDFParse } from "pdf-parse";
import fs from 'fs/promises';

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    
    // Use pdf-parse library with your class-based approach
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    const data = await parser.getText();

    console.log('PDF Data extracted:', {
      textLength: data.text?.length,
      numPages: data.numPages
    });

    // Return just the text string (not an object)
    return data.text || '';
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
};