import React from 'react';
import { useAudioRouter } from '../../hooks/useAudioRouter.js';

const SOURCE_TYPES = [
  { id: 'synth', name: 'SYNTH', icon: '🔧', color: '#00f5ff' },
  { id: 'radio', name: 'RADIO', icon: '📻', color: '#ff00ff' },
  { id: 'youtube', name: 'YT', icon: '▶️', color: '#ff0000' },
  { id: 'talkback', name: 'MIC', icon: '🎙️', color: '#ffb700' },
  { id: 'file', name: 'FILE', icon: '📁', color: '#6bcb77' },
];

export function ChannelSourceSelector({ channelId, channelName, channelColor }) {
  const { routes, routeChannel, stopChannel } = useAudioRouter();

  const currentRoute = routes.find(r => r.channelId === channelId);
  const activeType = currentRoute?.type || 'synth';
  // Detect YouTube audio routed as 'file' with source: 'youtube'
  const isYouTubeFile = currentRoute?.payload?.source === 'youtube';
  const displayType = isYouTubeFile ? 'youtube' : activeType;

  return (
    <div className="flex items-center gap-0.5">
      {SOURCE_TYPES.map(src => {
        const isActive = displayType === src.id;
        const handleClick = () => {
          if (src.id === 'synth') routeChannel(channelId, 'synth');
          else if (src.id === 'talkback') routeChannel(channelId, 'talkback');
          else if (src.id === activeType) stopChannel(channelId);
          // radio, youtube, file are set via their respective panels
        };

        return (
          <button
            key={src.id}
            onClick={handleClick}
            title={`${src.name} — ${channelName}`}
            className={`
              w-5 h-5 rounded flex items-center justify-center text-[8px] border transition-all
              ${isActive 
                ? 'border-white/30' 
                : 'border-transparent bg-fluid-panel/50 text-gray-500 hover:text-gray-300'}
            `}
            style={{
              backgroundColor: isActive ? src.color + '20' : undefined,
              borderColor: isActive ? src.color : undefined,
              color: isActive ? src.color : undefined,
            }}
          >
            {src.icon}
          </button>
        );
      })}
    </div>
  );
}
