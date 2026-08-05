import React from 'react';
import { MODULE_REGISTRY } from '../../services/ModuleRegistry.js';
import { useModuleManager } from '../../hooks/useModuleManager.js';

export function ModuleLauncher() {
  const { openModule } = useModuleManager();

  const categories = [...new Set(MODULE_REGISTRY.map(m => m.category))];

  return (
    <div className="h-full flex flex-col p-3 overflow-y-auto">
      <div className="text-[10px] font-orbitron text-fluid-magenta tracking-widest mb-3">
        🧩 D9ENIGMA MODULES
      </div>

      {categories.map(cat => (
        <div key={cat} className="mb-3">
          <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-1.5">{cat}</div>
          <div className="grid grid-cols-2 gap-1.5">
            {MODULE_REGISTRY.filter(m => m.category === cat).map(mod => (
              <button
                key={mod.id}
                onClick={() => openModule(mod.id)}
                className="flex items-center gap-2 p-2 rounded bg-fluid-panel/50 border border-transparent hover:border-white/10 transition-all text-left group"
              >
                <div 
                  className="w-7 h-7 rounded flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: mod.color + '20', color: mod.color }}
                >
                  {mod.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-gray-300 group-hover:text-white truncate">{mod.name}</div>
                  <div className="text-[7px] text-gray-600 truncate">{mod.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
