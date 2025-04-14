import { promises as fs } from 'fs';
import PDFParser from 'pdf-parse';
import mammoth from 'mammoth';

// Helper function to chunk text into smaller pieces
export function chunkText(text, maxLength = 1000) {
  // Split into sentences first
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    // If adding this sentence would exceed maxLength, save current chunk and start new one
    if (currentChunk.length + sentence.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  // Add the last chunk if it exists
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Extract text from PDF file
export async function extractTextFromPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await PDFParser(dataBuffer);
  return data.text;
}

// Extract text from DOCX file
export async function extractTextFromDOCX(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer: dataBuffer });
  return result.value;
}

// Extract text from TXT file
export async function extractTextFromTXT(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return text;
}

// Main function to extract text based on file type
export async function extractText(filePath, mimeType) {
  switch (mimeType) {
    case 'application/pdf':
      return extractTextFromPDF(filePath);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractTextFromDOCX(filePath);
    case 'text/plain':
      return extractTextFromTXT(filePath);
    default:
      throw new Error('Unsupported file type');
  }
}

// Process document into chunks
export async function processDocument(filePath, documentId, agentId, mimeType) {
  try {
    // Extract text from document
    const text = await extractText(filePath, mimeType);
    
    // Split text into chunks
    const chunks = chunkText(text);
    
    return chunks;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}
