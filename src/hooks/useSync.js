import { useEffect, useState } from 'react';
import { eventBus, EVENTS } from '../services/EventBus.js';
import { stateManager } from '../services/StateManager.js';

export function useSync() {
  const [syncLog, setSyncLog] = useState([]);
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    // TV Cue → Audio Trigger
    const unsubCue = eventBus.on(EVENTS.TV_CUE_TRIGGER, ({ cueId }) => {
      if (autoSync) {
        addLog('TV', 'AUDIO', `Cue ${cueId} triggered audio sync`);
        // Auto-start audio on cue if not playing
        const { audio } = stateManager.getState();
        if (!audio.isPlaying) {
          eventBus.emit(EVENTS.AUDIO_PLAY, {});
        }
      }
    });

    // Audio Beat → TV Overlay pulse
    const unsubBeat = eventBus.on(EVENTS.AUDIO_BEAT, ({ step }) => {
      if (autoSync && step === 0) {
        addLog('AUDIO', 'TV', 'Beat 0 → overlay pulse');
        eventBus.emit(EVENTS.SYNC_BEAT, { step });
      }
    });

    // Apex → Ambient mode
    const unsubApex = eventBus.on(EVENTS.D9_APEX_ENTER, () => {
      if (autoSync) {
        addLog('D9', 'AUDIO', 'Apex → ambient pattern');
        eventBus.emit(EVENTS.AUDIO_PATTERN_CHANGE, { pattern: 'ambient' });
      }
    });

    const unsubApexExit = eventBus.on(EVENTS.D9_APEX_EXIT, () => {
      if (autoSync) {
        addLog('D9', 'AUDIO', 'Apex exit → house pattern');
        eventBus.emit(EVENTS.AUDIO_PATTERN_CHANGE, { pattern: 'house' });
      }
    });

    return () => {
      unsubCue();
      unsubBeat();
      unsubApex();
      unsubApexExit();
    };
  }, [autoSync]);

  const addLog = (from, to, message) => {
    setSyncLog(prev => {
      const entry = { id: Date.now(), from, to, message, time: new Date().toLocaleTimeString() };
      return [entry, ...prev].slice(0, 50);
    });
  };

  const triggerSync = (from, to, data) => {
    eventBus.emit(EVENTS.SYNC_TRIGGER, { from, to, data });
    addLog(from, to, `Manual sync: ${JSON.stringify(data)}`);
  };

  return { syncLog, autoSync, setAutoSync, triggerSync };
}
