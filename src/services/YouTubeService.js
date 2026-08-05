/**
 * YouTube Service
 * Two modes:
 * 1. IFrame API — Embedded player for TV Deck (visual + controlled playback)
 * 2. Invidious/Piped — Direct audio stream URLs for Dawn Engine channels
 */

// Public Invidious instances for audio extraction
const INVIDIOUS_INSTANCES = [
  'https://vid.puffyan.us',
  'https://iv.nboeck.de',
  'https://yt.artemislena.eu',
  'https://iv.datura.network',
  'https://iv.nboeck.de',
];

class YouTubeService {
  constructor() {
    this.player = null;
    this.playerReady = false;
    this.currentVideoId = null;
    this.listeners = new Set();
    this.invidiousIndex = 0;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach(cb => cb(data));
  }

  /**
   * Extract video ID from various YouTube URL formats
   */
  extractVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  }

  /**
   * Initialize IFrame API player
   */
  initPlayer(elementId, videoId, onReady) {
    if (!window.YT) {
      // Load YouTube IFrame API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
    }

    window.onYouTubeIframeAPIReady = () => {
      this.player = new window.YT.Player(elementId, {
        height: '100%',
        width: '100%',
        videoId: videoId || '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            this.playerReady = true;
            if (onReady) onReady(event);
            this.notify({ type: 'ready', player: this.player });
          },
          onStateChange: (event) => {
            this.notify({ type: 'stateChange', state: event.data });
          },
          onError: (event) => {
            this.notify({ type: 'error', error: event.data });
          },
        },
      });
    };

    // If API already loaded
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }

  loadVideo(videoId) {
    this.currentVideoId = videoId;
    if (this.playerReady && this.player) {
      this.player.loadVideoById(videoId);
    }
  }

  play() {
    if (this.playerReady && this.player) this.player.playVideo();
  }

  pause() {
    if (this.playerReady && this.player) this.player.pauseVideo();
  }

  seek(seconds) {
    if (this.playerReady && this.player) this.player.seekTo(seconds, true);
  }

  setVolume(vol) {
    // vol 0-1 → 0-100
    if (this.playerReady && this.player) this.player.setVolume(Math.round(vol * 100));
  }

  getDuration() {
    if (this.playerReady && this.player) return this.player.getDuration();
    return 0;
  }

  getCurrentTime() {
    if (this.playerReady && this.player) return this.player.getCurrentTime();
    return 0;
  }

  destroy() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
      this.playerReady = false;
    }
  }

  /**
   * Get direct audio stream URL via Invidious API
   * This can be fed into Web Audio API / Audio element
   */
  async getAudioStreamUrl(videoId) {
    for (let i = 0; i < INVIDIOUS_INSTANCES.length; i++) {
      const instance = INVIDIOUS_INSTANCES[(this.invidiousIndex + i) % INVIDIOUS_INSTANCES.length];
      try {
        const response = await fetch(`${instance}/api/v1/videos/${videoId}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) continue;

        const data = await response.json();
        // Find audio-only format
        const audioFormat = data.adaptiveFormats?.find(f => 
          f.type?.startsWith('audio/') && f.audioQuality
        );

        if (audioFormat?.url) {
          this.invidiousIndex = (this.invidiousIndex + i) % INVIDIOUS_INSTANCES.length;
          return {
            url: audioFormat.url,
            title: data.title,
            author: data.author,
            lengthSeconds: data.lengthSeconds,
            thumbnail: data.videoThumbnails?.[0]?.url,
          };
        }
      } catch (e) {
        continue;
      }
    }
    throw new Error('No Invidious instance available for this video');
  }

  /**
   * Search Invidious for videos
   */
  async search(query) {
    for (let i = 0; i < INVIDIOUS_INSTANCES.length; i++) {
      const instance = INVIDIOUS_INSTANCES[(this.invidiousIndex + i) % INVIDIOUS_INSTANCES.length];
      try {
        const response = await fetch(
          `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`,
          { headers: { 'Accept': 'application/json' } }
        );
        if (!response.ok) continue;
        const data = await response.json();
        if (data.length > 0) {
          this.invidiousIndex = (this.invidiousIndex + i) % INVIDIOUS_INSTANCES.length;
          return data.slice(0, 10).map(v => ({
            videoId: v.videoId,
            title: v.title,
            author: v.author,
            lengthSeconds: v.lengthSeconds,
            viewCount: v.viewCount,
            publishedText: v.publishedText,
            thumbnail: v.videoThumbnails?.[0]?.url,
          }));
        }
      } catch (e) {
        continue;
      }
    }
    return [];
  }
}

export const youtubeService = new YouTubeService();
