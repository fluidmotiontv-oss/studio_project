import React, { useState, useEffect } from 'react'

const BASE = { location: 'Port Waikato', swellHeight: 2.2, swellPeriod: 13.5, swellDirection: 'SW', windSpeed: 11.5, windDirection: 'ENE', tideState: 'Incoming', tideHeight: 1.8, temp: 14, uvIndex: 3, rating: 5, ratingLabel: 'Epic Glassy Barrel Conditions', wetsuit: '3/2mm Full' }
function jitter(v, p=0.03) { return +(v*(1+(Math.random()-0.5)*2*p)).toFixed(2) }

export default function TelemetryPanel() {
  const [data, setData] = useState(BASE)
  useEffect(() => { const i = setInterval(() => setData(d => ({...d, swellHeight: jitter(d.swellHeight,0.05), windSpeed: jitter(d.windSpeed,0.1), temp: Math.round(jitter(d.temp,0.02))})), 8000); return () => clearInterval(i) }, [])
  const Row = ({l,v,u='',c='text-white'}) => <div className="flex justify-between items-center py-1.5 border-b border-dragon-700/30 last:border-0"><span className="text-xs text-dragon-200">{l}</span><span className={`text-xs font-semibold ${c}`}>{v}{u}</span></div>
  return (
    <div className="bg-dragon-800 border border-dragon-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-rajdhani font-semibold text-fluid-cyan tracking-wider uppercase">Live Telemetry</h3>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><span className="text-[10px] text-green-400 font-medium">LIVE</span></span>
      </div>
      <div className="mb-3 pb-3 border-b border-dragon-700/50">
        <div className="text-xs text-dragon-200 mb-1">{data.location}</div>
        <div className="flex items-center gap-2"><span className="text-lg font-orbitron font-bold text-white">{data.rating}★</span><span className="text-xs text-fluid-amber font-medium">{data.ratingLabel}</span></div>
      </div>
      <div className="space-y-0.5">
        <Row l="Swell" v={`${data.swellHeight}m ${data.swellDirection}`} c="text-fluid-cyan" />
        <Row l="Period" v={data.swellPeriod} u="s" c="text-fluid-cyan" />
        <Row l="Wind" v={`${data.windDirection} ${data.windSpeed}kts`} />
        <Row l="Tide" v={`${data.tideState} ${data.tideHeight}m`} c="text-fluid-amber" />
        <Row l="Temp" v={data.temp} u="°C" />
        <Row l="UV" v={data.uvIndex} />
        <Row l="Wetsuit" v={data.wetsuit} c="text-dragon-100" />
      </div>
    </div>
  )
}
