import React, { useState } from 'react';
import { UnifiedHeader } from '../shared/UnifiedHeader.jsx';
import { StatusBar } from '../shared/StatusBar.jsx';
import { ViewToggle } from './ViewToggle.jsx';
import { SyncPanel } from '../shared/SyncPanel.jsx';
import { UnifiedPlaylistPanel } from '../playlist/UnifiedPlaylistPanel.jsx';
import { ModuleLauncher } from '../modules/ModuleLauncher.jsx';

export function DashboardLayout({ activeView, setActiveView, tvPanel, audioPanel }) {
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showModules, setShowModules] = useState(false);

  return (
    <div className="min-h-screen bg-fluid-void text-white font-rajdhani overflow-hidden flex flex-col">
      <UnifiedHeader />

      <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3">
          <ViewToggle activeView={activeView} onChange={setActiveView} />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-orbitron tracking-wider transition-all ${showPlaylist ? 'bg-fluid-amber/10 border-fluid-amber/30 text-fluid-amber' : 'bg-fluid-surface border-fluid-panel text-gray-400'}`}
            >
              📋 QUEUE
            </button>
            <button
              onClick={() => setShowModules(!showModules)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-orbitron tracking-wider transition-all ${showModules ? 'bg-fluid-magenta/10 border-fluid-magenta/30 text-fluid-magenta' : 'bg-fluid-surface border-fluid-panel text-gray-400'}`}
            >
              🧩 MODULES
            </button>
            <SyncPanel />
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex gap-3 min-h-0">
          {/* Left: TV or Audio */}
          <div className="flex-[2] flex flex-col gap-2 min-w-0">
            {activeView === 'split' && (
              <div className="flex-1 flex gap-3 min-h-0">
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="text-xs font-orbitron text-fluid-cyan tracking-widest uppercase opacity-70">TV Automation Deck</div>
                  <div className="flex-1 bg-fluid-surface rounded-lg border border-fluid-panel overflow-hidden">{tvPanel}</div>
                </div>
                <div className="w-px bg-fluid-panel" />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="text-xs font-orbitron text-fluid-magenta tracking-widest uppercase opacity-70">Dawn Engine</div>
                  <div className="flex-1 bg-fluid-surface rounded-lg border border-fluid-panel overflow-hidden">{audioPanel}</div>
                </div>
              </div>
            )}
            {activeView === 'tv' && (
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs font-orbitron text-fluid-cyan tracking-widest uppercase opacity-70">TV Automation Deck — Full View</div>
                <div className="flex-1 bg-fluid-surface rounded-lg border border-fluid-panel overflow-hidden">{tvPanel}</div>
              </div>
            )}
            {activeView === 'audio' && (
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs font-orbitron text-fluid-magenta tracking-widest uppercase opacity-70">Dawn Engine — Full View</div>
                <div className="flex-1 bg-fluid-surface rounded-lg border border-fluid-panel overflow-hidden">{audioPanel}</div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Playlist + Modules */}
          <div className="w-80 flex flex-col gap-3 flex-shrink-0">
            {showPlaylist && (
              <div className="flex-1 min-h-0 bg-fluid-surface rounded-lg border border-fluid-panel overflow-hidden">
                <UnifiedPlaylistPanel />
              </div>
            )}
            {showModules && (
              <div className="flex-1 min-h-0 bg-fluid-surface rounded-lg border border-fluid-panel overflow-hidden">
                <ModuleLauncher />
              </div>
            )}
          </div>
        </div>
      </div>

      <StatusBar />
    </div>
  );
}
