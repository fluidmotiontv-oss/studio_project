import React from 'react';
import { useSync } from '../../hooks/useSync.js';

export function SyncPanel() {
  const { syncLog, autoSync, setAutoSync } = useSync();
  const [showLog, setShowLog] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowLog(!showLog)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-orbitron tracking-wider transition-all
          ${autoSync 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-fluid-surface border-fluid-panel text-gray-400'}
        `}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${autoSync ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
        SYNC {autoSync ? 'ON' : 'OFF'}
        {syncLog.length > 0 && (
          <span className="ml-1 text-[9px] bg-white/10 px-1 rounded">{syncLog.length}</span>
        )}
      </button>

      {showLog && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-fluid-surface border border-fluid-panel rounded-lg shadow-2xl z-50 max-h-64 overflow-hidden">
          <div className="flex items-center justify-between p-2 border-b border-fluid-panel">
            <span className="text-[10px] font-orbitron text-gray-400">SYNC LOG</span>
            <button 
              onClick={() => setAutoSync(!autoSync)}
              className="text-[9px] px-2 py-0.5 rounded bg-fluid-cyan/20 text-fluid-cyan"
            >
              {autoSync ? 'Disable Auto' : 'Enable Auto'}
            </button>
          </div>
          <div className="overflow-y-auto max-h-52 p-2 space-y-1">
            {syncLog.length === 0 && (
              <div className="text-[10px] text-gray-600 text-center py-4">No sync events yet</div>
            )}
            {syncLog.map(entry => (
              <div key={entry.id} className="flex items-start gap-2 text-[10px] p-1.5 rounded bg-fluid-void/50">
                <span className="text-gray-500 font-mono">{entry.time}</span>
                <span className="text-fluid-cyan font-bold">{entry.from}</span>
                <span className="text-gray-600">→</span>
                <span className="text-fluid-magenta font-bold">{entry.to}</span>
                <span className="text-gray-400 flex-1">{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
