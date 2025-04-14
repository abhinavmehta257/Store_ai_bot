import { getCollection } from '../lib/astradb';

const COLLECTION_NAME = 'agents';

export const createAgent = async ({ name, twilioPhoneNumber, greetingPhrase, systemMessage, userId }) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  // Check if phone number is already assigned to another agent
  const existingAgent = await collection.findOne({ twilioPhoneNumber });
  if (existingAgent) {
    throw new Error('Phone number is already assigned to another agent');
  }

  const agent = {
    id: Date.now().toString(),
    name,
    twilioPhoneNumber,
    greetingPhrase,
    systemMessage,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await collection.insertOne(agent);
  return agent;
};

export const updateAgent = async (id, updates) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  // If phone number is being updated, check if it's available
  if (updates.twilioPhoneNumber) {
    const existingAgent = await collection.findOne({ 
      twilioPhoneNumber: updates.twilioPhoneNumber,
      id: { $ne: id } // Exclude current agent from check
    });
    
    if (existingAgent) {
      throw new Error('Phone number is already assigned to another agent');
    }
  }

  // Don't allow updating phone number after creation
  const { twilioPhoneNumber: updatedPhoneNumber, ...allowedUpdates } = updates;
  
  const updatedAgent = {
    ...allowedUpdates,
    updatedAt: new Date().toISOString()
  };

  await collection.updateOne(
    { id },
    { $set: updatedAgent }
  );

  return collection.findOne({ id });
};

export const getAgentById = async (id) => {
  const collection = await getCollection(COLLECTION_NAME);
  return collection.findOne({ id });
};

export const getAgentsByUserId = async (userId) => {
  const collection = await getCollection(COLLECTION_NAME);
  const result = await collection.find({ userId });
  const agents = await result.toArray();
  console.log('result', await result.toArray());
  
  // Ensure we return an array even if no results
  return agents;
};

export const deleteAgent = async (id) => {
  const collection = await getCollection(COLLECTION_NAME);
  await collection.deleteOne({ id });
  return { success: true };
};

// Helper function to check if a phone number is available
export const isPhoneNumberAvailable = async (phoneNumber, excludeAgentId = null) => {
  const collection = await getCollection(COLLECTION_NAME);
  const query = { twilioPhoneNumber: phoneNumber };
  
  if (excludeAgentId) {
    query.id = { $ne: excludeAgentId };
  }

  const existingAgent = await collection.findOne(query);
  return !existingAgent;
};
