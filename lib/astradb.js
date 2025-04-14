import { DataAPIClient } from "@datastax/astra-db-ts";

let astraClient = null;

export const getAstraClient = async () => {
  if (astraClient === null) {
    const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
    if (!token) {
      throw new Error('ASTRA_DB_APPLICATION_TOKEN environment variable is required');
    }

    const client = new DataAPIClient(token);
    astraClient = client.db('https://56dabae9-e9f0-4618-995c-ddb539c7ada9-westus3.apps.astra.datastax.com');
  }
  return astraClient;
};

export const getCollection = async (collectionName) => {
  const client = await getAstraClient();
  
  try {
    // Try to create the collection if it doesn't exist
    await client.createCollection(collectionName);
  } catch (error) {
    // Ignore error if collection already exists
    if (!error.message?.includes('already exists')) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  // Create a wrapper object to maintain compatibility with existing code
  const collection = {
    findOne: async (query) => {
      try {
        const result = await client.collection(collectionName).findOne(query);
        return result || null;
      } catch (error) {
        console.error('FindOne error:', error);
        return null;
      }
    },

    find: async (query) => {
      try {
        const result = await client.collection(collectionName).find(query);
        return result || null;
      } catch (error) {
        console.error('Find error:', error);
        return null;
      }
    },

    insertOne: async (document) => {
      try {
        return await client.collection(collectionName).insertOne(document);
      } catch (error) {
        console.error('InsertOne error:', error);
        throw error;
      }
    },

    create: async (id, document) => {
      try {
        return await client.collection(collectionName).insertOne({ _id: id, ...document });
      } catch (error) {
        console.error('Create error:', error);
        throw error;
      }
    },

    updateOne: async (query, update) => {
      try {
        return await client.collection(collectionName).updateOne(query, update);
      } catch (error) {
        console.error('UpdateOne error:', error);
        throw error;
      }
    },

    deleteOne: async (query) => {
      try {
        return await client.collection(collectionName).deleteOne(query);
      } catch (error) {
        console.error('DeleteOne error:', error);
        throw error;
      }
    }
  };

  return collection;
};
