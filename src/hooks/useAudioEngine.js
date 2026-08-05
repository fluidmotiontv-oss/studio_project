import { useState, useEffect, useCallback, useRef } from 'react';
import { audioEngine } from '../services/AudioEngine.js';
import { eventBus, EVENTS } from '../services/EventBus.js';

export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(128);
  const [pattern, setPattern] = useState('house');
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [visualizerData, setVisualizerData] = useState(new Uint8Array(128));
  const [waveformData, setWaveformData] = useState(new Uint8Array(128));
  const rafRef = useRef(null);

  useEffect(() => {
    const unsubPlay = eventBus.on(EVENTS.AUDIO_PLAY, () => setIsPlaying(true));
    const unsubPause = eventBus.on(EVENTS.AUDIO_PAUSE, () => setIsPlaying(false));
    const unsubBpm = eventBus.on(EVENTS.AUDIO_BPM_CHANGE, ({ bpm }) => setBpm(bpm));
    const unsubPat = eventBus.on(EVENTS.AUDIO_PATTERN_CHANGE, ({ pattern }) => setPattern(pattern));

    return () => {
      unsubPlay();
      unsubPause();
      unsubBpm();
      unsubPat();
    };
  }, []);

  // Visualizer loop
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      setVisualizerData(audioEngine.getVisualizerData());
      setWaveformData(audioEngine.getWaveformData());
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const play = useCallback(() => audioEngine.play(), []);
  const pause = useCallback(() => audioEngine.pause(), []);
  const toggle = useCallback(() => {
    if (audioEngine.isPlaying) audioEngine.pause();
    else audioEngine.play();
  }, []);

  const changeBPM = useCallback((val) => audioEngine.setBPM(val), []);
  const changePattern = useCallback((pat) => audioEngine.setPattern(pat), []);
  const changeVolume = useCallback((vol) => {
    setMasterVolume(vol);
    audioEngine.setMasterVolume(vol);
  }, []);

  const setChannelGain = useCallback((ch, gain) => audioEngine.setChannelGain(ch, gain), []);
  const muteChannel = useCallback((ch, muted) => audioEngine.muteChannel(ch, muted), []);

  return {
    isPlaying,
    bpm,
    pattern,
    masterVolume,
    visualizerData,
    waveformData,
    play,
    pause,
    toggle,
    changeBPM,
    changePattern,
    changeVolume,
    setChannelGain,
    muteChannel,
  };
}
