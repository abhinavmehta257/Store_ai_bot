import { getCollection } from '../../lib/astradb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Getting collection...');
    const collection = await getCollection('test_collection');
    
    // Test document
    const testDoc = {
      name: 'Test User',
      email: 'test@example.com',
      timestamp: new Date().toISOString()
    };

    console.log('Inserting test document...');
    const insertResult = await collection.insertOne(testDoc);
    console.log('Insert result:', insertResult);

    console.log('Finding the document...');
    const findResult = await collection.findOne({ name: 'Test User' });
    console.log('Find result:', findResult);

    res.status(200).json({ 
      message: 'AstraDB test successful',
      insertResult,
      findResult
    });
  } catch (error) {
    console.error('AstraDB test error:', error);
    res.status(500).json({ 
      message: 'AstraDB test failed', 
      error: error.message,
      stack: error.stack // Including stack trace for debugging
    });
  }
}
