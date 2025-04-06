import { useState, useEffect, useRef } from 'react';
import { PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import { RTClient } from 'rt-client';

// Import the AudioHandler class (ensure its file path is correct)
import AudioHandler from './lib/audio'; // adjust the path as needed

// Helper function to wrap PCM16 data in a WAV header
function createWavFile(pcmData, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.byteLength, true);
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size for PCM
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.byteLength, true);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // Combine the header and PCM data into one buffer
  const wavBuffer = new Uint8Array(wavHeader.byteLength + pcmData.byteLength);
  wavBuffer.set(new Uint8Array(wavHeader), 0);
  wavBuffer.set(new Uint8Array(pcmData), wavHeader.byteLength);
  return wavBuffer.buffer;
}

const instructions =  `Role:
You are an AI assistant designed to help customers with their queries related to WiseOwl. Your goal is to provide accurate and helpful responses while ensuring a smooth and friendly interaction.

Instructions:

Greet the Customer:

Start every conversation with a warm and professional greeting:
"Hello! Thanks for contacting WiseOwl. How can I assist you today?"

Provide Relevant Support:

Only answer queries specifically related to WiseOwl and its services.

1. If the customer asks about unrelated topics, politely inform them:
"I'm here to assist with WiseOwl-related questions. Let me know how I can help!"
2. Be polite, concise, and professional while ensuring the customer feels heard.
3. Provide step-by-step guidance when necessary.
4. If an issue requires further assistance, suggest contacting using support@wiseowl.space

at any point if you are not able to understand the query, ask the customer to repeat them.
`

