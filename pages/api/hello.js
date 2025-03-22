// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIRealtimeWS } from "openai/beta/realtime/ws";
import { AzureOpenAI } from "openai";
export default async (req, res) => {
   // You will need to set these environment variables or edit the following values
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "AZURE_OPENAI_ENDPOINT";
      const apiKey = process.env.AZURE_OPENAI_API_KEY || "Your API key";
      // Required Azure OpenAI deployment name and API version
      const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini-realtime-preview";
      const apiVersion = process.env.OPENAI_API_VERSION || "2024-10-01-preview";
      const azureOpenAIClient = new AzureOpenAI({
          apiKey: apiKey,
          apiVersion: apiVersion,
          deployment: deploymentName,
          endpoint: endpoint,
      });
      const realtimeClient = await OpenAIRealtimeWS.azure(azureOpenAIClient);
      realtimeClient.socket.on("open", () => {
          console.log("Connection opened!");
          realtimeClient.send({
              type: "session.update",
              session: {
                  modalities: ["text", "audio"],
                  model: "gpt-4o-mini-realtime-preview",
              },
          });
          realtimeClient.send({
              type: "conversation.item.create",
              item: {
                  type: "message",
                  role: "user",
                  content: [{ type: "input_text", text: "Please assist the user" }],
              },
          });
          realtimeClient.send({ type: "response.create" });
      });
      realtimeClient.on("error", (err) => {
          // Instead of throwing the error, you can log it
          // and continue processing events.
          throw err;
      });
      realtimeClient.on("session.created", (event) => {
          console.log("session created!", event.session);
          console.log();
      });
      realtimeClient.on("response.text.delta", (event) => process.stdout.write(event.delta));
      realtimeClient.on("response.audio.delta", (event) => {
          const buffer = Buffer.from(event.delta, "base64");
          console.log(`Received ${buffer.length} bytes of audio data.`);
      });
      realtimeClient.on("response.audio_transcript.delta", (event) => {
          console.log(`Received text delta:${event.delta}.`);
      });
      realtimeClient.on("response.text.done", () => console.log());
      realtimeClient.on("response.done", () => realtimeClient.close());
      realtimeClient.socket.on("close", () => console.log("\nConnection closed!"));
}
