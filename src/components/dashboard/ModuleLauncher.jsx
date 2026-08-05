import React from 'react'
const MODS = [
  {id:'tide-synth',label:'Tide Synth',icon:'🌊',desc:'Generative audio from live swell data'},
  {id:'vector-studio',label:'Vector Studio',icon:'✏️',desc:'Smart SVGs with parameter-driven motion'},
  {id:'genre-forge',label:'Genre Forge',icon:'🎬',desc:'Action/comedy/drama auto-assembler'},
  {id:'puppet-rig',label:'Puppet Rig',icon:'🎭',desc:'Joint-controlled avatar performers'},
  {id:'ingest-port',label:'Ingest Port',icon:'📥',desc:'Auto-tag, sync, forge pipeline'},
  {id:'clip-editor',label:'Clip Editor',icon:'✂️',desc:'4-track timeline with Go Live'},
  {id:'channel-builder',label:'Channel Builder',icon:'📺',desc:'Program strip to broadcast feed'},
  {id:'dual-host',label:'Dual Host',icon:'🎙️',desc:'Hype Guy ↔ Frostbite Wahine handoff'},
]
export default function ModuleLauncher() {
  return (
    <div className="bg-dragon-800 border border-dragon-700 rounded-xl p-5">
      <h3 className="text-sm font-rajdhani font-semibold text-fluid-cyan tracking-wider uppercase mb-4">Creation Modules</h3>
      <div className="grid grid-cols-2 gap-2">
        {MODS.map(m => (
          <button key={m.id} className="group relative bg-dragon-900/60 hover:bg-dragon-700/60 border border-dragon-700/50 hover:border-fluid-cyan/40 rounded-lg p-3 text-left transition-all duration-200">
            <div className="flex items-center gap-2 mb-1"><span className="text-base">{m.icon}</span><span className="text-xs font-semibold text-white group-hover:text-fluid-cyan transition-colors">{m.label}</span></div>
            <div className="text-[10px] text-dragon-200 leading-tight">{m.desc}</div>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-dragon-500" />
          </button>
        ))}
      </div>
    </div>
  )
}
