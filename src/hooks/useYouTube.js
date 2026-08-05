import { useState, useEffect, useCallback } from 'react';
import { youtubeService } from '../services/YouTubeService.js';

export function useYouTube() {
  const [playerReady, setPlayerReady] = useState(false);
  const [playerState, setPlayerState] = useState(-1);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = youtubeService.subscribe((data) => {
      if (data.type === 'ready') setPlayerReady(true);
      if (data.type === 'stateChange') setPlayerState(data.state);
      if (data.type === 'error') setError(`Player error: ${data.error}`);
    });
    return () => unsub();
  }, []);

  const initPlayer = useCallback((elementId, videoId) => {
    youtubeService.initPlayer(elementId, videoId, () => setPlayerReady(true));
  }, []);

  const loadVideo = useCallback((videoId) => {
    youtubeService.loadVideo(videoId);
    setCurrentVideo(videoId);
    setError(null);
  }, []);

  const play = useCallback(() => youtubeService.play(), []);
  const pause = useCallback(() => youtubeService.pause(), []);
  const seek = useCallback((seconds) => youtubeService.seek(seconds), []);
  const setVolume = useCallback((vol) => youtubeService.setVolume(vol), []);

  const search = useCallback(async (query) => {
    setIsSearching(true);
    setError(null);
    try {
      const results = await youtubeService.search(query);
      setSearchResults(results);
    } catch (e) {
      setError('Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const extractId = useCallback((url) => youtubeService.extractVideoId(url), []);

  const getAudioStream = useCallback(async (videoId) => {
    try {
      return await youtubeService.getAudioStreamUrl(videoId);
    } catch (e) {
      setError('Audio extraction failed');
      return null;
    }
  }, []);

  return {
    playerReady,
    playerState,
    currentVideo,
    searchResults,
    isSearching,
    error,
    initPlayer,
    loadVideo,
    play,
    pause,
    seek,
    setVolume,
    search,
    extractId,
    getAudioStream,
  };
}
