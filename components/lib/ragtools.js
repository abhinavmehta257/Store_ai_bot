import { ObjectId } from "mongodb";

// Define the tool schemas as plain objects.
const _searchToolSchema = {
  type: "function",
  name: "search",
  description:
    "Search the knowledge base. The knowledge base is in English, translate to and from English if needed. " +
    "Results are formatted as a source name first in square brackets, followed by the text content, and a line " +
    "with '-----' at the end of each result.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query"
      },
      // Optionally, if you have a pre-computed vector for the query, you could pass it here.
      queryVector: {
        type: "array",
        items: { type: "number" },
        description: "Optional query vector for vector search"
      }
    },
    required: ["query"],
    additionalProperties: false
  }
};

const _groundingToolSchema = {
  type: "function",
  name: "report_grounding",
  description:
    "Report use of a source from the knowledge base as part of an answer (effectively, cite the source). Sources " +
    "appear in square brackets before each knowledge base passage. Always use this tool to cite sources when responding " +
    "with information from the knowledge base.",
  parameters: {
    type: "object",
    properties: {
      sources: {
        type: "array",
        items: { type: "string" },
        description:
          "List of source names from last statement actually used, do not include the ones not used to formulate a response"
      }
    },
    required: ["sources"],
    additionalProperties: false
  }
};

// Regular expression for valid keys.
const KEY_PATTERN = /^[a-zA-Z0-9_=\-]+$/;

// Helper class for tool results.
class ToolResult {
  constructor(result, direction) {
    this.result = result;
    this.direction = direction;
  }
}

// Enum for tool result direction.
const ToolResultDirection = {
  TO_SERVER: "TO_SERVER",
  TO_CLIENT: "TO_CLIENT"
};

/**
 * Performs a search using MongoDB Atlas Search.
 *
 * @param {Collection} collection - MongoDB collection instance.
 * @param {string|null} semanticConfiguration - Optional Atlas Search index name for semantic search.
 * @param {string} identifierField - Field name used as an identifier.
 * @param {string} contentField - Field name containing content.
 * @param {string} embeddingField - Field name containing the vector embedding.
 * @param {boolean} useVectorQuery - Whether to use vector search.
 * @param {Object} args - Arguments with a "query" field and optionally a "queryVector" field.
 * @returns {Promise<ToolResult>}
 */
async function _searchTool(
  collection,
  semanticConfiguration,
  identifierField,
  contentField,
  embeddingField,
  useVectorQuery,
  args
) {
  console.log(`Searching for '${args.query}' in the knowledge base.`);
  let pipeline = [];

  if (useVectorQuery && Array.isArray(args.queryVector)) {
    // Use MongoDB vector search using knnBeta. Ensure your Atlas Search index supports vector search.
    pipeline.push({
      $search: {
        index: semanticConfiguration || "default", // specify your vector index if needed
        knnBeta: {
          queryVector: args.queryVector,
          path: embeddingField,
          k: 50
        }
      }
    });
  } else {
    // Use a text search.
    pipeline.push({
      $search: {
        index: semanticConfiguration || "default", // use your text search index name if needed
        text: {
          query: args.query,
          path: contentField
        }
      }
    });
  }

  // Optionally limit the results (top 5 similar to the original code)
  pipeline.push({ $limit: 5 });

  // Optionally project only the required fields.
  pipeline.push({
    $project: {
      [identifierField]: 1,
      [contentField]: 1
    }
  });

  const cursor = collection.aggregate(pipeline);
  let result = "";

  // Iterate through the aggregation results.
  await cursor.forEach((doc) => {
    result += `[${doc[identifierField]}]: ${doc[contentField]}\n-----\n`;
  });

  return new ToolResult(result, ToolResultDirection.TO_SERVER);
}

/**
 * Reports grounding by fetching the documents for the provided source keys.
 *
 * @param {Collection} collection - MongoDB collection instance.
 * @param {string} identifierField - Field name used as an identifier.
 * @param {string} titleField - Field name for document title.
 * @param {string} contentField - Field name for document content.
 * @param {Object} args - Arguments with a "sources" field that is an array of strings.
 * @returns {Promise<ToolResult>}
 */
async function _reportGroundingTool(
  collection,
  identifierField,
  titleField,
  contentField,
  args
) {
  // Filter sources to ensure they match the key pattern.
  const sources = args.sources.filter((s) => KEY_PATTERN.test(s));
  console.log(`Grounding source: ${sources.join(" OR ")}`);

  // Fetch documents where the identifier field matches one of the sources.
  const docs = await collection
    .find({ [identifierField]: { $in: sources } }, { projection: { [identifierField]: 1, [titleField]: 1, [contentField]: 1 } })
    .toArray();

  return new ToolResult({ sources: docs }, ToolResultDirection.TO_CLIENT);
}

/**
 * Attaches RAG tools to the provided RTMiddleTier instance.
 *
 * @param {Object} rtmt - Instance of RTMiddleTier.
 * @param {Collection} collection - MongoDB collection instance.
 * @param {string|null} semanticConfiguration - Optional Atlas Search index name.
 * @param {string} identifierField - Field name used as an identifier.
 * @param {string} contentField - Field name containing content.
 * @param {string} embeddingField - Field name containing the vector embedding.
 * @param {string} titleField - Field name for the title.
 * @param {boolean} useVectorQuery - Whether to use vector search.
 */
function attachRagTools(
  rtmt,
  collection,
  semanticConfiguration,
  identifierField,
  contentField,
  embeddingField,
  titleField,
  useVectorQuery
) {
  // Attach the "search" tool.
  rtmt.tools["search"] = {
    schema: _searchToolSchema,
    target: (args) =>
      _searchTool(
        collection,
        semanticConfiguration,
        identifierField,
        contentField,
        embeddingField,
        useVectorQuery,
        args
      )
  };

  // Attach the "report_grounding" tool.
  rtmt.tools["report_grounding"] = {
    schema: _groundingToolSchema,
    target: (args) =>
      _reportGroundingTool(collection, identifierField, titleField, contentField, args)
  };
}

export {
  attachRagTools,
  _searchTool,
  _reportGroundingTool,
  _searchToolSchema,
  _groundingToolSchema,
  ToolResult,
  ToolResultDirection
};
