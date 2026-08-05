/**
 * Unified Event Bus for cross-module communication
 * Enables TV Automation Deck, Dawn Engine, and Dragon 9 Clock to sync
 */
class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(cb => {
        try { cb(data); } catch (e) { console.error(e); }
      });
    }
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

export const eventBus = new EventBus();

// Event constants for type safety
export const EVENTS = {
  // TV Automation
  TV_PLAY: 'tv:play',
  TV_PAUSE: 'tv:pause',
  TV_CUE_TRIGGER: 'tv:cue:trigger',
  TV_STREAM_HEALTH: 'tv:stream:health',
  TV_CAMERA_SWITCH: 'tv:camera:switch',
  TV_OVERLAY_SHOW: 'tv:overlay:show',
  TV_OVERLAY_HIDE: 'tv:overlay:hide',

  // Audio Engine
  AUDIO_PLAY: 'audio:play',
  AUDIO_PAUSE: 'audio:pause',
  AUDIO_BPM_CHANGE: 'audio:bpm:change',
  AUDIO_BEAT: 'audio:beat',
  AUDIO_PATTERN_CHANGE: 'audio:pattern:change',
  AUDIO_VOLUME_CHANGE: 'audio:volume:change',
  AUDIO_VISUALIZER_DATA: 'audio:visualizer:data',

  // Dragon 9 Clock
  D9_TICK: 'd9:tick',
  D9_APEX_ENTER: 'd9:apex:enter',
  D9_APEX_EXIT: 'd9:apex:exit',
  D9_CYCLE_CHANGE: 'd9:cycle:change',

  // Cross-module sync
  SYNC_TRIGGER: 'sync:trigger',
  SYNC_BEAT: 'sync:beat',
  SYNC_OVERLAY: 'sync:overlay',
};
