import { useState, useEffect, useRef } from 'react';
import { PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import io from 'socket.io-client';

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

const VoiceBot = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('disconnected');

  const socketRef = useRef(null);
  const audioContext = useRef(null);
  const audioQueue = useRef([]);
  const isProcessingAudio = useRef(false);
  const streamRef = useRef(null);
  const sourceNode = useRef(null);
  const workletNode = useRef(null);
  const audioBufferRef = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initAudio = async () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext.current = new AudioContext({ sampleRate: 24000 });
        // Load your audio worklet processor
        await audioContext.current.audioWorklet.addModule('/audio-processor.js');
        console.log('Audio worklet loaded successfully');
      } catch (error) {
        console.error('Error loading audio worklet:', error);
      }
    };

    initAudio();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initSocket = async () => {
      // Initialize socket server
      await fetch('/api/voice');
      const socket = io();
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket connected');
        setStatus('connected');
      });

      socket.on('connected', () => {
        console.log('Azure session ready');
        setStatus('ready');
      });

      socket.on('transcription', ({ text }) => {
        setMessages((prev) => [...prev, { type: 'user', text }]);
      });

      socket.on('audio:response', ({ data }) => {
        console.log('Received audio response');
        // Convert base64 encoded string back to a buffer
        const audioData = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
        playAudioResponse(audioData.buffer);
      });

      socket.on('error', ({ message }) => {
        console.error('Server error:', message);
        setStatus('error');
        stopListening();
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setStatus('disconnected');
        stopListening();
      });
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (audioContext.current?.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, []);

  const playAudioResponse = async (audioBufferData) => {
    try {
      // Add the incoming audio buffer to the queue
      audioQueue.current.push(audioBufferData);

      if (!isProcessingAudio.current) {
        processAudioQueue();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const processAudioQueue = async () => {
    if (audioQueue.current.length === 0 || !audioContext.current) {
      isProcessingAudio.current = false;
      return;
    }

    isProcessingAudio.current = true;
    const buffer = audioQueue.current.shift();

    try {
      if (audioContext.current.state === 'suspended') {
        console.log('Resuming audio context');
        await audioContext.current.resume();
      }

      console.log('Playing audio response', buffer);
      // Wrap the raw PCM16 data in a WAV header
      const wavBuffer = createWavFile(buffer, 24000, 1, 16);
      const decodedAudioBuffer = await audioContext.current.decodeAudioData(wavBuffer);
      if (!decodedAudioBuffer) return;

      const source = audioContext.current.createBufferSource();
      source.buffer = decodedAudioBuffer;
      source.connect(audioContext.current.destination);

      source.onended = () => {
        processAudioQueue();
      };

      source.start();
    } catch (error) {
      console.error('Error processing audio:', error);
      processAudioQueue();
    }
  };

  const startListening = async () => {
    try {
      if (typeof window === 'undefined') return;
      if (!socketRef.current?.connected) {
        console.log('Socket not connected');
        return;
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Media devices not supported');
      }

      // Request audio input
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000,
        },
      });

      streamRef.current = stream;

      // Set up audio processing chain
      sourceNode.current = audioContext.current.createMediaStreamSource(stream);
      workletNode.current = new AudioWorkletNode(audioContext.current, 'audio-processor');

      audioBufferRef.current = [];

      // Buffer audio and send every 1 second
      intervalRef.current = setInterval(() => {
        if (audioBufferRef.current.length > 0) {
          const base64Data = btoa(
            String.fromCharCode(...new Uint8Array(audioBufferRef.current.flat()))
          );
          socketRef.current.emit('audio:stream', base64Data);
          audioBufferRef.current = [];
        }
      }, 1000);

      // Handle audio data from worklet
      workletNode.current.port.onmessage = (event) => {
        if (event.data.type === 'audio' && socketRef.current?.connected) {
          audioBufferRef.current.push([...new Uint8Array(event.data.data.buffer)]);
        }
      };

      // Connect audio nodes
      sourceNode.current.connect(workletNode.current);
      workletNode.current.connect(audioContext.current.destination);

      setIsListening(true);
      setMessages([]);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setStatus('error');
    }
  };

  const stopListening = () => {
    // Clean up audio resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (sourceNode.current) {
      sourceNode.current.disconnect();
      sourceNode.current = null;
    }

    if (workletNode.current) {
      workletNode.current.disconnect();
      workletNode.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status === 'ready'
                ? 'bg-green-500'
                : status === 'connected'
                ? 'bg-yellow-500'
                : status === 'error'
                ? 'bg-red-500'
                : 'bg-gray-500'
            }`}
          />
          <span className="text-sm text-gray-600 capitalize">{status}</span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                msg.type === 'user' ? 'bg-blue-100' : 'bg-green-100'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </div>
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
    </div>
  );
};

export default VoiceBot;
