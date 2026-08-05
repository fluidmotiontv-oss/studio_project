import React, { useState, useEffect } from 'react';
import { stateManager } from '../../services/StateManager.js';

export function PlaylistManager() {
  const [state, setState] = useState(stateManager.getState());

  useEffect(() => {
    return stateManager.subscribe(setState);
  }, []);

  const { tv } = state;

  const typeIcons = {
    video: '🎬',
    live: '🔴',
    graphic: '🎨',
  };

  const typeColors = {
    video: 'text-fluid-cyan',
    live: 'text-red-400',
    graphic: 'text-fluid-amber',
  };

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-orbitron text-fluid-cyan tracking-widest">PLAYLIST</span>
        <span className="text-[9px] text-gray-500">{tv.playlist.length} items</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {tv.playlist.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => stateManager.setState('tv.currentCue', idx)}
            className={`
              flex items-center gap-2 p-2 rounded border cursor-pointer transition-all
              ${tv.currentCue === idx 
                ? 'bg-fluid-cyan/5 border-fluid-cyan/40' 
                : 'bg-fluid-panel/30 border-transparent hover:border-fluid-panel'}
            `}
          >
            <div className={`text-xs ${typeColors[item.type]}`}>{typeIcons[item.type]}</div>
            <div className="flex-1 min-w-0">
              <div className={`text-[11px] font-bold truncate ${tv.currentCue === idx ? 'text-white' : 'text-gray-300'}`}>
                {item.name}
              </div>
              <div className="text-[9px] text-gray-500">
                {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
              </div>
            </div>
            <div className={`
              text-[9px] px-1.5 py-0.5 rounded font-bold
              ${item.status === 'playing' ? 'bg-green-500/20 text-green-400' : 
                item.status === 'queued' ? 'bg-fluid-amber/20 text-fluid-amber' : 
                'bg-gray-500/20 text-gray-400'}
            `}>
              {item.status.toUpperCase()}
            </div>
            {tv.currentCue === idx && (
              <div className="w-1 h-6 rounded-full bg-fluid-cyan" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-fluid-panel flex gap-2">
        <button className="flex-1 py-1.5 rounded bg-fluid-panel text-[10px] text-gray-400 hover:text-white transition-colors">
          + ADD
        </button>
        <button className="flex-1 py-1.5 rounded bg-fluid-panel text-[10px] text-gray-400 hover:text-red-400 transition-colors">
          CLEAR
        </button>
      </div>
    </div>
  );
}
