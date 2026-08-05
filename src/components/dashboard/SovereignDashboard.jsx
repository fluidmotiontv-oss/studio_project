import React from 'react'
import DragonClock from './DragonClock'
import TelemetryPanel from './TelemetryPanel'
import ModuleLauncher from './ModuleLauncher'
import BroadcastStage from './BroadcastStage'
import ActivityFeed from './ActivityFeed'

export default function SovereignDashboard() {
  return (
    <div className="min-h-screen bg-dragon-900 text-white p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐉</span>
          <div>
            <h1 className="text-lg font-orbitron font-bold tracking-wide">DRAGON NINE</h1>
            <p className="text-[10px] text-dragon-200 font-rajdhani tracking-wider">FLUID MOTION TV • PORT WAIKATO • AS65001</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2 py-1 rounded-full bg-dragon-800 border border-dragon-600 text-dragon-200">TEST MODE</span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-dragon-800 border border-dragon-600 text-dragon-200">ECONOMY OFFLINE</span>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <DragonClock />
          <TelemetryPanel />
          <ModuleLauncher />
        </div>
        <div className="lg:col-span-6 space-y-4">
          <BroadcastStage />
          <div className="grid grid-cols-4 gap-2">
            {[
              {label:'Auto Clip',icon:'⚡',color:'bg-fluid-amber/20 border-fluid-amber/40 text-fluid-amber'},
              {label:'Beat Gen',icon:'🌊',color:'bg-fluid-cyan/20 border-fluid-cyan/40 text-fluid-cyan'},
              {label:'Vectorize',icon:'✏️',color:'bg-green-500/20 border-green-500/40 text-green-400'},
              {label:'Puppet',icon:'🎭',color:'bg-fluid-magenta/20 border-fluid-magenta/40 text-fluid-magenta'},
            ].map(a => (
              <button key={a.label} className={`rounded-lg border p-3 text-center hover:opacity-80 transition-opacity ${a.color}`}>
                <div className="text-lg mb-1">{a.icon}</div>
                <div className="text-[10px] font-semibold">{a.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <ActivityFeed />
          <div className="bg-dragon-800 border border-dragon-700 rounded-xl p-5">
            <h3 className="text-sm font-rajdhani font-semibold text-fluid-cyan tracking-wider uppercase mb-3">Mesh Gateway</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-xs text-dragon-200">Port Waikato</span><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-[10px] text-green-400">ONLINE</span></span></div>
              <div className="flex items-center justify-between opacity-50"><span className="text-xs text-dragon-200">Ahipara Node</span><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-dragon-500" /><span className="text-[10px] text-dragon-300">STANDBY</span></span></div>
              <div className="flex items-center justify-between opacity-50"><span className="text-xs text-dragon-200">Gisborne Node</span><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-dragon-500" /><span className="text-[10px] text-dragon-300">STANDBY</span></span></div>
            </div>
          </div>
          <div className="bg-dragon-800 border border-dragon-700 rounded-xl p-5">
            <h3 className="text-sm font-rajdhani font-semibold text-dragon-300 tracking-wider uppercase mb-3">Sovereign Economy</h3>
            <div className="text-center py-4">
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-xs text-dragon-200 font-medium">Dormant</div>
              <div className="text-[10px] text-dragon-300 mt-1">90/9/1 split intact</div>
              <div className="text-[10px] text-dragon-300">Flip flag to activate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
