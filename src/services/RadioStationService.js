/**
 * Radio Station Service
 * Manages live stream registry, tuning, and genre filtering
 * Supports Icecast/Shoutcast streams and talkback mic input
 */

export const RADIO_GENRES = [
  { id: 'reggae', name: 'REGGAE', color: '#ffd93d', icon: '🌴' },
  { id: 'dub', name: 'DUB', color: '#6bcb77', icon: '🔊' },
  { id: 'house', name: 'HOUSE', color: '#00f5ff', icon: '🏠' },
  { id: 'techno', name: 'TECHNO', color: '#ff00ff', icon: '⚡' },
  { id: 'ambient', name: 'AMBIENT', color: '#e94560', icon: '🌫️' },
  { id: 'talkback', name: 'TALKBACK', color: '#ffb700', icon: '🎙️' },
  { id: 'jazz', name: 'JAZZ', color: '#ff6b6b', icon: '🎷' },
  { id: 'classical', name: 'CLASSICAL', color: '#a78bfa', icon: '🎻' },
  { id: 'news', name: 'NEWS', color: '#f87171', icon: '📰' },
  { id: 'sports', name: 'SPORTS', color: '#34d399', icon: '🏈' },
];

// Known open radio streams (Icecast/Shoutcast compatible)
// These are public domain / creative commons stations
export const STATION_REGISTRY = [
  // REGGAE / DUB
  { id: 'reggae1', name: 'Reggae King', genre: 'reggae', region: 'Jamaica', url: 'https://stream.zeno.fm/0r0xa792kwzuv', bitrate: '128k' },
  { id: 'dub1', name: 'Dub Lab', genre: 'dub', region: 'UK', url: 'https://stream.dublab.com/main', bitrate: '128k' },
  { id: 'roots1', name: 'Roots Legacy', genre: 'reggae', region: 'France', url: 'https://rootslegacy.fr:8080/stream', bitrate: '192k' },

  // HOUSE / TECHNO
  { id: 'house1', name: 'Deep House Lounge', genre: 'house', region: 'USA', url: 'https://deephouselounge.com/stream', bitrate: '128k' },
  { id: 'techno1', name: 'Techno Club', genre: 'techno', region: 'Germany', url: 'https://stream.techno.fm/live.mp3', bitrate: '192k' },
  { id: 'house2', name: 'House Nation', genre: 'house', region: 'UK', url: 'https://stream.housenation.uk/radio', bitrate: '128k' },

  // AMBIENT
  { id: 'ambient1', name: 'StillStream', genre: 'ambient', region: 'Global', url: 'https://stillstream.fm/stream', bitrate: '128k' },
  { id: 'drone1', name: 'Drone Zone', genre: 'ambient', region: 'USA', url: 'https://somafm.com/dronezone130.pls', bitrate: '128k' },

  // TALKBACK / NEWS
  { id: 'talk1', name: 'Community Radio', genre: 'talkback', region: 'NZ', url: 'https://stream.radiosport.nz', bitrate: '64k' },
  { id: 'news1', name: 'World News', genre: 'news', region: 'Global', url: 'https://stream.bbc.co.uk/news', bitrate: '96k' },

  // JAZZ / CLASSICAL
  { id: 'jazz1', name: 'Jazz Cafe', genre: 'jazz', region: 'USA', url: 'https://jazzcafelive.com/stream', bitrate: '128k' },
  { id: 'classical1', name: 'Classical FM', genre: 'classical', region: 'Europe', url: 'https://classicalfm.stream', bitrate: '192k' },
];

class RadioStationService {
  constructor() {
    this.activeStreams = new Map(); // channelId -> Audio
    this.micStream = null;
    this.micSource = null;
    this.onAir = false;
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach(cb => cb(data));
  }

  /**
   * Tune a radio station to a specific channel
   */
  tuneStation(channelId, station, audioCtx, destination) {
    this.stopChannel(channelId);

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = station.url;
    audio.volume = 0.8;

    // Connect to Web Audio for visualization
    if (audioCtx && destination) {
      try {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(destination);
      } catch (e) {
        // Already connected or CORS issue
      }
    }

    audio.play().catch(e => console.warn('Stream play failed:', e));
    this.activeStreams.set(channelId, { audio, station, type: 'radio' });
    this.notify({ channelId, station, type: 'radio', action: 'play' });
  }

  /**
   * Start talkback mic on a channel
   */
  async startTalkback(channelId, audioCtx, destination) {
    this.stopChannel(channelId);

    try {
      if (!this.micStream) {
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (audioCtx && destination) {
        const source = audioCtx.createMediaStreamSource(this.micStream);
        // Add a gain node for mic level
        const gain = audioCtx.createGain();
        gain.gain.value = 0.9;
        source.connect(gain);
        gain.connect(destination);
        this.activeStreams.set(channelId, { source, gain, type: 'talkback', stream: this.micStream });
        this.onAir = true;
        this.notify({ channelId, type: 'talkback', action: 'play' });
      }
    } catch (e) {
      console.error('Mic access denied:', e);
    }
  }

  /**
   * Play local file on a channel
   */
  playFile(channelId, fileUrl, audioCtx, destination) {
    this.stopChannel(channelId);

    const audio = new Audio();
    audio.src = fileUrl;
    audio.volume = 0.8;

    if (audioCtx && destination) {
      try {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(destination);
      } catch (e) {}
    }

    audio.play();
    this.activeStreams.set(channelId, { audio, type: 'file', name: fileUrl });
    this.notify({ channelId, type: 'file', action: 'play' });
  }

  /**
   * Stop a specific channel
   */
  stopChannel(channelId) {
    const stream = this.activeStreams.get(channelId);
    if (!stream) return;

    if (stream.audio) {
      stream.audio.pause();
      stream.audio.src = '';
    }
    if (stream.source) {
      try { stream.source.disconnect(); } catch (e) {}
    }
    if (stream.gain) {
      try { stream.gain.disconnect(); } catch (e) {}
    }

    this.activeStreams.delete(channelId);
    this.notify({ channelId, type: stream.type, action: 'stop' });
  }

  /**
   * Set volume for a channel stream
   */
  setChannelVolume(channelId, vol) {
    const stream = this.activeStreams.get(channelId);
    if (stream?.audio) {
      stream.audio.volume = vol;
    }
    if (stream?.gain) {
      stream.gain.gain.setValueAtTime(vol, 0);
    }
  }

  /**
   * Get stations by genre
   */
  getStationsByGenre(genre) {
    return STATION_REGISTRY.filter(s => s.genre === genre);
  }

  /**
   * Get all active streams
   */
  getActiveStreams() {
    return Array.from(this.activeStreams.entries()).map(([id, data]) => ({
      channelId: id,
      type: data.type,
      station: data.station,
      name: data.name || data.station?.name,
    }));
  }

  /**
   * Stop all streams
   */
  stopAll() {
    this.activeStreams.forEach((_, channelId) => this.stopChannel(channelId));
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    this.onAir = false;
  }
}

export const radioService = new RadioStationService();
