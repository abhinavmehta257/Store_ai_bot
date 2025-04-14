import { getCollection } from '../lib/astradb';

const COLLECTION_NAME = 'documents';

export const createDocument = async ({ name, agentId, userId, type, size }) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  const document = {
    id: Date.now().toString(),
    name,
    agentId,
    userId,
    type,
    size,
    status: 'processing',
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await collection.insertOne(document);
  return document;
};

export const updateDocumentStatus = async (id, status) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  const updatedDocument = {
    status,
    updatedAt: new Date().toISOString()
  };

  await collection.updateOne(
    { id },
    { $set: updatedDocument }
  );

  return collection.findOne({ id });
};

export const getDocumentById = async (id) => {
  const collection = await getCollection(COLLECTION_NAME);
  return collection.findOne({ id });
};

export const getDocumentsByAgentId = async (agentId) => {
  const collection = await getCollection(COLLECTION_NAME);
  const result = await collection.find({ agentId });
  return result.toArray();
};

export const deleteDocument = async (id) => {
  const collection = await getCollection(COLLECTION_NAME);
  await collection.deleteOne({ id });
  return { success: true };
};
