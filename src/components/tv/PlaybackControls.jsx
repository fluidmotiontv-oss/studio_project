import React, { useState, useEffect } from 'react';
import { stateManager } from '../../services/StateManager.js';
import { eventBus, EVENTS } from '../../services/EventBus.js';

export function PlaybackControls() {
  const [state, setState] = useState(stateManager.getState());
  const [isLive, setIsLive] = useState(false);
  const [programTime, setProgramTime] = useState(0);

  useEffect(() => {
    return stateManager.subscribe(setState);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setProgramTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const { tv } = state;
  const activeCam = tv.cameras[tv.currentCamera];

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-orbitron text-fluid-cyan tracking-widest">PLAYBACK CONTROL</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`
              px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-all
              ${isLive ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-fluid-panel text-gray-400 border border-fluid-panel'}
            `}
          >
            {isLive ? '● LIVE' : '○ STANDBY'}
          </button>
        </div>
      </div>

      {/* Preview / Program */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="relative aspect-video bg-black rounded border border-fluid-panel overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl opacity-20">📹</div>
          </div>
          <div className="absolute top-2 left-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-gray-400">PREVIEW</div>
          <div className="absolute bottom-2 right-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-fluid-cyan">
            {tv.cameras[(tv.currentCamera + 1) % tv.cameras.length]?.name}
          </div>
        </div>
        <div className="relative aspect-video bg-black rounded border border-fluid-cyan/30 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl opacity-30">📺</div>
          </div>
          {isLive && (
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] text-red-400 font-bold">PROGRAM</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-fluid-cyan font-bold">
            {activeCam?.name}
          </div>
          <div className="absolute bottom-2 left-2 text-[9px] text-gray-500">
            {formatTime(programTime)}
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {tv.cameras.map((cam, idx) => (
          <button
            key={cam.id}
            onClick={() => stateManager.switchCamera(idx)}
            className={`
              relative p-2 rounded border text-left transition-all
              ${tv.currentCamera === idx 
                ? 'bg-fluid-cyan/10 border-fluid-cyan/50' 
                : 'bg-fluid-panel/50 border-fluid-panel hover:border-gray-600'}
            `}
          >
            <div className="text-[9px] text-gray-500 mb-0.5">CAM-{String(idx + 1).padStart(2, '0')}</div>
            <div className={`text-[10px] font-bold truncate ${tv.currentCamera === idx ? 'text-fluid-cyan' : 'text-gray-300'}`}>
              {cam.name}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-1 h-1 rounded-full ${cam.health > 90 ? 'bg-green-400' : 'bg-fluid-amber'}`} />
              <span className="text-[8px] text-gray-500">{cam.health}%</span>
            </div>
            {tv.currentCamera === idx && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-fluid-cyan animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Transport */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button className="w-8 h-8 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center hover:border-fluid-cyan transition-colors">
          <span className="text-xs">⏮</span>
        </button>
        <button 
          onClick={() => eventBus.emit(EVENTS.TV_PLAY, {})}
          className="w-10 h-10 rounded-full bg-fluid-cyan/20 border border-fluid-cyan flex items-center justify-center hover:bg-fluid-cyan/30 transition-colors"
        >
          <span className="text-sm">▶</span>
        </button>
        <button 
          onClick={() => eventBus.emit(EVENTS.TV_PAUSE, {})}
          className="w-10 h-10 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center hover:border-fluid-cyan transition-colors"
        >
          <span className="text-sm">⏸</span>
        </button>
        <button className="w-8 h-8 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center hover:border-fluid-cyan transition-colors">
          <span className="text-xs">⏭</span>
        </button>
        <button 
          onClick={() => stateManager.triggerCue(tv.currentCue + 1)}
          className="px-3 py-1.5 rounded bg-fluid-amber/20 border border-fluid-amber/40 text-fluid-amber text-[10px] font-bold tracking-wider hover:bg-fluid-amber/30 transition-colors"
        >
          TAKE
        </button>
      </div>
    </div>
  );
}
