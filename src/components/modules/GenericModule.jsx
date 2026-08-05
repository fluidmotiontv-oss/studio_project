import React from 'react';
import { ModuleWindow } from './ModuleWindow.jsx';

export function GenericModule({ instance }) {
  return (
    <ModuleWindow instance={instance}>
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">{instance.icon}</div>
        <div className="text-lg font-orbitron font-bold mb-2" style={{ color: instance.color }}>
          {instance.name}
        </div>
        <div className="text-sm text-gray-500 mb-4">{instance.description}</div>
        <div className="text-xs text-gray-600 max-w-xs">
          This D9Enigma module is registered but not yet implemented in the React architecture.
          <br/><br/>
          Port your existing HTML/JS module code into:
          <code className="block mt-2 p-2 bg-fluid-void rounded text-fluid-cyan text-[10px]">
            src/components/modules/{instance.id}Module.jsx
          </code>
        </div>
        <div className="mt-4 text-[10px] text-gray-700">
          Module ID: <span className="text-fluid-magenta">{instance.id}</span>
          <br/>
          Category: <span className="text-fluid-amber">{instance.category}</span>
        </div>
      </div>
    </ModuleWindow>
  );
}
