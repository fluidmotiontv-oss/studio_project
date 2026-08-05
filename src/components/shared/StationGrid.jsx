import React, { useState, useEffect } from 'react';
import { dragon9Time, STATIONS } from '../../services/Dragon9Time.js';

export function StationGrid() {
  const [stations, setStations] = useState([]);
  const [localOffset, setLocalOffset] = useState(0);

  useEffect(() => {
    setLocalOffset(dragon9Time.getLocalOffset());
    const update = () => setStations(dragon9Time.getAllStations());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-fluid-surface border border-fluid-panel rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-orbitron text-fluid-amber tracking-widest">
          🌍 36-STATION SYNC
        </span>
        <span className="text-[9px] text-gray-500">
          LOCAL UTC{localOffset >= 0 ? '+' : ''}{localOffset}
        </span>
      </div>

      <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
        {stations.map((st, i) => {
          const color = st.isRelax ? '#ffaa00' : `hsl(${st.hue}, 100%, 50%)`;
          const isRootMod3 = st.root % 3 === 0;

          return (
            <div
              key={i}
              className="p-1 rounded border text-center transition-all"
              style={{
                borderColor: isRootMod3 ? color : 'rgba(255,255,255,0.05)',
                background: 'rgba(2,2,2,0.85)',
                color: color,
              }}
            >
              <div className="text-[7px] text-gray-500 uppercase truncate">{st.station}</div>
              <div className="text-[10px] font-bold font-mono">
                {st.isRelax ? 'RELAX' : `${String(st.h).padStart(2,'0')}:${String(st.m).padStart(2,'0')}`}
              </div>
              {isRootMod3 && (
                <div className="text-[7px] opacity-70">R{st.root}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
