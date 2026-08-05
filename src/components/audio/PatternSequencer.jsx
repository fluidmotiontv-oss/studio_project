import React from 'react';
import { useAudioEngine } from '../../hooks/useAudioEngine.js';

const patterns = [
  { id: 'dub', name: 'DUB', color: '#6bcb77' },
  { id: 'reggae', name: 'REGGAE', color: '#ffd93d' },
  { id: 'house', name: 'HOUSE', color: '#00f5ff' },
  { id: 'techno', name: 'TECHNO', color: '#ff00ff' },
  { id: 'ambient', name: 'AMBIENT', color: '#e94560' },
];

export function PatternSequencer() {
  const { pattern, changePattern } = useAudioEngine();

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3">
      <div className="text-[10px] font-orbitron text-fluid-magenta tracking-widest mb-3">PATTERNS</div>

      <div className="space-y-1.5">
        {patterns.map(pat => (
          <button
            key={pat.id}
            onClick={() => changePattern(pat.id)}
            className={`
              w-full flex items-center gap-2 p-2 rounded border text-left transition-all
              ${pattern === pat.id 
                ? 'bg-white/5 border-white/20' 
                : 'bg-fluid-panel/30 border-transparent hover:border-fluid-panel'}
            `}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: pat.color, boxShadow: pattern === pat.id ? `0 0 8px ${pat.color}` : 'none' }}
            />
            <span className={`text-[10px] font-bold tracking-wider ${pattern === pat.id ? 'text-white' : 'text-gray-400'}`}>
              {pat.name}
            </span>
            {pattern === pat.id && (
              <span className="ml-auto text-[8px] text-gray-500">ACTIVE</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
