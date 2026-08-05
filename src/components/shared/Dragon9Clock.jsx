import React from 'react';
import { useDragon9Clock } from '../../hooks/useDragon9Clock.js';

export function Dragon9Clock() {
  const { time, display, nextApex } = useDragon9Clock();

  return (
    <div className="bg-fluid-surface border border-fluid-panel rounded-lg p-3 min-w-[260px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-orbitron text-fluid-amber tracking-[0.2em] uppercase">Dragon 9 Time</span>
        <div className={`w-2 h-2 rounded-full ${time.isApex ? 'bg-fluid-amber animate-pulse' : 'bg-fluid-cyan'}`} />
      </div>

      <div className="text-center mb-2">
        <div 
          className="font-orbitron text-3xl font-bold tracking-wider"
          style={{ color: display.color, textShadow: `0 0 20px ${display.color}40` }}
        >
          {display.main}
        </div>
        <div className="text-xs text-gray-400 mt-1 font-rajdhani">{display.sub}</div>
        <div className="text-[10px] text-gray-500 mt-0.5 font-rajdhani">{display.detail}</div>
      </div>

      {/* Cycle Progress Bars */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500 w-8">C1</span>
          <div className="flex-1 h-1.5 bg-fluid-void rounded-full overflow-hidden">
            <div 
              className="h-full bg-fluid-cyan rounded-full transition-all duration-1000"
              style={{ width: `${time.cycle === 1 && !time.isApex ? time.cycleProgress * 100 : time.cycle === 1 && time.isApex ? 100 : 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500 w-8">APX</span>
          <div className="flex-1 h-1.5 bg-fluid-void rounded-full overflow-hidden">
            <div 
              className="h-full bg-fluid-amber rounded-full transition-all duration-1000"
              style={{ width: `${time.isApex ? time.apexProgress * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500 w-8">C2</span>
          <div className="flex-1 h-1.5 bg-fluid-void rounded-full overflow-hidden">
            <div 
              className="h-full bg-fluid-magenta rounded-full transition-all duration-1000"
              style={{ width: `${time.cycle === 2 && !time.isApex ? time.cycleProgress * 100 : time.cycle === 2 && time.isApex ? 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {!time.isApex && (
        <div className="mt-2 text-[9px] text-gray-500 text-center">
          Next Apex: {nextApex.whichApex} in {Math.floor(nextApex.minutesUntil)}m
        </div>
      )}
    </div>
  );
}
