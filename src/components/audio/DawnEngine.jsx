import React from 'react';
import { Synthesizer } from './Synthesizer.jsx';
import { AudioVisualizer } from './AudioVisualizer.jsx';
import { TransportControls } from './TransportControls.jsx';
import { PatternSequencer } from './PatternSequencer.jsx';
import { RadioTuner } from './RadioTuner.jsx';
import { FileDrop } from './FileDrop.jsx';
import { YouTubeAudioInput } from './YouTubeAudioInput.jsx';

export function DawnEngine() {
  return (
    <div className="h-full flex flex-col gap-3 p-3 overflow-y-auto">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <TransportControls />
        </div>
        <PatternSequencer />
      </div>

      <div className="grid grid-cols-4 gap-3" style={{ minHeight: '220px' }}>
        <RadioTuner />
        <FileDrop />
        <YouTubeAudioInput />
        <AudioVisualizer />
      </div>

      <div className="flex-1 min-h-0">
        <Synthesizer />
      </div>
    </div>
  );
}
