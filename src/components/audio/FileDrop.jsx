import React, { useState, useRef } from 'react';
import { useAudioRouter } from '../../hooks/useAudioRouter.js';

export function FileDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [targetChannel, setTargetChannel] = useState('pad');
  const { routeChannel } = useAudioRouter();
  const inputRef = useRef(null);

  const channels = [
    { id: 'kick', name: 'Kick' },
    { id: 'snare', name: 'Snare' },
    { id: 'hihat', name: 'Hi-Hat' },
    { id: 'bass', name: 'Bass' },
    { id: 'pad', name: 'Pad' },
    { id: 'lead', name: 'Lead' },
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
    setFiles(prev => [...prev, ...dropped]);

    dropped.forEach((file, i) => {
      const url = URL.createObjectURL(file);
      const ch = channels[(files.length + i) % channels.length];
      routeChannel(ch.id, 'file', { url, name: file.name });
    });
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.type.startsWith('audio/'));
    setFiles(prev => [...prev, ...selected]);

    selected.forEach(file => {
      const url = URL.createObjectURL(file);
      routeChannel(targetChannel, 'file', { url, name: file.name });
    });
  };

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3">
      <div className="text-[10px] font-orbitron text-fluid-cyan tracking-widest mb-2">
        📁 AUDIO FILE DROP
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] text-gray-500">TO:</span>
        <select
          value={targetChannel}
          onChange={(e) => setTargetChannel(e.target.value)}
          className="flex-1 bg-fluid-panel border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none"
        >
          {channels.map(ch => (
            <option key={ch.id} value={ch.id}>{ch.name}</option>
          ))}
        </select>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-fluid-cyan bg-fluid-cyan/10' 
            : 'border-fluid-panel bg-fluid-panel/20 hover:border-fluid-cyan/50'}
        `}
      >
        <div className="text-2xl mb-1">🎵</div>
        <div className="text-[10px] text-gray-400">
          Drop audio files or click to browse
        </div>
        <div className="text-[8px] text-gray-600 mt-1">
          MP3, WAV, OGG supported
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-[8px] text-gray-500">LOADED FILES</div>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[9px] text-gray-400">
              <span className="text-fluid-cyan">♪</span>
              <span className="truncate">{f.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
