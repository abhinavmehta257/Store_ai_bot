# Knowledge Base Management

This feature allows agents to build and maintain their knowledge base through document uploads. The system processes uploaded documents into smaller chunks for efficient retrieval and better context management.

## Supported Document Types

- Text files (.txt)
- PDF documents (.pdf)
- Microsoft Word documents (.doc, .docx)

Maximum file size: 10MB

## Document Processing Pipeline

1. **Upload**: Documents are uploaded through the agent interface
2. **Validation**: File type and size validation
3. **Processing**: Document content is extracted based on file type
4. **Chunking**: Content is split into manageable chunks (~1000 characters)
5. **Storage**: Chunks are stored with metadata and vector embeddings
6. **Association**: All chunks are linked to the source document and agent

## Testing

Run the document processing tests:
```bash
npm run test:docs
```

Clean up test files:
```bash
npm run test:cleanup
```

## API Endpoints

### Document Upload
`POST /api/documents/upload`
- Requires multipart form data with file and agentId
- Returns created document object

### List Documents
`GET /api/documents/[agentId]`
- Lists all documents for an agent
- Returns array of documents with chunk counts

### Delete Document
`DELETE /api/documents/delete/[id]`
- Deletes document and all associated chunks
- Returns success status and deleted chunk count

## Frontend Components

- `DocumentUploadSection`: Main component for document upload and management
- `AgentModal`: Integrates document management in agent configuration
