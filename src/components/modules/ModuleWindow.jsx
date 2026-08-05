import React, { useRef, useState, useEffect } from 'react';
import { useModuleManager } from '../../hooks/useModuleManager.js';

export function ModuleWindow({ instance, children }) {
  const { closeModule, bringToFront } = useModuleManager();
  const windowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: instance.x, y: instance.y });
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.module-close')) return;
    bringToFront(instance.instanceId);
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={windowRef}
      className="absolute bg-fluid-surface border border-fluid-panel rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: instance.defaultSize?.w || 500,
        height: instance.defaultSize?.h || 400,
        zIndex: instance.zIndex || 100,
        minWidth: 300,
        minHeight: 200,
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-fluid-panel cursor-move select-none"
        style={{ backgroundColor: instance.color + '10' }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: instance.color }}>{instance.icon}</span>
          <span className="text-[11px] font-bold" style={{ color: instance.color }}>{instance.name}</span>
        </div>
        <button
          onClick={() => closeModule(instance.instanceId)}
          className="module-close w-5 h-5 rounded flex items-center justify-center text-[10px] text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
