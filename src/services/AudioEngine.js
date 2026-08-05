import { eventBus, EVENTS } from './EventBus.js';

/**
 * Dawn Engine — Web Audio API Synthesizer
 * Real-time beat generation with dub/reggae/house/techno/ambient patterns
 */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.isPlaying = false;
    this.bpm = 128;
    this.nextNoteTime = 0;
    this.scheduleAheadTime = 0.1;
    this.lookahead = 25;
    this.timerID = null;
    this.currentPattern = 'house';
    this.currentStep = 0;
    this.sixteenthNote = 0;

    // Channel gains
    this.channels = {};

    // Patterns (1 = hit, 0 = rest)
    this.patterns = {
      house: {
        kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        bass:  [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,1,0,0],
        pad:   [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        lead:  [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,1,0,0],
      },
      dub: {
        kick:  [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        bass:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
        pad:   [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        lead:  [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
      },
      reggae: {
        kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        bass:  [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,1,0,0],
        pad:   [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        lead:  [0,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
      },
      techno: {
        kick:  [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [0,0,1,1, 0,0,1,1, 0,0,1,1, 0,0,1,1],
        bass:  [1,1,0,1, 1,0,1,1, 1,1,0,1, 1,0,1,1],
        pad:   [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        lead:  [0,0,0,0, 0,1,0,0, 0,0,0,0, 0,1,0,0],
      },
      ambient: {
        kick:  [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        hihat: [0,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
        bass:  [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
        pad:   [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
        lead:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      },
    };

    this.channelConfig = {
      kick: { type: 'sine', freq: 60, decay: 0.3, gain: 0.9 },
      snare: { type: 'triangle', freq: 200, noise: true, decay: 0.15, gain: 0.7 },
      hihat: { type: 'highpass', freq: 8000, noise: true, decay: 0.05, gain: 0.4 },
      bass: { type: 'sawtooth', freq: 55, decay: 0.4, gain: 0.6, filter: true },
      pad: { type: 'sawtooth', freq: 220, decay: 1.5, gain: 0.3, filter: true },
      lead: { type: 'square', freq: 440, decay: 0.3, gain: 0.4, filter: true },
    };
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Create channel gains
      Object.keys(this.channelConfig).forEach(key => {
        const g = this.ctx.createGain();
        g.gain.value = this.channelConfig[key].gain;
        g.connect(this.masterGain);
        this.channels[key] = g;
      });
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play() {
    this.init();
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.currentStep = 0;
    this.scheduler();
    eventBus.emit(EVENTS.AUDIO_PLAY, {});
  }

  pause() {
    this.isPlaying = false;
    if (this.timerID) clearTimeout(this.timerID);
    eventBus.emit(EVENTS.AUDIO_PAUSE, {});
  }

  scheduler() {
    if (!this.isPlaying) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.nextNote();
    }

    this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
  }

  nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    const secondsPerStep = secondsPerBeat / 4; // 16th notes
    this.nextNoteTime += secondsPerStep;
    this.currentStep = (this.currentStep + 1) % 16;

    if (this.currentStep === 0) {
      eventBus.emit(EVENTS.AUDIO_BEAT, { step: 0, time: this.nextNoteTime });
    }
  }

  scheduleNote(step, time) {
    const pattern = this.patterns[this.currentPattern];
    if (!pattern) return;

    Object.keys(pattern).forEach(channel => {
      if (pattern[channel][step] === 1) {
        this.triggerSound(channel, time);
      }
    });
  }

  triggerSound(channel, time) {
    const config = this.channelConfig[channel];
    const channelGain = this.channels[channel];
    if (!channelGain || channelGain.gain.value <= 0.001) return;

    const env = this.ctx.createGain();
    env.connect(channelGain);

    if (config.noise) {
      const bufferSize = this.ctx.sampleRate * config.decay;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      if (config.type === 'highpass') {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = config.freq;
        noise.connect(filter);
        filter.connect(env);
      } else {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = config.freq;
        filter.Q.value = 1;
        noise.connect(filter);
        filter.connect(env);
      }

      env.gain.setValueAtTime(config.gain, time);
      env.gain.exponentialRampToValueAtTime(0.001, time + config.decay);
      noise.start(time);
      noise.stop(time + config.decay);
    } else {
      const osc = this.ctx.createOscillator();
      osc.type = config.type;

      if (channel === 'kick') {
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(config.freq, time + 0.05);
      } else {
        osc.frequency.setValueAtTime(config.freq, time);
      }

      if (config.filter) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = channel === 'bass' ? 400 : 2000;
        filter.Q.value = 2;
        osc.connect(filter);
        filter.connect(env);
      } else {
        osc.connect(env);
      }

      env.gain.setValueAtTime(config.gain, time);
      env.gain.exponentialRampToValueAtTime(0.001, time + config.decay);
      osc.start(time);
      osc.stop(time + config.decay);
    }
  }

  setBPM(bpm) {
    this.bpm = Math.max(60, Math.min(200, bpm));
    eventBus.emit(EVENTS.AUDIO_BPM_CHANGE, { bpm: this.bpm });
  }

  setPattern(pattern) {
    if (this.patterns[pattern]) {
      this.currentPattern = pattern;
      eventBus.emit(EVENTS.AUDIO_PATTERN_CHANGE, { pattern });
    }
  }

  setMasterVolume(vol) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  setChannelGain(channel, gain) {
    if (this.channels[channel]) {
      this.channels[channel].gain.setTargetAtTime(gain, this.ctx.currentTime, 0.05);
    }
  }

  muteChannel(channel, muted) {
    if (this.channels[channel]) {
      this.channels[channel].gain.setTargetAtTime(muted ? 0.0001 : this.channelConfig[channel].gain, this.ctx.currentTime, 0.05);
    }
  }

  getVisualizerData() {
    if (!this.analyser) return new Uint8Array(128);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  getWaveformData() {
    if (!this.analyser) return new Uint8Array(128);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  destroy() {
    this.pause();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const audioEngine = new AudioEngine();
