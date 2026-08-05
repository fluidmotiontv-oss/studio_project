import { useState, useEffect, useCallback } from 'react';
import { audioRouter } from '../services/AudioRouter.js';
import { radioService } from '../services/RadioStationService.js';
import { eventBus } from '../services/EventBus.js';

export function useAudioRouter() {
  const [routes, setRoutes] = useState([]);
  const [activeStreams, setActiveStreams] = useState([]);
  const [onAir, setOnAir] = useState(false);

  useEffect(() => {
    const unsub = eventBus.on('audio:route:change', () => {
      setRoutes(audioRouter.getAllRoutes());
      setActiveStreams(radioService.getActiveStreams());
    });

    const unsubRadio = radioService.subscribe((data) => {
      setActiveStreams(radioService.getActiveStreams());
      setOnAir(radioService.onAir);
    });

    return () => {
      unsub();
      unsubRadio();
    };
  }, []);

  const routeChannel = useCallback((channelId, type, payload) => {
    audioRouter.routeChannel(channelId, type, payload);
  }, []);

  const stopChannel = useCallback((channelId) => {
    audioRouter.stopChannel(channelId);
  }, []);

  const autoSpot = useCallback((genre) => {
    audioRouter.autoSpotByGenre(genre);
  }, []);

  const quickSwitch = useCallback((mode) => {
    audioRouter.quickSwitch(mode);
  }, []);

  const setChannelVolume = useCallback((channelId, vol) => {
    audioRouter.setVolume(channelId, vol);
  }, []);

  return {
    routes,
    activeStreams,
    onAir,
    routeChannel,
    stopChannel,
    autoSpot,
    quickSwitch,
    setChannelVolume,
  };
}
