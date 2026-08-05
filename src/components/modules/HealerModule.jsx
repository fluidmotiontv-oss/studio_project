import React, { useRef, useEffect, useState } from 'react';
import { ModuleWindow } from './ModuleWindow.jsx';

const HEALING_PRESETS = [
  { name: 'Delta Sleep', base: 200, beat: 2.5, color: '#3b82f6', desc: 'Deep sleep & healing' },
  { name: 'Theta Meditation', base: 200, beat: 6, color: '#8b5cf6', desc: 'Creativity & intuition' },
  { name: 'Alpha Relax', base: 200, beat: 10, color: '#10b981', desc: 'Relaxation & learning' },
  { name: 'Beta Focus', base: 200, beat: 20, color: '#f59e0b', desc: 'Alertness & focus' },
  { name: 'Gamma Peak', base: 200, beat: 40, color: '#ef4444', desc: 'Peak concentration' },
  { name: '432 Hz', base: 432, beat: 0, color: '#ec4899', desc: 'Natural tuning' },
  { name: '528 Hz', base: 528, beat: 0, color: '#f97316', desc: 'DNA repair miracle' },
];

export function HealerModule({ instance }) {
  const [active, setActive] = useState(false);
  const [preset, setPreset] = useState(HEALING_PRESETS[1]);
  const [volume, setVolume] = useState(0.3);
  const ctxRef = useRef(null);
  const oscLeftRef = useRef(null);
  const oscRightRef = useRef(null);
  const gainRef = useRef(null);

  const start = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = ctxRef.current;

    if (ctx.state === 'suspended') ctx.resume();

    // Stop existing
    if (oscLeftRef.current) { try { oscLeftRef.current.stop(); } catch(e){} }
    if (oscRightRef.current) { try { oscRightRef.current.stop(); } catch(e){} }

    // Create binaural beat
    const leftFreq = preset.beat > 0 ? preset.base : preset.base;
    const rightFreq = preset.beat > 0 ? preset.base + preset.beat : preset.base;

    oscLeftRef.current = ctx.createOscillator();
    oscLeftRef.current.type = 'sine';
    oscLeftRef.current.frequency.value = leftFreq;

    oscRightRef.current = ctx.createOscillator();
    oscRightRef.current.type = 'sine';
    oscRightRef.current.frequency.value = rightFreq;

    // Stereo panning
    const merger = ctx.createChannelMerger(2);
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();

    leftGain.gain.value = volume;
    rightGain.gain.value = volume;

    oscLeftRef.current.connect(leftGain);
    oscRightRef.current.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(ctx.destination);

    oscLeftRef.current.start();
    oscRightRef.current.start();

    gainRef.current = { left: leftGain, right: rightGain };
    setActive(true);
  };

  const stop = () => {
    if (oscLeftRef.current) { try { oscLeftRef.current.stop(); } catch(e){} }
    if (oscRightRef.current) { try { oscRightRef.current.stop(); } catch(e){} }
    oscLeftRef.current = null;
    oscRightRef.current = null;
    setActive(false);
  };

  useEffect(() => {
    if (active && gainRef.current) {
      gainRef.current.left.gain.setTargetAtTime(volume, ctxRef.current.currentTime, 0.1);
      gainRef.current.right.gain.setTargetAtTime(volume, ctxRef.current.currentTime, 0.1);
    }
  }, [volume, active]);

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <ModuleWindow instance={instance}>
      <div className="h-full flex flex-col p-4 gap-3 overflow-y-auto">
        <div className="text-center">
          <div className="text-3xl mb-2">💫</div>
          <div className="text-[12px] font-orbitron font-bold" style={{ color: preset.color }}>
            {preset.name}
          </div>
          <div className="text-[10px] text-gray-500">{preset.desc}</div>
          <div className="text-[10px] text-gray-600 mt-1">
            {preset.beat > 0 ? `${preset.base}Hz / ${preset.base + preset.beat}Hz (${preset.beat}Hz beat)` : `${preset.base}Hz`}
          </div>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-1 gap-1">
          {HEALING_PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => { setPreset(p); if (active) { stop(); setTimeout(start, 50); } }}
              className={`flex items-center gap-2 p-2 rounded border text-left transition-all ${preset.name === p.name ? 'border-white/20 bg-white/5' : 'border-transparent bg-fluid-panel/30 hover:border-fluid-panel'}`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-300">{p.name}</div>
                <div className="text-[8px] text-gray-500">{p.desc}</div>
              </div>
              {preset.name === p.name && active && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
            </button>
          ))}
        </div>

        {/* Volume */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-gray-500">VOLUME</span>
            <span className="text-[10px] font-bold" style={{ color: preset.color }}>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-fluid-panel rounded-full accent-fluid-cyan"
          />
        </div>

        {/* Play/Stop */}
        <button
          onClick={active ? stop : start}
          className={`w-full py-3 rounded-lg text-[12px] font-bold tracking-wider transition-all ${active ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-fluid-cyan/20 border border-fluid-cyan/40 text-fluid-cyan hover:bg-fluid-cyan/30'}`}
        >
          {active ? '⏹ STOP HEALING' : '▶ START HEALING'}
        </button>

        {active && (
          <div className="text-center">
            <div className="text-[10px] text-gray-500 animate-pulse">🔊 Playing binaural frequencies...</div>
          </div>
        )}
      </div>
    </ModuleWindow>
  );
}
