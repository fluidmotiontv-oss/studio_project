import { useState, useEffect, useCallback } from 'react';
import { unifiedPlaylist } from '../services/UnifiedPlaylistService.js';

export function useUnifiedPlaylist() {
  const [state, setState] = useState(unifiedPlaylist.getState());

  useEffect(() => {
    return unifiedPlaylist.subscribe(setState);
  }, []);

  const addItem = useCallback((item) => unifiedPlaylist.addItem(item), []);
  const removeItem = useCallback((id) => unifiedPlaylist.removeItem(id), []);
  const moveItem = useCallback((id, dir) => unifiedPlaylist.moveItem(id, dir), []);
  const playIndex = useCallback((idx) => unifiedPlaylist.playIndex(idx), []);
  const play = useCallback(() => unifiedPlaylist.play(), []);
  const pause = useCallback(() => unifiedPlaylist.pause(), []);
  const next = useCallback(() => unifiedPlaylist.next(), []);
  const prev = useCallback(() => unifiedPlaylist.prev(), []);
  const stop = useCallback(() => unifiedPlaylist.stop(), []);
  const clear = useCallback(() => unifiedPlaylist.clear(), []);
  const setAutoAdvance = useCallback((val) => unifiedPlaylist.setAutoAdvance(val), []);

  // Quick add helpers
  const addYouTube = useCallback((videoId, title, duration) => unifiedPlaylist.addYouTube(videoId, title, duration), []);
  const addRadio = useCallback((stationId, channelId, duration) => unifiedPlaylist.addRadio(stationId, channelId, duration), []);
  const addFile = useCallback((url, name, channelId, duration) => unifiedPlaylist.addFile(url, name, channelId, duration), []);
  const addSynth = useCallback((pattern, channelId, duration) => unifiedPlaylist.addSynth(pattern, channelId, duration), []);
  const addTVCue = useCallback((cameraIndex, overlay, duration) => unifiedPlaylist.addTVCue(cameraIndex, overlay, duration), []);

  return {
    ...state,
    addItem,
    removeItem,
    moveItem,
    playIndex,
    play,
    pause,
    next,
    prev,
    stop,
    clear,
    setAutoAdvance,
    addYouTube,
    addRadio,
    addFile,
    addSynth,
    addTVCue,
  };
}
