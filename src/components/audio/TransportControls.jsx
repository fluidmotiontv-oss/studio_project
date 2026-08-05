import React from 'react';
import { useAudioEngine } from '../../hooks/useAudioEngine.js';
import { useAudioRouter } from '../../hooks/useAudioRouter.js';

export function TransportControls() {
  const { isPlaying, bpm, masterVolume, toggle, changeBPM, changeVolume } = useAudioEngine();
  const { activeStreams, onAir } = useAudioRouter();

  const hasRadio = activeStreams.length > 0;
  const streamCount = activeStreams.length;

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-orbitron text-fluid-magenta tracking-widest">TRANSPORT</span>
        <div className="flex items-center gap-2">
          {onAir && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[8px] text-red-400 font-bold">ON AIR</span>
            </div>
          )}
          {hasRadio && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-fluid-cyan/10 border border-fluid-cyan/30">
              <span className="text-[8px] text-fluid-cyan">📻 {streamCount}</span>
            </div>
          )}
          <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-[9px] text-gray-500">{isPlaying ? 'ACTIVE' : 'IDLE'}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button className="w-10 h-10 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center hover:border-fluid-magenta transition-colors">
          <span className="text-sm">⏹</span>
        </button>
        <button 
          onClick={toggle}
          className={`
            w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all
            ${isPlaying 
              ? 'bg-fluid-magenta/20 border-fluid-magenta shadow-[0_0_20px_rgba(255,0,255,0.3)]' 
              : 'bg-fluid-panel border-fluid-magenta/50 hover:bg-fluid-magenta/10'}
          `}
        >
          <span className="text-xl">{isPlaying ? '⏸' : '▶'}</span>
        </button>
        <button className="w-10 h-10 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center hover:border-fluid-magenta transition-colors">
          <span className="text-sm">🔁</span>
        </button>
      </div>

      {/* BPM & Volume */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-gray-500">TEMPO</span>
            <span className="text-[11px] font-orbitron text-fluid-magenta">{bpm} BPM</span>
          </div>
          <input
            type="range"
            min="60"
            max="200"
            value={bpm}
            onChange={(e) => changeBPM(Number(e.target.value))}
            className="w-full h-1.5 bg-fluid-panel rounded-full appearance-none cursor-pointer accent-fluid-magenta"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-gray-500">MASTER GAIN</span>
            <span className="text-[11px] font-orbitron text-fluid-cyan">{Math.round(masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-fluid-panel rounded-full appearance-none cursor-pointer accent-fluid-cyan"
          />
        </div>
      </div>

      {/* Radio Stream Mini-Display */}
      {hasRadio && (
        <div className="mt-3 pt-2 border-t border-fluid-panel">
          <div className="text-[8px] text-gray-500 mb-1 tracking-wider">ACTIVE FEEDS</div>
          <div className="flex flex-wrap gap-1">
            {activeStreams.map((stream, i) => (
              <span 
                key={i} 
                className="text-[8px] px-1.5 py-0.5 rounded bg-fluid-panel border border-fluid-panel text-gray-400"
              >
                <span className="text-fluid-cyan font-bold">{stream.channelId.toUpperCase()}</span>
                <span className="text-gray-600 mx-0.5">→</span>
                {stream.name || stream.station?.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
