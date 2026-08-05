import { eventBus, EVENTS } from './EventBus.js';

/**
 * Centralized State Manager
 * Single source of truth for all module states
 */
class StateManager {
  constructor() {
    this.state = {
      // Global
      activeView: 'split', // 'tv' | 'audio' | 'split'
      isPlaying: false,
      masterVolume: 0.8,

      // TV Deck
      tv: {
        currentCamera: 0,
        cameras: [
          { id: 0, name: 'CAM-01 Wide', status: 'live', health: 98 },
          { id: 1, name: 'CAM-02 Close', status: 'standby', health: 100 },
          { id: 2, name: 'CAM-03 Drone', status: 'standby', health: 95 },
          { id: 3, name: 'CAM-04 Handheld', status: 'standby', health: 100 },
        ],
        playlist: [
          { id: 1, name: 'Opening Sequence', duration: 45, type: 'video', status: 'playing' },
          { id: 2, name: 'Host Intro', duration: 120, type: 'live', status: 'queued' },
          { id: 3, name: 'Segment A', duration: 300, type: 'video', status: 'queued' },
          { id: 4, name: 'Break Bumper', duration: 15, type: 'graphic', status: 'queued' },
        ],
        currentCue: 0,
        streamHealth: 98,
        overlays: [],
        isLive: false,
      },

      // Audio Engine
      audio: {
        bpm: 128,
        pattern: 'house',
        patterns: ['dub', 'reggae', 'house', 'techno', 'ambient'],
        isPlaying: false,
        masterGain: 0.8,
        channels: [
          { id: 'kick', name: 'Kick', gain: 0.9, muted: false, color: '#00f5ff' },
          { id: 'snare', name: 'Snare', gain: 0.7, muted: false, color: '#ff00ff' },
          { id: 'hihat', name: 'Hi-Hat', gain: 0.6, muted: false, color: '#ffb700' },
          { id: 'bass', name: 'Bass', gain: 0.8, muted: false, color: '#6bcb77' },
          { id: 'pad', name: 'Pad', gain: 0.5, muted: true, color: '#e94560' },
          { id: 'lead', name: 'Lead', gain: 0.6, muted: true, color: '#ffd93d' },
        ],
        visualizerData: new Uint8Array(128),
      },

      // Dragon 9 Clock
      dragon9: {
        standardTime: new Date(),
        dragonHour: 0,
        dragonMinute: 0,
        dragonSecond: 0,
        cycle: 1, // 1 or 2
        isApex: false,
        apexProgress: 0,
        dayProgress: 0,
      },
    };

    this.subscribers = new Set();
  }

  getState() {
    return this.state;
  }

  setState(path, value) {
    const keys = path.split('.');
    let target = this.state;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    this.notify();
  }

  updateState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.state));
  }

  // TV Actions
  switchCamera(index) {
    this.state.tv.currentCamera = index;
    this.state.tv.cameras.forEach((cam, i) => {
      cam.status = i === index ? 'live' : 'standby';
    });
    eventBus.emit(EVENTS.TV_CAMERA_SWITCH, { camera: index });
    this.notify();
  }

  triggerCue(cueId) {
    this.state.tv.currentCue = cueId;
    eventBus.emit(EVENTS.TV_CUE_TRIGGER, { cueId });
    // Auto-sync to audio
    eventBus.emit(EVENTS.SYNC_TRIGGER, { source: 'tv', cueId });
    this.notify();
  }

  setOverlay(overlay) {
    this.state.tv.overlays.push(overlay);
    eventBus.emit(EVENTS.TV_OVERLAY_SHOW, overlay);
    this.notify();
  }

  // Audio Actions
  setBPM(bpm) {
    this.state.audio.bpm = bpm;
    eventBus.emit(EVENTS.AUDIO_BPM_CHANGE, { bpm });
    this.notify();
  }

  setPattern(pattern) {
    this.state.audio.pattern = pattern;
    eventBus.emit(EVENTS.AUDIO_PATTERN_CHANGE, { pattern });
    this.notify();
  }

  toggleChannelMute(channelId) {
    const ch = this.state.audio.channels.find(c => c.id === channelId);
    if (ch) {
      ch.muted = !ch.muted;
      this.notify();
    }
  }

  setChannelGain(channelId, gain) {
    const ch = this.state.audio.channels.find(c => c.id === channelId);
    if (ch) {
      ch.gain = gain;
      this.notify();
    }
  }

  // Dragon 9 Actions
  updateDragon9(data) {
    this.state.dragon9 = { ...this.state.dragon9, ...data };
    this.notify();
  }
}

export const stateManager = new StateManager();
