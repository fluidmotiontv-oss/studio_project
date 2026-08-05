import React from 'react';

const views = [
  { id: 'tv', label: 'TV DECK', icon: '📺' },
  { id: 'split', label: 'SPLIT', icon: '◫' },
  { id: 'audio', label: 'AUDIO', icon: '🎛️' },
];

export function ViewToggle({ activeView, onChange }) {
  return (
    <div className="flex bg-fluid-surface rounded-lg p-1 border border-fluid-panel">
      {views.map(view => (
        <button
          key={view.id}
          onClick={() => onChange(view.id)}
          className={`
            px-4 py-1.5 rounded-md text-xs font-orbitron tracking-wider transition-all duration-200
            ${activeView === view.id 
              ? 'bg-fluid-cyan/20 text-fluid-cyan border border-fluid-cyan/40 shadow-[0_0_10px_rgba(0,245,255,0.2)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'}
          `}
        >
          <span className="mr-1.5">{view.icon}</span>
          {view.label}
        </button>
      ))}
    </div>
  );
}
