import connectDB from "../../../lib/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { sources } = req.body;
        const docs = await rag.findDocuments(sources);
        res.status(200).json(docs);
    } else {
        connectDB();
        const sample = [
            {
              content: "Sample content",
              botId: { type: String, required: true },
              documentId: { type: String, required: true },
            }
        ]
        res.status(405).end();
    }
}