import { audioEngine } from './AudioEngine.js';
import { radioService } from './RadioStationService.js';
import { eventBus, EVENTS } from './EventBus.js';

/**
 * AudioRouter
 * Routes each channel to either:
 * - 'synth'  → Web Audio API synthesis (Dawn Engine)
 * - 'radio'  → Live stream from station registry
 * - 'talkback' → Microphone input
 * - 'file'   → Local audio file
 * 
 * Each channel is independent — kick can be radio, snare can be synth, etc.
 */
class AudioRouter {
  constructor() {
    this.channelRoutes = new Map(); // channelId -> { type, source }
    this.channelVolumes = new Map(); // channelId -> volume
  }

  /**
   * Route a channel to a specific source type
   */
  routeChannel(channelId, type, payload = null) {
    // Stop existing source on this channel
    this.stopChannel(channelId);

    const route = { type, payload, channelId };
    this.channelRoutes.set(channelId, route);

    switch (type) {
      case 'synth':
        // Synthesis is handled by AudioEngine — just re-enable the channel
        audioEngine.muteChannel(channelId, false);
        eventBus.emit(EVENTS.AUDIO_PATTERN_CHANGE, { pattern: audioEngine.currentPattern });
        break;

      case 'radio':
        // Mute synth on this channel, start radio stream
        audioEngine.muteChannel(channelId, true);
        if (payload?.station) {
          radioService.tuneStation(
            channelId,
            payload.station,
            audioEngine.ctx,
            audioEngine.channels[channelId] || audioEngine.masterGain
          );
        }
        break;

      case 'talkback':
        audioEngine.muteChannel(channelId, true);
        radioService.startTalkback(
          channelId,
          audioEngine.ctx,
          audioEngine.channels[channelId] || audioEngine.masterGain
        );
        break;

      case 'file':
        audioEngine.muteChannel(channelId, true);
        if (payload?.url) {
          radioService.playFile(
            channelId,
            payload.url,
            audioEngine.ctx,
            audioEngine.channels[channelId] || audioEngine.masterGain
          );
        }
        break;

      default:
        break;
    }

    eventBus.emit('audio:route:change', { channelId, type, payload });
  }

  /**
   * Stop a channel's current source
   */
  stopChannel(channelId) {
    radioService.stopChannel(channelId);
    audioEngine.muteChannel(channelId, false); // Re-enable synth by default
    this.channelRoutes.delete(channelId);
  }

  /**
   * Get current route for a channel
   */
  getRoute(channelId) {
    return this.channelRoutes.get(channelId) || { type: 'synth', channelId };
  }

  /**
   * Set volume for a routed channel
   */
  setVolume(channelId, vol) {
    this.channelVolumes.set(channelId, vol);

    const route = this.channelRoutes.get(channelId);
    if (route?.type === 'synth') {
      audioEngine.setChannelGain(channelId, vol);
    } else {
      radioService.setChannelVolume(channelId, vol);
    }
  }

  /**
   * Get all active routes
   */
  getAllRoutes() {
    return Array.from(this.channelRoutes.entries()).map(([id, route]) => ({
      channelId: id,
      ...route,
    }));
  }

  /**
   * Stop everything
   */
  stopAll() {
    this.channelRoutes.forEach((_, id) => this.stopChannel(id));
    radioService.stopAll();
  }

  /**
   * Auto-spot stations by genre and assign to available channels
   */
  autoSpotByGenre(genre) {
    const stations = radioService.getStationsByGenre(genre);
    const channels = ['kick', 'snare', 'hihat', 'bass', 'pad', 'lead'];

    stations.forEach((station, idx) => {
      if (idx < channels.length) {
        this.routeChannel(channels[idx], 'radio', { station });
      }
    });
  }

  /**
   * Quick switch all channels to a genre (radio) or pattern (synth)
   */
  quickSwitch(mode) {
    const channels = ['kick', 'snare', 'hihat', 'bass', 'pad', 'lead'];

    if (['dub', 'reggae', 'house', 'techno', 'ambient'].includes(mode)) {
      // Switch all to synth with this pattern
      audioEngine.setPattern(mode);
      channels.forEach(ch => this.routeChannel(ch, 'synth'));
    } else {
      // Try to find radio stations of this genre
      const stations = radioService.getStationsByGenre(mode);
      if (stations.length > 0) {
        this.autoSpotByGenre(mode);
      }
    }
  }
}

export const audioRouter = new AudioRouter();
