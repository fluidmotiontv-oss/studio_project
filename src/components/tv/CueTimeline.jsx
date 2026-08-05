import React, { useState, useEffect, useRef } from 'react';
import { stateManager } from '../../services/StateManager.js';
import { eventBus, EVENTS } from '../../services/EventBus.js';

export function CueTimeline() {
  const [state, setState] = useState(stateManager.getState());
  const [overlays, setOverlays] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    return stateManager.subscribe(setState);
  }, []);

  useEffect(() => {
    const unsub = eventBus.on(EVENTS.TV_OVERLAY_SHOW, (overlay) => {
      setOverlays(prev => [...prev, { ...overlay, id: Date.now(), active: true }]);
      setTimeout(() => {
        setOverlays(prev => prev.filter(o => o.id !== overlay.id));
      }, 5000);
    });
    return () => unsub();
  }, []);

  // Draw timeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#1e1e2e';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const x = (i / 20) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Cue blocks
    const { tv } = state;
    let xOffset = 0;
    tv.playlist.forEach((item, idx) => {
      const width = (item.duration / 600) * w; // scale to 10 min window
      const isActive = idx === tv.currentCue;

      ctx.fillStyle = isActive ? 'rgba(0, 245, 255, 0.2)' : 'rgba(30, 30, 46, 0.8)';
      ctx.fillRect(xOffset, 20, width - 2, h - 40);

      ctx.strokeStyle = isActive ? '#00f5ff' : '#333';
      ctx.strokeRect(xOffset, 20, width - 2, h - 40);

      // Label
      ctx.fillStyle = isActive ? '#00f5ff' : '#888';
      ctx.font = '10px Rajdhani';
      ctx.fillText(item.name.substring(0, 12), xOffset + 4, 16);

      // Duration
      ctx.fillStyle = '#666';
      ctx.font = '9px Rajdhani';
      ctx.fillText(`${item.duration}s`, xOffset + 4, h - 8);

      xOffset += width;
    });

    // Playhead
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, 0);
    ctx.lineTo(w * 0.3, h);
    ctx.stroke();

    // Playhead triangle
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.moveTo(w * 0.3 - 6, 0);
    ctx.lineTo(w * 0.3 + 6, 0);
    ctx.lineTo(w * 0.3, 8);
    ctx.fill();

  }, [state]);

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-orbitron text-fluid-cyan tracking-widest">CUE TIMELINE</span>
        <div className="flex gap-1">
          <button 
            onClick={() => stateManager.triggerCue(Math.max(0, state.tv.currentCue - 1))}
            className="px-2 py-0.5 rounded bg-fluid-panel text-[9px] text-gray-400 hover:text-white"
          >
            PREV
          </button>
          <button 
            onClick={() => stateManager.triggerCue(Math.min(state.tv.playlist.length - 1, state.tv.currentCue + 1))}
            className="px-2 py-0.5 rounded bg-fluid-panel text-[9px] text-gray-400 hover:text-white"
          >
            NEXT
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="flex-1 w-full rounded bg-fluid-void border border-fluid-panel" />

      {/* Active Overlays */}
      {overlays.length > 0 && (
        <div className="mt-2 space-y-1">
          {overlays.map(ov => (
            <div key={ov.id} className="flex items-center gap-2 p-1.5 rounded bg-fluid-amber/10 border border-fluid-amber/30">
              <span className="text-xs">🎨</span>
              <span className="text-[10px] text-fluid-amber">{ov.text || 'Overlay Active'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
