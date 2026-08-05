import React, { useState } from 'react';
import { RADIO_GENRES, STATION_REGISTRY } from '../../services/RadioStationService.js';
import { useAudioRouter } from '../../hooks/useAudioRouter.js';
import { useAudioEngine } from '../../hooks/useAudioEngine.js';

export function RadioTuner() {
  const [selectedGenre, setSelectedGenre] = useState('reggae');
  const [selectedStation, setSelectedStation] = useState(null);
  const [targetChannel, setTargetChannel] = useState('pad');
  const { routeChannel, autoSpot, quickSwitch, activeStreams } = useAudioRouter();
  const { isPlaying } = useAudioEngine();

  const channels = [
    { id: 'kick', name: 'Kick' },
    { id: 'snare', name: 'Snare' },
    { id: 'hihat', name: 'Hi-Hat' },
    { id: 'bass', name: 'Bass' },
    { id: 'pad', name: 'Pad' },
    { id: 'lead', name: 'Lead' },
  ];

  const filteredStations = STATION_REGISTRY.filter(s => s.genre === selectedGenre);

  const handleTune = () => {
    if (selectedStation) {
      routeChannel(targetChannel, 'radio', { station: selectedStation });
    }
  };

  const handleAutoSpot = () => {
    autoSpot(selectedGenre);
  };

  const handleQuickSwitch = (mode) => {
    quickSwitch(mode);
  };

  return (
    <div className="bg-fluid-void rounded-lg border border-fluid-panel p-3 flex flex-col h-full">
      <div className="text-[10px] font-orbitron text-fluid-magenta tracking-widest mb-3">
        📻 RADIO TUNER
      </div>

      {/* Genre Tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {RADIO_GENRES.map(g => (
          <button
            key={g.id}
            onClick={() => { setSelectedGenre(g.id); setSelectedStation(null); }}
            className={`
              px-2 py-1 rounded text-[9px] font-bold tracking-wider border transition-all
              ${selectedGenre === g.id 
                ? 'border-white/20 bg-white/10 text-white' 
                : 'border-transparent bg-fluid-panel/50 text-gray-500 hover:text-gray-300'}
            `}
            style={{ 
              borderColor: selectedGenre === g.id ? g.color : undefined,
              color: selectedGenre === g.id ? g.color : undefined 
            }}
          >
            <span className="mr-1">{g.icon}</span>
            {g.name}
          </button>
        ))}
      </div>

      {/* Station List */}
      <div className="flex-1 overflow-y-auto space-y-1 mb-3 min-h-0">
        {filteredStations.length === 0 && (
          <div className="text-[10px] text-gray-600 text-center py-4">No stations in this genre</div>
        )}
        {filteredStations.map(station => (
          <button
            key={station.id}
            onClick={() => setSelectedStation(station)}
            className={`
              w-full flex items-center justify-between p-2 rounded border text-left transition-all
              ${selectedStation?.id === station.id 
                ? 'bg-fluid-magenta/10 border-fluid-magenta/40' 
                : 'bg-fluid-panel/30 border-transparent hover:border-fluid-panel'}
            `}
          >
            <div>
              <div className={`text-[10px] font-bold ${selectedStation?.id === station.id ? 'text-white' : 'text-gray-300'}`}>
                {station.name}
              </div>
              <div className="text-[8px] text-gray-500">
                {station.region} • {station.bitrate}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${selectedStation?.id === station.id ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-[8px] text-gray-600">{station.bitrate}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Channel Selector + Tune Button */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500 whitespace-nowrap">TO CHANNEL:</span>
          <select
            value={targetChannel}
            onChange={(e) => setTargetChannel(e.target.value)}
            className="flex-1 bg-fluid-panel border border-fluid-panel rounded px-2 py-1 text-[10px] text-white outline-none focus:border-fluid-magenta"
          >
            {channels.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleTune}
            disabled={!selectedStation}
            className={`
              flex-1 py-2 rounded text-[10px] font-bold tracking-wider transition-all
              ${selectedStation 
                ? 'bg-fluid-magenta/20 border border-fluid-magenta/50 text-fluid-magenta hover:bg-fluid-magenta/30' 
                : 'bg-fluid-panel border border-fluid-panel text-gray-600 cursor-not-allowed'}
            `}
          >
            🔒 TUNE IN
          </button>
          <button
            onClick={handleAutoSpot}
            className="flex-1 py-2 rounded text-[10px] font-bold tracking-wider bg-fluid-cyan/10 border border-fluid-cyan/30 text-fluid-cyan hover:bg-fluid-cyan/20 transition-all"
          >
            🎯 AUTO-SPOT
          </button>
        </div>
      </div>

      {/* Quick Switch */}
      <div className="border-t border-fluid-panel pt-2">
        <div className="text-[8px] text-gray-500 mb-1.5 tracking-wider">QUICK SWITCH ALL CHANNELS</div>
        <div className="grid grid-cols-5 gap-1">
          {['dub', 'reggae', 'house', 'techno', 'ambient'].map(mode => (
            <button
              key={mode}
              onClick={() => handleQuickSwitch(mode)}
              className="py-1.5 rounded bg-fluid-panel border border-fluid-panel text-[8px] text-gray-400 hover:text-white hover:border-fluid-cyan transition-all uppercase"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Active Streams Indicator */}
      {activeStreams.length > 0 && (
        <div className="mt-2 border-t border-fluid-panel pt-2">
          <div className="text-[8px] text-gray-500 mb-1">ACTIVE STREAMS</div>
          <div className="space-y-1">
            {activeStreams.map((stream, i) => (
              <div key={i} className="flex items-center gap-2 text-[9px]">
                <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                <span className="text-fluid-cyan font-bold">{stream.channelId.toUpperCase()}</span>
                <span className="text-gray-500">→</span>
                <span className="text-gray-300">{stream.name || stream.station?.name || stream.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
