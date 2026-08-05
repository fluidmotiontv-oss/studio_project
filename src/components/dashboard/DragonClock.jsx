import React from 'react'
import { useDragonTime } from '../../hooks/useDragonTime'

export default function DragonClock() {
  const { d9Hour, d9Minute, d9Second, d9DayProgress, minutesToApex, isInApex, solarTime, drift, cycleLabel } = useDragonTime()
  const pad = (n) => String(n).padStart(2, '0')
  const hourArc = ((d9DayProgress * 360) % 360)

  return (
    <div className="bg-dragon-800 border border-dragon-700 rounded-xl p-5 relative overflow-hidden">
      {isInApex && <div className="absolute inset-0 bg-fluid-cyan/5 animate-pulse-slow pointer-events-none" />}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-rajdhani font-semibold text-fluid-cyan tracking-wider uppercase">D9 Temporal Engine</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${isInApex ? 'bg-fluid-cyan/20 border-fluid-cyan text-fluid-cyan' : 'bg-dragon-700 border-dragon-600 text-dragon-200'}`}>
          {isInApex ? 'APEX ACTIVE' : 'OPERATIONAL'}
        </span>
      </div>
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a2e" strokeWidth="4" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#00f5ff" strokeWidth="4" strokeDasharray={`${hourArc * 0.785} 283`} className="transition-all duration-1000 ease-linear" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-orbitron font-bold text-white tracking-wider">{pad(d9Hour)}<span className="text-fluid-cyan">:</span>{pad(d9Minute)}</span>
            <span className="text-xs text-dragon-200 font-rajdhani mt-1">{pad(d9Second)}s</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-dragon-900/50 rounded-lg p-2 border border-dragon-700/50">
          <div className="text-dragon-200 mb-0.5">Cycle</div>
          <div className="text-fluid-cyan font-semibold">{cycleLabel}</div>
        </div>
        <div className="bg-dragon-900/50 rounded-lg p-2 border border-dragon-700/50">
          <div className="text-dragon-200 mb-0.5">Drift</div>
          <div className="text-fluid-cyan font-semibold">{drift}%</div>
        </div>
        <div className="bg-dragon-900/50 rounded-lg p-2 border border-dragon-700/50">
          <div className="text-dragon-200 mb-0.5">Solar Time</div>
          <div className="text-white font-semibold">{solarTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div className={`rounded-lg p-2 border ${isInApex ? 'bg-fluid-cyan/10 border-fluid-cyan/50' : 'bg-dragon-900/50 border-dragon-700/50'}`}>
          <div className="text-dragon-200 mb-0.5">{isInApex ? 'Apex Remaining' : 'Next Apex'}</div>
          <div className={`font-semibold ${isInApex ? 'text-fluid-cyan' : 'text-dragon-400'}`}>{isInApex ? `${9 + minutesToApex} min` : `${minutesToApex} min`}</div>
        </div>
      </div>
    </div>
  )
}
