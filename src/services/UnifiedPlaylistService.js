/**
 * Unified Playlist Service
 * Master broadcast queue supporting:
 * - youtube: YouTube video IDs (TV Deck playback)
 * - radio: Station registry entries (Dawn Engine channel)
 * - file: Local audio files (Dawn Engine channel)
 * - synth: Pattern + channel assignment (Dawn Engine)
 * - tv_cue: Camera switch + overlay (TV Deck)
 * - d9_trigger: Dragon 9 event (time-based automation)
 */

import { eventBus, EVENTS } from './EventBus.js';
import { stateManager } from './StateManager.js';
import { audioRouter } from './AudioRouter.js';
import { youtubeService } from './YouTubeService.js';
import { radioService, STATION_REGISTRY } from './RadioStationService.js';

export const PLAYLIST_TYPES = [
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#ff0000', deck: 'tv' },
  { id: 'radio', name: 'Radio', icon: '📻', color: '#00f5ff', deck: 'audio' },
  { id: 'file', name: 'File', icon: '📁', color: '#6bcb77', deck: 'audio' },
  { id: 'synth', name: 'Synth', icon: '🔧', color: '#ff00ff', deck: 'audio' },
  { id: 'tv_cue', name: 'TV Cue', icon: '📺', color: '#ffb700', deck: 'tv' },
  { id: 'd9_trigger', name: 'D9 Event', icon: '🐉', color: '#ffd93d', deck: 'both' },
];

class UnifiedPlaylistService {
  constructor() {
    this.queue = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.autoAdvance = true;
    this.listeners = new Set();
    this.timer = null;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.getState()));
  }

  getState() {
    return {
      queue: this.queue,
      currentIndex: this.currentIndex,
      isPlaying: this.isPlaying,
      autoAdvance: this.autoAdvance,
      currentItem: this.currentIndex >= 0 ? this.queue[this.currentIndex] : null,
    };
  }

  addItem(item) {
    const enriched = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      addedAt: new Date().toISOString(),
      status: 'queued',
      ...item,
    };
    this.queue.push(enriched);
    this.notify();
    return enriched.id;
  }

  removeItem(id) {
    const idx = this.queue.findIndex(i => i.id === id);
    if (idx === -1) return;

    // Adjust current index if removing before or at current
    if (idx < this.currentIndex) this.currentIndex--;
    else if (idx === this.currentIndex) this.stop();

    this.queue.splice(idx, 1);
    this.notify();
  }

  moveItem(id, direction) {
    const idx = this.queue.findIndex(i => i.id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= this.queue.length) return;

    [this.queue[idx], this.queue[newIdx]] = [this.queue[newIdx], this.queue[idx]];
    this.notify();
  }

  async playIndex(index) {
    if (index < 0 || index >= this.queue.length) return;

    // Stop current
    this.stopCurrent();

    this.currentIndex = index;
    this.isPlaying = true;
    const item = this.queue[index];
    item.status = 'playing';
    item.startedAt = Date.now();

    // Execute based on type
    await this.executeItem(item);

    this.notify();

    // Auto-advance timer
    if (this.autoAdvance && item.duration) {
      this.timer = setTimeout(() => this.next(), item.duration * 1000);
    }
  }

  async executeItem(item) {
    switch (item.type) {
      case 'youtube':
        // Emit to TV Deck
        eventBus.emit('playlist:youtube', { videoId: item.videoId, title: item.title });
        stateManager.setState('tv.currentCue', this.currentIndex);
        break;

      case 'radio':
        // Route to Dawn Engine channel
        if (item.channelId && item.stationId) {
          const station = STATION_REGISTRY.find(s => s.id === item.stationId);
          if (station) {
            audioRouter.routeChannel(item.channelId, 'radio', { station });
          }
        }
        break;

      case 'file':
        if (item.channelId && item.url) {
          audioRouter.routeChannel(item.channelId, 'file', { url: item.url, name: item.name });
        }
        break;

      case 'synth':
        // Set pattern and route channel to synth
        if (item.pattern) {
          stateManager.setState('audio.pattern', item.pattern);
        }
        if (item.channelId) {
          audioRouter.routeChannel(item.channelId, 'synth');
        }
        // Auto-start if not playing
        const { audio } = stateManager.getState();
        if (!audio.isPlaying) {
          eventBus.emit(EVENTS.AUDIO_PLAY, {});
        }
        break;

      case 'tv_cue':
        if (item.cameraIndex !== undefined) {
          stateManager.switchCamera(item.cameraIndex);
        }
        if (item.overlay) {
          stateManager.setOverlay(item.overlay);
        }
        eventBus.emit(EVENTS.TV_CUE_TRIGGER, { cueId: this.currentIndex });
        break;

      case 'd9_trigger':
        // Time-based triggers handled by clock
        eventBus.emit('playlist:d9', { event: item.event, data: item.data });
        break;
    }
  }

  stopCurrent() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.currentIndex >= 0 && this.currentIndex < this.queue.length) {
      this.queue[this.currentIndex].status = 'completed';
    }
  }

  play() {
    if (this.currentIndex === -1 && this.queue.length > 0) {
      this.playIndex(0);
    } else if (this.currentIndex >= 0) {
      this.playIndex(this.currentIndex);
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.currentIndex >= 0) {
      this.queue[this.currentIndex].status = 'paused';
    }
    this.notify();
  }

  next() {
    if (this.currentIndex + 1 < this.queue.length) {
      this.playIndex(this.currentIndex + 1);
    } else {
      this.stop();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.playIndex(this.currentIndex - 1);
    }
  }

  stop() {
    this.stopCurrent();
    this.isPlaying = false;
    this.currentIndex = -1;
    this.notify();
  }

  clear() {
    this.stop();
    this.queue = [];
    this.notify();
  }

  setAutoAdvance(val) {
    this.autoAdvance = val;
    this.notify();
  }

  // Quick add helpers
  addYouTube(videoId, title, duration = 0) {
    return this.addItem({ type: 'youtube', videoId, title, duration });
  }

  addRadio(stationId, channelId = 'pad', duration = 0) {
    const station = STATION_REGISTRY.find(s => s.id === stationId);
    return this.addItem({ 
      type: 'radio', 
      stationId, 
      channelId, 
      duration,
      title: station?.name || stationId,
    });
  }

  addFile(url, name, channelId = 'pad', duration = 0) {
    return this.addItem({ type: 'file', url, name, channelId, duration });
  }

  addSynth(pattern, channelId = 'kick', duration = 300) {
    return this.addItem({ type: 'synth', pattern, channelId, duration });
  }

  addTVCue(cameraIndex, overlay = null, duration = 10) {
    return this.addItem({ type: 'tv_cue', cameraIndex, overlay, duration });
  }

  addD9Trigger(event, data = {}, duration = 0) {
    return this.addItem({ type: 'd9_trigger', event, data, duration });
  }
}

export const unifiedPlaylist = new UnifiedPlaylistService();
