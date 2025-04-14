import { getDocumentsByAgentId } from '../../../models/Document';
import { getChunksByDocument } from '../../../models/KnowledgeBase';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check authentication
    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { agentId } = req.query;
    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }

    // Get all documents for this agent
    const documents = await getDocumentsByAgentId(agentId);

    // If includeChunks query param is true, fetch chunks for each document
    if (req.query.includeChunks === 'true') {
      const documentsWithChunks = await Promise.all(
        documents.map(async (doc) => {
          const chunks = await getChunksByDocument(doc.id);
          return {
            ...doc,
            chunks,
            chunkCount: chunks.length
          };
        })
      );
      return res.status(200).json(documentsWithChunks);
    }

    // Otherwise just return the documents with chunk counts
    const documentsWithCounts = await Promise.all(
      documents.map(async (doc) => {
        const chunks = await getChunksByDocument(doc.id);
        return {
          ...doc,
          chunkCount: chunks.length
        };
      })
    );

    return res.status(200).json(documentsWithCounts);
  } catch (error) {
    console.error('Fetch documents error:', error);
    return res.status(500).json({ message: 'Failed to fetch documents' });
  }
}
