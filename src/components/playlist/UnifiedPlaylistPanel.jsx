import React, { useState } from 'react';
import { useUnifiedPlaylist } from '../../hooks/useUnifiedPlaylist.js';
import { PLAYLIST_TYPES } from '../../services/UnifiedPlaylistService.js';
import { STATION_REGISTRY } from '../../services/RadioStationService.js';
import { useYouTube } from '../../hooks/useYouTube.js';

export function UnifiedPlaylistPanel() {
  const {
    queue, currentIndex, isPlaying, autoAdvance, currentItem,
    addYouTube, addRadio, addFile, addSynth, addTVCue,
    removeItem, moveItem, playIndex, play, pause, next, prev, stop, clear, setAutoAdvance,
  } = useUnifiedPlaylist();

  const { extractId } = useYouTube();
  const [activeTab, setActiveTab] = useState('youtube');
  const [ytUrl, setYtUrl] = useState('');
  const [ytTitle, setYtTitle] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('pad');
  const [selectedPattern, setSelectedPattern] = useState('house');
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [duration, setDuration] = useState(300);

  const channels = ['kick', 'snare', 'hihat', 'bass', 'pad', 'lead'];
  const patterns = ['dub', 'reggae', 'house', 'techno', 'ambient'];

  const handleAddYouTube = () => {
    const id = extractId(ytUrl);
    if (id) {
      addYouTube(id, ytTitle || 'YouTube Video', Number(duration) || 0);
      setYtUrl('');
      setYtTitle('');
    }
  };

  const handleAddRadio = () => {
    if (selectedStation) {
      addRadio(selectedStation, selectedChannel, Number(duration) || 0);
    }
  };

  const handleAddSynth = () => {
    addSynth(selectedPattern, selectedChannel, Number(duration) || 300);
  };

  const handleAddTVCue = () => {
    addTVCue(Number(selectedCamera), null, Number(duration) || 10);
  };

  const getTypeMeta = (type) => PLAYLIST_TYPES.find(t => t.id === type) || PLAYLIST_TYPES[0];

  const formatDuration = (s) => {
    if (!s || s === 0) return '∞';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-orbitron text-fluid-amber tracking-widest">
          📋 UNIFIED QUEUE
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`text-[8px] px-2 py-0.5 rounded border ${autoAdvance ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-fluid-panel border-fluid-panel text-gray-500'}`}
          >
            AUTO
          </button>
          <span className="text-[9px] text-gray-500">{queue.length} items</span>
        </div>
      </div>

      {/* Add Items Tabs */}
      <div className="flex gap-0.5 mb-2 overflow-x-auto">
        {PLAYLIST_TYPES.slice(0, 5).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-2 py-1 rounded text-[8px] font-bold border transition-all whitespace-nowrap ${activeTab === t.id ? 'border-white/20 bg-white/5' : 'border-transparent bg-fluid-panel/50 text-gray-500'}`}
            style={{ color: activeTab === t.id ? t.color : undefined, borderColor: activeTab === t.id ? t.color : undefined }}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      {/* Add Form */}
      <div className="bg-fluid-panel/30 rounded p-2 mb-2 space-y-1.5">
        {activeTab === 'youtube' && (
          <>
            <input type="text" value={ytUrl} onChange={e => setYtUrl(e.target.value)} placeholder="YouTube URL..." className="w-full bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white placeholder-gray-600 outline-none focus:border-fluid-amber" />
            <input type="text" value={ytTitle} onChange={e => setYtTitle(e.target.value)} placeholder="Title (optional)..." className="w-full bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white placeholder-gray-600 outline-none focus:border-fluid-amber" />
            <div className="flex gap-1">
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (s)" className="flex-1 bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none" />
              <button onClick={handleAddYouTube} className="px-3 py-1 rounded bg-fluid-amber/20 border border-fluid-amber/40 text-[10px] text-fluid-amber font-bold">ADD</button>
            </div>
          </>
        )}

        {activeTab === 'radio' && (
          <>
            <select value={selectedStation} onChange={e => setSelectedStation(e.target.value)} className="w-full bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none">
              <option value="">Select station...</option>
              {STATION_REGISTRY.map(s => <option key={s.id} value={s.id}>{s.name} ({s.genre})</option>)}
            </select>
            <select value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)} className="w-full bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none">
              {channels.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-1">
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (s)" className="flex-1 bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none" />
              <button onClick={handleAddRadio} className="px-3 py-1 rounded bg-fluid-cyan/20 border border-fluid-cyan/40 text-[10px] text-fluid-cyan font-bold">ADD</button>
            </div>
          </>
        )}

        {activeTab === 'synth' && (
          <>
            <select value={selectedPattern} onChange={e => setSelectedPattern(e.target.value)} className="w-full bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none">
              {patterns.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)} className="w-full bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none">
              {channels.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-1">
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (s)" className="flex-1 bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none" />
              <button onClick={handleAddSynth} className="px-3 py-1 rounded bg-fluid-magenta/20 border border-fluid-magenta/40 text-[10px] text-fluid-magenta font-bold">ADD</button>
            </div>
          </>
        )}

        {activeTab === 'tv_cue' && (
          <>
            <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} className="w-full bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none">
              {[0,1,2,3].map(i => <option key={i} value={i}>Camera {i + 1}</option>)}
            </select>
            <div className="flex gap-1">
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (s)" className="flex-1 bg-fluid-void border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none" />
              <button onClick={handleAddTVCue} className="px-3 py-1 rounded bg-fluid-amber/20 border border-fluid-amber/40 text-[10px] text-fluid-amber font-bold">ADD</button>
            </div>
          </>
        )}
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {queue.length === 0 && (
          <div className="text-[10px] text-gray-600 text-center py-6">Queue is empty. Add items above.</div>
        )}
        {queue.map((item, idx) => {
          const meta = getTypeMeta(item.type);
          const isCurrent = idx === currentIndex;
          const isPast = idx < currentIndex;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-2 p-1.5 rounded border text-left transition-all ${isCurrent ? 'bg-white/5 border-white/10' : isPast ? 'opacity-40' : 'bg-fluid-panel/20 border-transparent hover:border-fluid-panel'}`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <button onClick={() => moveItem(item.id, -1)} disabled={idx === 0} className="text-[8px] text-gray-600 hover:text-white disabled:opacity-20">▲</button>
                <span className="text-[8px] text-gray-500 font-mono w-4 text-center">{idx + 1}</span>
                <button onClick={() => moveItem(item.id, 1)} disabled={idx === queue.length - 1} className="text-[8px] text-gray-600 hover:text-white disabled:opacity-20">▼</button>
              </div>

              <div className="text-xs" style={{ color: meta.color }}>{meta.icon}</div>

              <div className="flex-1 min-w-0">
                <div className={`text-[10px] font-bold truncate ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
                  {item.title || item.name || item.type}
                </div>
                <div className="text-[8px] text-gray-500">
                  {meta.name} {item.channelId && `→ ${item.channelId}`} {item.duration > 0 && `• ${formatDuration(item.duration)}`}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isCurrent && isPlaying && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                <button onClick={() => playIndex(idx)} className="w-5 h-5 rounded bg-fluid-panel flex items-center justify-center text-[8px] text-gray-400 hover:text-fluid-cyan">▶</button>
                <button onClick={() => removeItem(item.id)} className="w-5 h-5 rounded bg-fluid-panel flex items-center justify-center text-[8px] text-gray-400 hover:text-red-400">✕</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transport */}
      {queue.length > 0 && (
        <div className="mt-2 pt-2 border-t border-fluid-panel flex items-center justify-center gap-2">
          <button onClick={prev} className="w-7 h-7 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center text-[10px] hover:border-fluid-amber">⏮</button>
          <button onClick={isPlaying ? pause : play} className="w-9 h-9 rounded-full bg-fluid-amber/20 border border-fluid-amber/50 flex items-center justify-center text-sm hover:bg-fluid-amber/30">{isPlaying ? '⏸' : '▶'}</button>
          <button onClick={next} className="w-7 h-7 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center text-[10px] hover:border-fluid-amber">⏭</button>
          <button onClick={stop} className="w-7 h-7 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center text-[10px] hover:border-red-400 text-gray-400 hover:text-red-400">⏹</button>
          <button onClick={clear} className="ml-2 px-2 py-1 rounded text-[8px] text-gray-500 hover:text-red-400">CLEAR ALL</button>
        </div>
      )}
    </div>
  );
}
