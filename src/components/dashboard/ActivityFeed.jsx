import React, { useState, useEffect } from 'react'
const EVENTS = [
  {id:1,type:'beat',user:'Tane',msg:'Generated tide-locked beat • 70 BPM',time:'2m ago'},
  {id:2,type:'vector',user:'Kai',msg:'Exported Port Waikato Barrel SVG',time:'5m ago'},
  {id:3,type:'clip',user:'Aroha',msg:'Auto-clip: beauty score 94',time:'8m ago'},
  {id:4,type:'host',user:'Frostbite',msg:'Session guide updated • 3/2mm recommended',time:'12m ago'},
  {id:5,type:'channel',user:'System',msg:'Node sync • AS65001 heartbeat',time:'15m ago'},
]
const ICONS = {beat:'🎵',vector:'✏️',clip:'📹',host:'🎙️',channel:'📡'}
export default function ActivityFeed() {
  const [events] = useState(EVENTS)
  return (
    <div className="bg-dragon-800 border border-dragon-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-rajdhani font-semibold text-fluid-cyan tracking-wider uppercase">Node Activity</h3>
        <span className="text-[10px] text-dragon-200">AS65001</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {events.map(e => (
          <div key={e.id} className="flex gap-2.5 items-start p-2 rounded-lg bg-dragon-900/40 border border-dragon-700/30">
            <span className="text-sm mt-0.5">{ICONS[e.type]}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-white truncate">{e.user}</div>
              <div className="text-[10px] text-dragon-200 leading-snug">{e.msg}</div>
            </div>
            <span className="text-[9px] text-dragon-300 whitespace-nowrap">{e.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
