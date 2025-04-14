import formidable from 'formidable';
import { unlink } from 'fs/promises';
import { createDocument, updateDocumentStatus } from '../../../models/Document';
import { createChunk } from '../../../models/KnowledgeBase';
import { getToken } from 'next-auth/jwt';
import { processDocument } from '../../../lib/documents';

// Disable the default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to process file into chunks
async function processFileIntoChunks(filePath, documentId, agentId, mimeType) {
  try {
    const chunks = await processDocument(filePath, documentId, agentId, mimeType);
    
    // Create chunks in the database
    for (const content of chunks) {
      await createChunk({
        documentId,
        agentId,
        content
      });
    }
    
    // Update document status to completed
    await updateDocumentStatus(documentId, 'completed');
  } catch (error) {
    console.error('Error processing file:', error);
    await updateDocumentStatus(documentId, 'error');
    throw error;
  } finally {
    // Clean up: delete the temporary file
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Error deleting temporary file:', error);
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check authentication
    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Parse the form data
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];
    const agentId = fields.agentId?.[0];

    if (!file || !agentId) {
      return res.status(400).json({ message: 'File and agentId are required' });
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'File type not supported' });
    }

    // Create document record
    const document = await createDocument({
      name: file.originalFilename,
      agentId,
      userId: token.sub,
      type: file.mimetype,
      size: file.size
    });

    // Process file in the background
    processFileIntoChunks(file.filepath, document.id, agentId, file.mimetype).catch(console.error);

    return res.status(200).json(document);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Failed to upload document' });
  }
}
