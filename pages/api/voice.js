import { OpenAIRealtimeWS } from "openai/beta/realtime/ws";
import { AzureOpenAI } from "openai";
import { Server } from 'socket.io';

// Store socket connections and their Azure clients
const clients = new Map();

const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', async (socket) => {
    console.log('Client connected:', socket.id);
    
    try {
      // Initialize Azure OpenAI client
      const azureOpenAIClient = new AzureOpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        apiVersion: process.env.OPENAI_API_VERSION || "2024-10-01-preview",
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      });

      // Create realtime client
      const realtimeClient = await OpenAIRealtimeWS.azure(azureOpenAIClient);
      
      // Store client connection
      clients.set(socket.id, { socket, realtimeClient });

      // Set up Azure WebSocket handlers
      realtimeClient.socket.on("open", () => {
        console.log("Azure connection opened for client:", socket.id);
        
        // Initialize session with server VAD for turn detection
        realtimeClient.send({
          type: "session.update",
          session: {
            modalities: ["text","audio"],
            model: "gpt-4o-mini-realtime-preview",
            turn_detection: {
              "type": "server_vad",
              "threshold": 0.5,
              "prefix_padding_ms": 300,
              "silence_duration_ms": 200
            },
          },
        });
      });

      // Handle Azure WebSocket events
      realtimeClient.on("error", (err) => {
        console.error("Azure error for client:", socket.id, err);
        socket.emit('error', { message: err.message });
      });

      realtimeClient.on("session.created", (event) => {
        console.log("Session created for client:", socket.id, event.session);
        socket.emit('connected');
      });

      realtimeClient.on("turn.start", () => {
        console.log(`Speech detected for client: ${socket.id}`);
        socket.emit("turn:start");
      });

      realtimeClient.on("turn.end", () => {
        console.log(`Speech ended for client: ${socket.id}`);
        socket.emit("turn:end");
      });

      realtimeClient.on("response.audio.delta", (event) => {
        socket.emit('audio:response', { data: event.delta });
      });

      realtimeClient.on("response.audio_transcript.delta", (event) => {
        socket.emit('transcription', { text: event.delta });
      });

      realtimeClient.socket.on("close", () => {
        console.log("Azure connection closed form client:", socket.id);
        socket.disconnect(true);
      });

      // Handle client events
      socket.on('audio:stream', async (base64Data) => {
        console.log('Received audio data from client:', socket.id, socket.listenerCount('audio:stream'));
        
        try {
          // Send audio data to Azure
          realtimeClient.send({
            type: "input_audio_buffer.append",
            audio: base64Data, 
          });
          
          // Request a response
          // realtimeClient.send({ type: "response.create" });
        } catch (error) {
          console.error('Error processing audio form client:', socket.id, error);
          socket.emit('error', { message: 'Error processing audio' });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        const client = clients.get(socket.id);
        if (client?.realtimeClient) {
          client.realtimeClient.close();
        }
        clients.delete(socket.id);
      });

    } catch (error) {
      console.error('Connection error for client:', socket.id, error);
      socket.emit('error', { message: 'Failed to initialize connection' });
      socket.disconnect(true);
    }
  });

  return io;
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server');
    res.socket.server.io = setupSocketServer(res.socket.server);
  } else {
    console.log('Socket.IO server already running');
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