const VoiceBot = () => {
  const [isListening, setIsListening] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('disconnected');

  // Remove manual audio context, source and worklet nodes
  const callTimerRef = useRef(null);
  const clientRef = useRef(null);
  const audioHandlerRef = useRef(null);

  // Get configuration values from environment variables
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
  const modelName = process.env.NEXT_PUBLIC_MODEL_NAME; // used as deployment name

  // Initialize RTClient connection
  const initRTClient = () => {
    try {
      clientRef.current = new RTClient(new URL(endpoint), { key: apiKey }, { deployment: modelName });

      const modalities= ["text", "audio"]
        const turnDetection = { type: "server_vad" }
        const temperature = 0.9;

        clientRef.current.configure({
          instructions: instructions?.length > 0 ? instructions : undefined,
          input_audio_transcription: { model: "whisper-1" },
          turn_detection: turnDetection,
          temperature,
          modalities,
        });
      // Start listening for RTClient responses (transcriptions, etc.)
      console.log('RTClient initialized:', clientRef.current);
      
      startResponseListener();
      setStatus('ready');
    } catch (error) {
      console.error('RTClient initialization failed:', error);
      setStatus('error');
    }
  };

  // Listen for responses from Azure via RTClient
  const startResponseListener = async () => {
    if (!clientRef.current) return;
    try {
      for await (const serverEvent of clientRef.current.events()) {
        console.log('Server event:', serverEvent);
        
        if (serverEvent.type === "response") {
          await handleResponse(serverEvent);
        } else if (serverEvent.type === "input_audio") {
          await handleInputAudio(serverEvent);
        }
        // Extend handling for additional event types as needed.
      }
    } catch (error) {
      console.error('Response iteration error:', error);
    }
  };

  const handleInputAudio = async (item) => {
    audioHandlerRef.current?.stopStreamingPlayback();
    await item.waitForCompletion();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "user",
        content: item.transcription || "",
      },
    ]);
  };


  
  const handleResponse = async (response) => {
    for await (const item of response) {
      if (item.type === "message" && item.role === "assistant") {
        const message = {
          type: item.role,
          content: "",
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        for await (const content of item) {
          if (content.type === "text") {
            for await (const text of content.textChunks()) {
              message.content += text;
              setMessages((prevMessages) => {
                prevMessages[prevMessages.length - 1].content = message.content;
                return [...prevMessages];
              });
            }
          } else if (content.type === "audio") {
            const textTask = async () => {
              for await (const text of content.transcriptChunks()) {
                message.content += text;
                setMessages((prevMessages) => {
                  prevMessages[prevMessages.length - 1].content =
                    message.content;
                  return [...prevMessages];
                });
              }
            };
            const audioTask = async () => {
              audioHandlerRef.current?.startStreamingPlayback();
              for await (const audio of content.audioChunks()) {
                audioHandlerRef.current?.playChunk(audio);
              }
            };
            await Promise.all([textTask(), audioTask()]);
          }
        }
      }
    }
  };


  const startListening = async () => {
    try {
      // Initialize RTClient if not already done
      if (!clientRef.current) {
        initRTClient();
        console.log('Initializing RTClient...');
        
      }
      setStatus('connecting');

      // Initialize AudioHandler if needed
      if (!audioHandlerRef.current) {
        console.log('Initializing AudioHandler...');
        
        audioHandlerRef.current = new AudioHandler();
        await audioHandlerRef.current.initialize();
        console.log('AudioHandler initialized:', audioHandlerRef.current);
        
      }

      // Start recording using AudioHandler. For every audio chunk, send it to Azure.
      await audioHandlerRef.current.startRecording(async(chunk) => {        
        if (clientRef.current) {        
          await clientRef.current.sendAudio(chunk);
        }
      });

      setIsListening(true);
      setMessages([]);

      // Start call duration timer
      const startTime = Date.now();
      callTimerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      setStatus('ready');
    } catch (error) {
      console.error('Error starting listening:', error);
      setStatus('error');
    }
  };

  // Stop recording and finish sending audio to Azure
  const stopListening = async () => {
    try {
      if (audioHandlerRef.current) {
        audioHandlerRef.current.stopRecording();
        audioHandlerRef.current.stopStreamingPlayback();
      }

      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }

      // If RTClient is active, commit the audio and trigger final processing
      if (clientRef.current) {
        try {
          const inputAudio = await clientRef.current.commitAudio();
          // Optionally, trigger further response generation here.
          // e.g., await clientRef.current.generateResponse();
        } catch (error) {
          console.error('Error committing audio:', error);
        }
      }

      setIsListening(false);
      setCallDuration(0);
      setStatus('disconnected');
    } catch (error) {
      console.error('Error stopping listening:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsFullScreen(false);
    } else {
      setIsFullScreen(true);
      startListening();
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopListening();
      audioHandlerRef.current?.close().catch(console.error);
      clientRef.current = null;
    };
  }, []);
  useEffect(() => {
    const initAudioHandler = async () => {
      const handler = new AudioHandler();
      await handler.initialize();
      audioHandlerRef.current = handler;
    };

    initAudioHandler().catch(console.error);

    return () => {
      // disconnect();
      audioHandlerRef.current?.close().catch(console.error);
    };
  }, []);

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 bg-black' : 'fixed bottom-8 right-8'} flex flex-col items-end gap-4`}>
      {isFullScreen ? (
        
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="text-white text-2xl font-bold mb-2">WiseOwl</div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                status === 'ready'
                  ? 'bg-green-500'
                  : status === 'connecting'
                  ? 'bg-yellow-500'
                  : status === 'error'
                  ? 'bg-red-500'
                  : 'bg-gray-500'
              }`}
            />
            <span className="text-sm text-gray-600 capitalize">{status}</span>
          </div>
          <div className="text-white text-lg mb-8">
            {status === 'connecting' ? 'Connecting...' : `Call Duration: ${callDuration}s`}
          </div>
          <div className="flex-1 px-8 overflow-y-auto">
            {messages.map((message, index) => (
              message.content.length > 0 ? <div
                key={index}
                className={`mb-4 p-3 rounded-lg${
                  message.type === "user"
                    ? " bg-slate-200 ml-auto max-w-[80%]"
                    : " bg-slate-600 mr-auto max-w-[80%]"
                }`}
              >
                {message.content}
              </div> : null
            ))}
          </div>
          <div className='p-8'>
            <button
                onClick={toggleListening}
                className="p-6 rounded-full text-white bg-red-600 hover:bg-red-700 shadow-lg"
              >
                <PhoneXMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            Lets Connect
          </div>
          <button
            onClick={toggleListening}
            className="p-4 rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            {isListening ? (
              <PhoneXMarkIcon className="h-6 w-6" />
            ) : (
              <PhoneIcon className="h-6 w-6" />
            )}
          </button>
          
        </>
        
      )}
    </div>
  );
};

export default VoiceBot;
