import { useState, useEffect, useCallback } from 'react';
import { moduleManager } from '../services/ModuleRegistry.js';

export function useModuleManager() {
  const [state, setState] = useState(moduleManager.getState());

  useEffect(() => {
    return moduleManager.subscribe(setState);
  }, []);

  const openModule = useCallback((moduleId) => moduleManager.open(moduleId), []);
  const closeModule = useCallback((instanceId) => moduleManager.close(instanceId), []);
  const bringToFront = useCallback((instanceId) => moduleManager.bringToFront(instanceId), []);

  return {
    ...state,
    openModule,
    closeModule,
    bringToFront,
  };
}
