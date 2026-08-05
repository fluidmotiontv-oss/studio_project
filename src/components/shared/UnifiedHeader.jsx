import React, { useState } from 'react';
import { Dragon9Clock } from './Dragon9Clock.jsx';
import { StationGrid } from './StationGrid.jsx';

export function UnifiedHeader() {
  const [showStations, setShowStations] = useState(false);

  return (
    <header className="bg-fluid-surface border-b border-fluid-panel px-4 py-2 flex items-center justify-between relative">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-fluid-cyan to-fluid-magenta flex items-center justify-center">
          <span className="text-lg">🐉</span>
        </div>
        <div>
          <h1 className="font-orbitron text-sm font-bold tracking-wider text-white">
            FLUID MOTION <span className="text-fluid-cyan">UNIFIED</span> STUDIO
          </h1>
          <p className="text-[9px] text-gray-500 tracking-[0.3em] uppercase">
            Dragon 9 v6 • TV + Audio + Radio + Time
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Dragon9Clock />

        <button
          onClick={() => setShowStations(!showStations)}
          className="px-3 py-1.5 rounded-lg border border-fluid-panel bg-fluid-void text-[10px] font-orbitron text-fluid-amber tracking-wider hover:border-fluid-amber/50 transition-all"
        >
          🌍 {showStations ? 'HIDE' : '36 STATIONS'}
        </button>
      </div>

      {showStations && (
        <div className="absolute right-4 top-full mt-2 w-96 z-50 shadow-2xl">
          <StationGrid />
        </div>
      )}

      <div className="flex items-center gap-4 text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-fluid-cyan" />
          <span>V 1.1.0</span>
        </div>
      </div>
    </header>
  );
}
