const fs = require('fs');
const path = require('path');
const { processDocument } = require('../lib/documents');
const { createDocument } = require('../models/Document');
const { createChunk, getChunksByDocument, deleteChunksByDocument } = require('../models/KnowledgeBase');

async function runTest() {
  console.log('🧪 Starting document upload test...\n');

  try {
    // Test document setup
    const testFilePath = path.join(__dirname, 'sample.txt');
    const documentId = Date.now().toString();
    const agentId = 'test-agent-123';
    const mimeType = 'text/plain';

    console.log('📄 Creating test document record...');
    const document = await createDocument({
      name: 'sample.txt',
      agentId,
      userId: 'test-user',
      type: mimeType,
      size: fs.statSync(testFilePath).size
    });
    console.log('✅ Document record created');

    console.log('\n🔄 Processing document into chunks...');
    const chunks = await processDocument(testFilePath, documentId, agentId, mimeType);
    console.log(`✅ Document processed into ${chunks.length} chunks`);

    console.log('\n💾 Storing chunks in database...');
    for (const content of chunks) {
      await createChunk({
        documentId: document.id,
        agentId,
        content
      });
    }
    console.log('✅ Chunks stored successfully');

    console.log('\n🔍 Retrieving stored chunks...');
    const storedChunks = await getChunksByDocument(document.id);
    console.log(`✅ Retrieved ${storedChunks.length} chunks`);

    console.log('\n🧹 Cleaning up test data...');
    await deleteChunksByDocument(document.id);
    console.log('✅ Test chunks deleted');

    console.log('\n✨ All tests completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
runTest();
