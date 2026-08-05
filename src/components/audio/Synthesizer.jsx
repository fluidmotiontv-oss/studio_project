import React, { useState, useEffect } from 'react';
import { stateManager } from '../../services/StateManager.js';
import { useAudioEngine } from '../../hooks/useAudioEngine.js';
import { useAudioRouter } from '../../hooks/useAudioRouter.js';
import { ChannelSourceSelector } from './ChannelSourceSelector.jsx';

export function Synthesizer() {
  const [state, setState] = useState(stateManager.getState());
  const { setChannelGain, muteChannel } = useAudioEngine();
  const { routes } = useAudioRouter();

  useEffect(() => {
    return stateManager.subscribe(setState);
  }, []);

  const { audio } = state;

  const getRouteInfo = (channelId) => {
    const route = routes.find(r => r.channelId === channelId);
    if (!route) return { type: 'synth', label: 'SYNTH' };
    if (route.type === 'file' && route.payload?.source === 'youtube') {
      return { type: 'youtube', label: 'YT', name: route.payload?.name };
    }
    return { type: route.type, label: route.type.toUpperCase(), name: route.payload?.name || route.payload?.station?.name };
  };

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3 flex flex-col h-full">
      <div className="text-[10px] font-orbitron text-fluid-magenta tracking-widest mb-3">
        CHANNEL MIXER & ROUTER
      </div>

      <div className="flex-1 flex gap-2 overflow-x-auto">
        {audio.channels.map(ch => {
          const routeInfo = getRouteInfo(ch.id);
          const isExternal = routeInfo.type !== 'synth';

          return (
            <div key={ch.id} className="flex-1 min-w-[70px] flex flex-col items-center gap-2">
              <ChannelSourceSelector 
                channelId={ch.id} 
                channelName={ch.name} 
                channelColor={ch.color} 
              />

              <button
                onClick={() => {
                  muteChannel(ch.id, !ch.muted);
                  const updated = stateManager.getState().audio.channels.map(c => 
                    c.id === ch.id ? { ...c, muted: !c.muted } : c
                  );
                  stateManager.setState('audio.channels', updated);
                }}
                className={`
                  w-8 h-6 rounded text-[8px] font-bold transition-all
                  ${ch.muted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-fluid-panel text-gray-400 border border-fluid-panel'}
                `}
              >
                M
              </button>

              <div className="flex-1 w-8 bg-fluid-panel rounded-full relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-100"
                  style={{ 
                    height: `${ch.gain * 100}%`,
                    backgroundColor: ch.muted ? '#333' : ch.color,
                    opacity: ch.muted || isExternal ? 0.3 : 0.8,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={ch.gain}
                  onChange={(e) => {
                    const gain = Number(e.target.value);
                    setChannelGain(ch.id, gain);
                    const updated = stateManager.getState().audio.channels.map(c => 
                      c.id === ch.id ? { ...c, gain } : c
                    );
                    stateManager.setState('audio.channels', updated);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ transform: 'rotate(180deg)' }}
                />
              </div>

              <div className="text-center">
                <div className="text-[9px] font-bold" style={{ color: ch.muted ? '#666' : ch.color }}>
                  {ch.name}
                </div>
                <div className="text-[8px] text-gray-600">
                  {isExternal ? routeInfo.label : `${Math.round(ch.gain * 100)}%`}
                </div>
                {routeInfo.name && (
                  <div className="text-[7px] text-gray-500 truncate max-w-[60px]" title={routeInfo.name}>
                    {routeInfo.name}
                  </div>
                )}
              </div>

              <div className="w-full h-1 bg-fluid-void rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${ch.muted || isExternal ? 0 : Math.random() * ch.gain * 100}%`,
                    backgroundColor: ch.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
