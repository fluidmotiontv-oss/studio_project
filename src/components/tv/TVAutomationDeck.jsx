import React from 'react';
import { PlaybackControls } from './PlaybackControls.jsx';
import { PlaylistManager } from './PlaylistManager.jsx';
import { CueTimeline } from './CueTimeline.jsx';
import { StreamHealth } from './StreamHealth.jsx';
import { YouTubePlayer } from './YouTubePlayer.jsx';

export function TVAutomationDeck() {
  return (
    <div className="h-full flex flex-col gap-3 p-3 overflow-y-auto">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <PlaybackControls />
        </div>
        <StreamHealth />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-2 gap-3">
        <PlaylistManager />
        <CueTimeline />
      </div>

      <div className="grid grid-cols-2 gap-3" style={{ minHeight: '280px' }}>
        <YouTubePlayer />
        <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">📡</div>
            <div className="text-[10px] text-gray-500">External Feed Slot</div>
            <div className="text-[8px] text-gray-600 mt-1">RTMP / SRT / NDI</div>
          </div>
        </div>
      </div>
    </div>
  );
}
