import { deleteDocument } from '../../../../models/Document';
import { deleteChunksByDocument } from '../../../../models/KnowledgeBase';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check authentication
    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Document ID is required' });
    }

    // Delete all chunks associated with this document
    const deleteChunksResult = await deleteChunksByDocument(id);
    
    if (!deleteChunksResult.success) {
      return res.status(500).json({ message: 'Failed to delete document chunks' });
    }

    // Delete the document itself
    await deleteDocument(id);

    return res.status(200).json({ 
      success: true,
      deletedChunks: deleteChunksResult.deletedCount 
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return res.status(500).json({ message: 'Failed to delete document' });
  }
}
