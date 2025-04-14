import { getCollection } from '../lib/astradb';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION_NAME = 'chunks';

export const createChunk = async ({ documentId, agentId, content }) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  const chunk = {
    _id: uuidv4(),
    type: 'CompositeElement',
    documentId,
    agentId,
    $vectorize: content,
    createdAt: new Date().toISOString()
  };

  await collection.insertOne(chunk);
  return chunk;
};

export const getChunksByDocument = async (documentId) => {
  const collection = await getCollection(COLLECTION_NAME);
  const result = await collection.find({ documentId });
  return result.toArray();
};

export const getChunksByAgent = async (agentId) => {
  const collection = await getCollection(COLLECTION_NAME);
  const result = await collection.find({ agentId });
  return result.toArray();
};

export const deleteChunksByDocument = async (documentId) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  // First get all chunks for this document
  const chunks = await collection.find({ documentId });
  if (!chunks) return { success: false };

  const chunksArray = await chunks.toArray();
  
  // Delete each chunk individually
  for (const chunk of chunksArray) {
    await collection.deleteOne({ _id: chunk._id });
  }

  return { success: true, deletedCount: chunksArray.length };
};
