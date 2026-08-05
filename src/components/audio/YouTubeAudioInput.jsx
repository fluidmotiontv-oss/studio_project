import React, { useState } from 'react';
import { useYouTube } from '../../hooks/useYouTube.js';
import { useAudioRouter } from '../../hooks/useAudioRouter.js';

export function YouTubeAudioInput() {
  const [urlInput, setUrlInput] = useState('');
  const [targetChannel, setTargetChannel] = useState('pad');
  const [isExtracting, setIsExtracting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const { extractId, getAudioStream } = useYouTube();
  const { routeChannel } = useAudioRouter();

  const channels = [
    { id: 'kick', name: 'Kick' },
    { id: 'snare', name: 'Snare' },
    { id: 'hihat', name: 'Hi-Hat' },
    { id: 'bass', name: 'Bass' },
    { id: 'pad', name: 'Pad' },
    { id: 'lead', name: 'Lead' },
  ];

  const handleRoute = async () => {
    const videoId = extractId(urlInput);
    if (!videoId) return;

    setIsExtracting(true);
    try {
      const stream = await getAudioStream(videoId);
      if (stream?.url) {
        routeChannel(targetChannel, 'file', { 
          url: stream.url, 
          name: stream.title || 'YouTube Audio',
          source: 'youtube',
          thumbnail: stream.thumbnail,
        });
        setLastResult({ success: true, title: stream.title, author: stream.author });
      } else {
        setLastResult({ success: false, error: 'No audio stream found' });
      }
    } catch (e) {
      setLastResult({ success: false, error: e.message });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3">
      <div className="text-[10px] font-orbitron text-fluid-magenta tracking-widest mb-2">
        🔗 YOUTUBE → MIXER
      </div>
      <div className="text-[8px] text-gray-500 mb-2">
        Routes YouTube audio into Dawn Engine channels via Invidious proxy
      </div>

      <div className="flex gap-1 mb-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste YouTube URL..."
          className="flex-1 bg-fluid-panel border border-fluid-panel rounded px-2 py-1 text-[10px] text-white placeholder-gray-600 outline-none focus:border-fluid-magenta"
          onKeyDown={(e) => e.key === 'Enter' && handleRoute()}
        />
        <select
          value={targetChannel}
          onChange={(e) => setTargetChannel(e.target.value)}
          className="bg-fluid-panel border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none"
        >
          {channels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
        </select>
      </div>

      <button
        onClick={handleRoute}
        disabled={!urlInput || isExtracting}
        className={`
          w-full py-2 rounded text-[10px] font-bold tracking-wider transition-all
          ${urlInput && !isExtracting
            ? 'bg-fluid-magenta/20 border border-fluid-magenta/50 text-fluid-magenta hover:bg-fluid-magenta/30'
            : 'bg-fluid-panel border border-fluid-panel text-gray-600 cursor-not-allowed'}
        `}
      >
        {isExtracting ? '⏳ EXTRACTING...' : '🔗 ROUTE TO CHANNEL'}
      </button>

      {lastResult && (
        <div className={`mt-2 text-[9px] p-1.5 rounded ${lastResult.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {lastResult.success 
            ? `✓ Routed "${lastResult.title}" by ${lastResult.author}`
            : `✗ ${lastResult.error}`}
        </div>
      )}
    </div>
  );
}
