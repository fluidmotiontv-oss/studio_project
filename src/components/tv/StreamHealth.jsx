import React, { useState, useEffect } from 'react';
import { stateManager } from '../../services/StateManager.js';

export function StreamHealth() {
  const [state, setState] = useState(stateManager.getState());
  const [history, setHistory] = useState(Array(30).fill(98));

  useEffect(() => {
    return stateManager.subscribe(setState);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const newVal = 92 + Math.random() * 8;
        stateManager.setState('tv.streamHealth', Math.floor(newVal));
        return [...prev.slice(1), newVal];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const health = state.tv.streamHealth;
  const healthColor = health > 95 ? 'text-green-400' : health > 85 ? 'text-fluid-amber' : 'text-red-400';
  const healthBg = health > 95 ? 'bg-green-400' : health > 85 ? 'bg-fluid-amber' : 'bg-red-400';

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3">
      <div className="text-[10px] font-orbitron text-fluid-cyan tracking-widest mb-2">STREAM HEALTH</div>

      <div className="flex items-end gap-2 mb-2">
        <span className={`text-3xl font-orbitron font-bold ${healthColor}`}>{health}%</span>
        <span className="text-[10px] text-gray-500 mb-1">RTMP Primary</span>
      </div>

      {/* Sparkline */}
      <div className="flex items-end gap-0.5 h-12">
        {history.map((val, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t ${healthBg} opacity-60`}
            style={{ height: `${val}%` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="text-center p-1.5 rounded bg-fluid-panel/50">
          <div className="text-[9px] text-gray-500">BITRATE</div>
          <div className="text-[11px] font-bold text-fluid-cyan">6.2 Mbps</div>
        </div>
        <div className="text-center p-1.5 rounded bg-fluid-panel/50">
          <div className="text-[9px] text-gray-500">LATENCY</div>
          <div className="text-[11px] font-bold text-fluid-cyan">120ms</div>
        </div>
      </div>
    </div>
  );
}
