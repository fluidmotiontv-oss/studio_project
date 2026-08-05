import React, { useState } from 'react'
export default function BroadcastStage() {
  const [isLive, setIsLive] = useState(false)
  const [overlay, setOverlay] = useState(true)
  return (
    <div className="bg-black border border-dragon-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-dragon-800 border-b border-dragon-700">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-dragon-500'}`} />
          <span className="text-xs font-semibold text-white tracking-wider">{isLive ? 'ON AIR' : 'STANDBY'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setOverlay(!overlay)} className={`text-[10px] px-2 py-1 rounded border transition-colors ${overlay ? 'bg-fluid-cyan/20 border-fluid-cyan text-fluid-cyan' : 'bg-dragon-900 border-dragon-600 text-dragon-200'}`}>TELEMETRY</button>
          <button onClick={()=>setIsLive(!isLive)} className={`text-[10px] px-3 py-1 rounded font-bold transition-colors ${isLive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>{isLive ? 'CUT' : 'GO LIVE'}</button>
        </div>
      </div>
      <div className="relative aspect-video bg-gradient-to-br from-dragon-900 via-dragon-800 to-fluid-void flex items-center justify-center">
        <div className="absolute inset-0 opacity-20"><div className="absolute inset-0 bg-gradient-to-t from-fluid-cyan/10 via-transparent to-fluid-magenta/10 animate-pulse-slow" /></div>
        {isLive ? (
          <div className="text-center z-10"><div className="text-4xl mb-2">📡</div><div className="text-lg font-orbitron font-bold text-white">LIVE BROADCAST</div><div className="text-xs text-dragon-200 mt-1">Port Waikato • AS65001</div></div>
        ) : (
          <div className="text-center z-10"><div className="text-4xl mb-2">🐉</div><div className="text-lg font-orbitron font-bold text-dragon-200">DRAGON NINE</div><div className="text-xs text-dragon-300 mt-1">Select content to preview</div></div>
        )}
        {overlay && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
            <div className="flex items-end justify-between">
              <div className="flex gap-4">
                <div><div className="text-[10px] text-dragon-200 uppercase">Swell</div><div className="text-sm font-orbitron text-fluid-cyan">2.2m SW</div></div>
                <div><div className="text-[10px] text-dragon-200 uppercase">Wind</div><div className="text-sm font-orbitron text-white">ENE 11.5kts</div></div>
                <div><div className="text-[10px] text-dragon-200 uppercase">Tide</div><div className="text-sm font-orbitron text-fluid-amber">In 1.8m</div></div>
              </div>
              <div className="text-right"><div className="text-[10px] text-dragon-200 uppercase">Node</div><div className="text-xs font-semibold text-white">AS65001</div></div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-dragon-800 px-4 py-2 border-t border-dragon-700">
        <div className="text-[10px] text-dragon-200 uppercase mb-1.5">Program Strip</div>
        <div className="flex gap-2">
          {['Intro','Conditions','Session','Outro'].map((item,i) => (
            <div key={item} className={`flex-1 rounded border p-1.5 text-center ${i===0 ? 'bg-fluid-cyan/10 border-fluid-cyan/40' : 'bg-dragon-900/50 border-dragon-700/50'}`}>
              <div className="text-[10px] font-medium text-white">{item}</div>
              <div className="text-[9px] text-dragon-200">0:00</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
