import { PDFParse } from "pdf-parse";
import fs from 'fs/promises'

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<{text: string, numPages: number}>}
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    // Use pdf-parse library - not a buffer
    const parser = new PDFParser(new Uint8Array(dataBuffer));
    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.numPages,
      info: data.info,
    };
  } catch (error) {
    throw error;
  }
};