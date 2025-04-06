const mongoose = require('mongoose');

// Define the schema for the knowledge-base collection
const KnowledgeBaseSchema = new mongoose.Schema({
  content: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  embedding: { type: [Number]}, // Array of numbers for vector embeddings
  botId: { type: String, required: true },
  userId: { type: String },
  documentId: { type: String, required: true },
});

// Create the model
const KnowledgeBase = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);

module.exports = KnowledgeBase;
