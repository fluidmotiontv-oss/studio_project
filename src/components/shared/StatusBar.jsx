import React from 'react';
import { stateManager } from '../../services/StateManager.js';
import { useAudioRouter } from '../../hooks/useAudioRouter.js';

export function StatusBar() {
  const [state, setState] = React.useState(stateManager.getState());
  const { activeStreams, onAir, routes } = useAudioRouter();

  React.useEffect(() => {
    return stateManager.subscribe(setState);
  }, []);

  const { tv, audio } = state;

  const youtubeRoutes = routes.filter(r => r.payload?.source === 'youtube');
  const hasYouTube = youtubeRoutes.length > 0;

  return (
    <footer className="bg-fluid-surface border-t border-fluid-panel px-4 py-1.5 flex items-center justify-between text-[10px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">CAM:</span>
          <span className="text-fluid-cyan font-bold">{tv.cameras[tv.currentCamera]?.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">CUE:</span>
          <span className="text-fluid-amber">{tv.currentCue + 1}/{tv.playlist.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">STREAM:</span>
          <span className={tv.streamHealth > 90 ? 'text-green-400' : tv.streamHealth > 70 ? 'text-fluid-amber' : 'text-red-400'}>
            {tv.streamHealth}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onAir && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 font-bold">ON AIR</span>
          </div>
        )}
        {hasYouTube && (
          <div className="flex items-center gap-1">
            <span className="text-red-500">▶️</span>
            <span className="text-red-400">YT: {youtubeRoutes.length}</span>
          </div>
        )}
        {activeStreams.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">📻</span>
            <span className="text-fluid-cyan">{activeStreams.length} STREAMS</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">BPM:</span>
          <span className="text-fluid-magenta font-bold">{audio.bpm}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">PATTERN:</span>
          <span className="text-fluid-magenta uppercase">{audio.pattern}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">AUDIO:</span>
          <span className={audio.isPlaying ? 'text-green-400 animate-pulse' : 'text-gray-500'}>
            {audio.isPlaying ? 'PLAYING' : 'STOPPED'}
          </span>
        </div>
      </div>
    </footer>
  );
}
