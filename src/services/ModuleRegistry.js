/**
 * D9Enigma Module Registry
 * Pluggable module system for the Unified Studio
 * Each module is a self-contained app/panel
 */

export const MODULE_REGISTRY = [
  {
    id: 'sequencer',
    name: 'Sequencer',
    icon: '🎹',
    color: '#00f5ff',
    description: 'Step sequencer with pattern editing',
    category: 'audio',
    defaultSize: { w: 600, h: 400 },
  },
  {
    id: 'tuner',
    name: 'Tuner',
    icon: '🎸',
    color: '#6bcb77',
    description: 'Instrument tuner with frequency analysis',
    category: 'audio',
    defaultSize: { w: 400, h: 300 },
  },
  {
    id: 'radio',
    name: 'Radio',
    icon: '📻',
    color: '#ffd93d',
    description: 'Advanced radio station browser',
    category: 'audio',
    defaultSize: { w: 500, h: 400 },
  },
  {
    id: 'plasma',
    name: 'Plasma',
    icon: '🔥',
    color: '#ff6b6b',
    description: 'Plasma energy visualizer',
    category: 'visual',
    defaultSize: { w: 600, h: 500 },
  },
  {
    id: 'surf',
    name: 'Surf',
    icon: '🌊',
    color: '#00e5ff',
    description: 'Waveform surf analyzer',
    category: 'visual',
    defaultSize: { w: 600, h: 400 },
  },
  {
    id: 'garden',
    name: 'Garden',
    icon: '🌿',
    color: '#34d399',
    description: 'Harmonic garden generator',
    category: 'creative',
    defaultSize: { w: 500, h: 500 },
  },
  {
    id: 'healer',
    name: 'Healer',
    icon: '💫',
    color: '#a78bfa',
    description: 'Frequency healing tones',
    category: 'audio',
    defaultSize: { w: 400, h: 400 },
  },
  {
    id: 'kiterider',
    name: 'Kite Rider',
    icon: '🪁',
    color: '#fbbf24',
    description: 'Wind flow simulator',
    category: 'visual',
    defaultSize: { w: 600, h: 400 },
  },
  {
    id: 'infinity-racer',
    name: 'Infinity Racer',
    icon: '🏎️',
    color: '#ef4444',
    description: 'Infinite tunnel racer',
    category: 'visual',
    defaultSize: { w: 600, h: 400 },
  },
  {
    id: 'pyro-drummer',
    name: 'Pyro Drummer',
    icon: '🥁',
    color: '#f97316',
    description: 'Fire particle drum kit',
    category: 'visual',
    defaultSize: { w: 600, h: 400 },
  },
  {
    id: 'stargaze',
    name: 'Stargaze',
    icon: '✨',
    color: '#818cf8',
    description: 'Star field constellation viewer',
    category: 'visual',
    defaultSize: { w: 700, h: 500 },
  },
  {
    id: 'portal',
    name: 'Portal',
    icon: '🌀',
    color: '#c084fc',
    description: 'Dimensional portal visualizer',
    category: 'visual',
    defaultSize: { w: 500, h: 500 },
  },
  {
    id: 'organ',
    name: 'Organ',
    icon: '🎹',
    color: '#fb923c',
    description: 'Virtual pipe organ',
    category: 'audio',
    defaultSize: { w: 700, h: 350 },
  },
  {
    id: 'pianola',
    name: 'Pianola',
    icon: '🎼',
    color: '#f472b6',
    description: 'Player piano roll',
    category: 'audio',
    defaultSize: { w: 600, h: 300 },
  },
  {
    id: 'artist-gallery',
    name: 'Artist Gallery',
    icon: '🎨',
    color: '#ec4899',
    description: 'Digital art gallery',
    category: 'creative',
    defaultSize: { w: 600, h: 500 },
  },
  {
    id: 'exhibition',
    name: 'Exhibition',
    icon: '🖼️',
    color: '#14b8a6',
    description: 'Curated exhibition space',
    category: 'creative',
    defaultSize: { w: 700, h: 500 },
  },
  {
    id: 'accountant',
    name: 'Accountant',
    icon: '📊',
    color: '#22c55e',
    description: 'Sovereign accounting ledger',
    category: 'system',
    defaultSize: { w: 500, h: 400 },
  },
  {
    id: 'harmonyexchange',
    name: 'Harmony Exchange',
    icon: '💱',
    color: '#eab308',
    description: 'Currency exchange rates',
    category: 'system',
    defaultSize: { w: 400, h: 350 },
  },
  {
    id: 'nodefabric',
    name: 'Node Fabric',
    icon: '🕸️',
    color: '#6366f1',
    description: 'Mesh network node map',
    category: 'system',
    defaultSize: { w: 600, h: 500 },
  },
  {
    id: 'universalbridge',
    name: 'Universal Bridge',
    icon: '🌉',
    color: '#3b82f6',
    description: 'Cross-platform bridge',
    category: 'system',
    defaultSize: { w: 500, h: 400 },
  },
  {
    id: 'designer',
    name: 'Designer',
    icon: '✏️',
    color: '#f43f5e',
    description: 'UI/UX pattern designer',
    category: 'creative',
    defaultSize: { w: 700, h: 500 },
  },
  {
    id: 'dragon8editor',
    name: 'Dragon 8 Editor',
    icon: '🐉',
    color: '#d4af37',
    description: 'Dragon 8 time editor',
    category: 'system',
    defaultSize: { w: 500, h: 400 },
  },
];

class ModuleManager {
  constructor() {
    this.activeModules = new Map();
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.getState()));
  }

  getState() {
    return {
      activeModules: Array.from(this.activeModules.entries()),
      registry: MODULE_REGISTRY,
    };
  }

  open(moduleId) {
    const module = MODULE_REGISTRY.find(m => m.id === moduleId);
    if (!module) return;

    const instanceId = `${moduleId}_${Date.now()}`;
    this.activeModules.set(instanceId, {
      ...module,
      instanceId,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      zIndex: this.activeModules.size + 1,
    });
    this.notify();
    return instanceId;
  }

  close(instanceId) {
    this.activeModules.delete(instanceId);
    this.notify();
  }

  bringToFront(instanceId) {
    const mod = this.activeModules.get(instanceId);
    if (mod) {
      mod.zIndex = Math.max(...Array.from(this.activeModules.values()).map(m => m.zIndex)) + 1;
      this.notify();
    }
  }
}

export const moduleManager = new ModuleManager();
