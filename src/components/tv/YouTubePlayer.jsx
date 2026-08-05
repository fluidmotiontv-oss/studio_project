import React, { useEffect, useRef, useState } from 'react';
import { useYouTube } from '../../hooks/useYouTube.js';

export function YouTubePlayer() {
  const playerRef = useRef(null);
  const [urlInput, setUrlInput] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const {
    playerReady,
    currentVideo,
    searchResults,
    isSearching,
    error,
    initPlayer,
    loadVideo,
    play,
    pause,
    setVolume,
    search,
    extractId,
  } = useYouTube();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [volume, setVolumeState] = useState(0.8);

  useEffect(() => {
    if (playerRef.current) {
      initPlayer('youtube-iframe', null);
    }
  }, [initPlayer]);

  const handleLoadUrl = () => {
    const id = extractId(urlInput);
    if (id) {
      loadVideo(id);
      setVideoInfo({ videoId: id, title: 'Loading...' });
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) search(searchQuery);
  };

  const handlePlayResult = (result) => {
    loadVideo(result.videoId);
    setVideoInfo(result);
    setShowSearch(false);
  };

  const handleVolumeChange = (v) => {
    setVolumeState(v);
    setVolume(v);
  };

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-orbitron text-fluid-cyan tracking-widest">
          📺 YOUTUBE PLAYER
        </span>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${playerReady ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span className="text-[9px] text-gray-500">{playerReady ? 'READY' : 'INIT'}</span>
        </div>
      </div>

      <div className="relative aspect-video bg-black rounded border border-fluid-panel overflow-hidden mb-2">
        <div ref={playerRef} id="youtube-iframe" className="w-full h-full" />
        {!currentVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📺</div>
              <div className="text-[10px] text-gray-500">Paste a YouTube URL or search</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button onClick={play} disabled={!playerReady} className="w-8 h-8 rounded-full bg-fluid-cyan/20 border border-fluid-cyan/40 flex items-center justify-center text-xs disabled:opacity-30">▶</button>
        <button onClick={pause} disabled={!playerReady} className="w-8 h-8 rounded-full bg-fluid-panel border border-fluid-panel flex items-center justify-center text-xs disabled:opacity-30">⏸</button>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => handleVolumeChange(Number(e.target.value))} className="flex-1 h-1 bg-fluid-panel rounded-full accent-fluid-cyan" />
        <span className="text-[9px] text-gray-500 w-8 text-right">{Math.round(volume * 100)}%</span>
      </div>

      <div className="flex gap-1 mb-2">
        <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="Paste YouTube URL..." className="flex-1 bg-fluid-panel border border-fluid-panel rounded px-2 py-1 text-[10px] text-white placeholder-gray-600 outline-none focus:border-fluid-cyan" onKeyDown={(e) => e.key === 'Enter' && handleLoadUrl()} />
        <button onClick={handleLoadUrl} className="px-3 py-1 rounded bg-fluid-cyan/20 border border-fluid-cyan/40 text-[10px] text-fluid-cyan font-bold">LOAD</button>
      </div>

      <button onClick={() => setShowSearch(!showSearch)} className="text-[10px] text-gray-400 hover:text-white mb-2 text-left">{showSearch ? '▼' : '▶'} Search YouTube</button>

      {showSearch && (
        <div className="space-y-2 mb-2">
          <div className="flex gap-1">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="flex-1 bg-fluid-panel border border-fluid-panel rounded px-2 py-1 text-[10px] text-white placeholder-gray-600 outline-none focus:border-fluid-cyan" onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            <button onClick={handleSearch} disabled={isSearching} className="px-3 py-1 rounded bg-fluid-panel border border-fluid-panel text-[10px] text-gray-400 hover:text-white">{isSearching ? '...' : '🔍'}</button>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {searchResults.map((r) => (
              <button key={r.videoId} onClick={() => handlePlayResult(r)} className="w-full flex items-center gap-2 p-1.5 rounded bg-fluid-panel/50 border border-transparent hover:border-fluid-cyan/30 text-left">
                <div className="w-12 h-8 bg-black rounded flex-shrink-0 overflow-hidden">{r.thumbnail && <img src={r.thumbnail} alt="" className="w-full h-full object-cover" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-white truncate">{r.title}</div>
                  <div className="text-[8px] text-gray-500">{r.author} • {Math.floor(r.lengthSeconds / 60)}:{String(r.lengthSeconds % 60).padStart(2,'0')}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {videoInfo && <div className="text-[9px] text-gray-400 border-t border-fluid-panel pt-1"><div className="text-white font-bold truncate">{videoInfo.title}</div>{videoInfo.author && <div className="text-gray-500">{videoInfo.author}</div>}</div>}
      {error && <div className="text-[9px] text-red-400 mt-1">{error}</div>}
    </div>
  );
}
