class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffers = [];
    this.lastSendTime = currentTime;
    this.sampleRate = 24000;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    // Convert to mono by averaging all channels
    const monoData = new Float32Array(input[0].length);
    for (let i = 0; i < input[0].length; i++) {
      let sum = 0;
      for (let channel = 0; channel < input.length; channel++) {
        sum += input[channel][i];
      }
      monoData[i] = sum / input.length;
    }

    // Convert Float32 to Int16 (PCM16)
    const pcm16Data = new Int16Array(monoData.length);
    for (let i = 0; i < monoData.length; i++) {
      const s = Math.max(-1, Math.min(1, monoData[i]));
      pcm16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Store the processed buffer
    this.buffers.push(pcm16Data);

    // Send data every 1 second
    if (currentTime - this.lastSendTime >= 1) {
      if (this.buffers.length > 0) {
        const concatenated = this.concatenateBuffers(this.buffers);
        this.port.postMessage({ 
          type: 'audio',
          data: concatenated
        });
        this.buffers = [];
      }
      this.lastSendTime = currentTime;
    }

    return true;
  }

  concatenateBuffers(buffers) {
    const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
    const result = new Int16Array(totalLength);
    let offset = 0;
    
    for (const buffer of buffers) {
      result.set(buffer, offset);
      offset += buffer.length;
    }
    
    return result;
  }
}

registerProcessor('audio-processor', AudioProcessor);
