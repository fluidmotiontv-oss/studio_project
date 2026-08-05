#!/bin/bash
# Ice Plant ~ Dragon 9 -- Site Installer
# Run from /home/tim/studio_project/sites/

set -e

SITE_DIR="ice-plant"
mkdir -p "$SITE_DIR"/src/{components,lib}

cat > "$SITE_DIR/package.json" << 'EOF'
{
  "name": "ice-plant",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 5174",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}
EOF

cat > "$SITE_DIR/vite.config.ts" << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
EOF

cat > "$SITE_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

cat > "$SITE_DIR/tsconfig.node.json" << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

cat > "$SITE_DIR/tailwind.config.js" << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dragon: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
          950: '#052e16',
        },
        ice: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
EOF

cat > "$SITE_DIR/postcss.config.js" << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

cat > "$SITE_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ice Plant × Dragon 9</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cat > "$SITE_DIR/src/main.tsx" << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

cat > "$SITE_DIR/src/index.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-dragon-950 text-white antialiased;
  }
}

@layer components {
  .glass-panel {
    @apply bg-white/5 backdrop-blur-md border border-white/10 rounded-xl;
  }
  .sovereign-glow {
    @apply shadow-[0_0_30px_rgba(34,197,94,0.15)];
  }
}
EOF

cat > "$SITE_DIR/src/types.ts" << 'EOF'
export interface Dragon9TimeState {
  cycleHour: number;
  cycleMinute: number;
  apexActive: boolean;
  apexAngle: number;
  season: Season;
  language: Language;
}

export type Season = 'summer' | 'autumn' | 'winter' | 'spring';
export type Language = 'en' | 'ja';

export interface Product {
  id: string;
  name: string;
  nameJa: string;
  price: number;
  category: 'scoop' | 'pint' | 'sundae' | 'seasonal';
  available: boolean;
  imageUrl?: string;
  description: string;
}

export interface InstagramPost {
  id: string;
  caption: string;
  imageUrl: string;
  permalink: string;
  timestamp: string;
  scrapedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  notes: string;
}

export interface KioskOrder {
  items: OrderItem[];
  total: number;
  customerName: string;
  pickupTime: string;
  language: Language;
}
EOF

cat > "$SITE_DIR/src/lib/dragon9Engine.ts" << 'EOF'
import type { Dragon9TimeState, Season } from '@/types';

const HOUR_MINUTES = 54;
const CYCLE_HOURS = 26.6666666667;
const APEX_DURATION = 18;
const APEX_PEAK_HOUR = 9;

export function getDragon9Time(now = new Date()): Dragon9TimeState {
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const d9TotalMinutes = totalMinutes % (CYCLE_HOURS * HOUR_MINUTES);
  const cycleHour = Math.floor(d9TotalMinutes / HOUR_MINUTES);
  const cycleMinute = Math.floor(d9TotalMinutes % HOUR_MINUTES);
  const apexCenter = APEX_PEAK_HOUR * HOUR_MINUTES;
  const currentMin = cycleHour * HOUR_MINUTES + cycleMinute;
  const apexDist = Math.abs(currentMin - apexCenter);
  const apexActive = apexDist <= APEX_DURATION / 2;
  const apexAngle = apexActive ? (apexDist / (APEX_DURATION / 2)) * 4.5 : 0;
  const month = now.getMonth() + 1;
  let season: Season;
  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'autumn';
  else season = 'winter';
  return { cycleHour, cycleMinute, apexActive, apexAngle, season, language: 'en' };
}

export function formatD9Time(state: Dragon9TimeState): string {
  return `${String(state.cycleHour).padStart(2, '0')}:${String(state.cycleMinute).padStart(2, '0')}`;
}

export function getSeasonalTheme(season: Season): string {
  const themes = {
    summer: 'from-orange-500/20 to-pink-500/20',
    autumn: 'from-amber-500/20 to-orange-600/20',
    winter: 'from-ice-500/20 to-blue-600/20',
    spring: 'from-dragon-500/20 to-emerald-400/20',
  };
  return themes[season];
}
EOF

cat > "$SITE_DIR/src/components/Navbar.tsx" << 'EOF'
import { useEffect, useState } from 'react';
import { IceCream, Clock, Globe } from 'lucide-react';
import { getDragon9Time, formatD9Time } from '@/lib/dragon9Engine';
import type { Dragon9TimeState, Language } from '@/types';

export default function Navbar({ lang, onToggleLang }: { lang: Language; onToggleLang: () => void }) {
  const [time, setTime] = useState<Dragon9TimeState>(getDragon9Time());
  useEffect(() => {
    const iv = setInterval(() => setTime(getDragon9Time()), 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IceCream className="w-6 h-6 text-dragon-500" />
          <span className="font-bold text-lg tracking-tight">Ice Plant <span className="text-dragon-500">×</span> Dragon 9</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-mono text-white/60">
            <Clock className="w-4 h-4" />
            <span>{formatD9Time(time)}</span>
            {time.apexActive && <span className="text-dragon-400 animate-pulse">⚡ APEX</span>}
          </div>
          <button onClick={onToggleLang} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
            <Globe className="w-4 h-4" />{lang === 'en' ? 'EN' : 'JP'}
          </button>
        </div>
      </div>
    </nav>
  );
}
EOF

cat > "$SITE_DIR/src/components/SeasonalStorefront.tsx" << 'EOF'
import { useEffect, useState } from 'react';
import { Snowflake, Flame, Leaf, Flower2 } from 'lucide-react';
import { getDragon9Time, getSeasonalTheme } from '@/lib/dragon9Engine';
import type { Product, Language, Season } from '@/types';

const SEASON_ICONS: Record<Season, typeof Snowflake> = { winter: Snowflake, summer: Flame, autumn: Leaf, spring: Flower2 };

export default function SeasonalStorefront({ lang }: { lang: Language }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const d9 = getDragon9Time();
  const SeasonIcon = SEASON_ICONS[d9.season];

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((data: Product[]) => { setProducts(data.filter(p => p.available)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const t = {
    en: { title: 'Seasonal Selection', subtitle: `Curated for ${d9.season}`, empty: 'No scoops available right now.' },
    ja: { title: '季節のセレクション', subtitle: `${d9.season}向けの厳選品`, empty: '現在利用可能な商品がありません。' },
  }[lang];

  return (
    <section className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getSeasonalTheme(d9.season)} p-8 sovereign-glow`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <SeasonIcon className="w-6 h-6 text-white/80" />
          <h2 className="text-2xl font-bold">{t.title}</h2>
        </div>
        <p className="text-white/60 mb-6">{t.subtitle}</p>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <p className="text-white/40 italic">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="glass-panel p-5 hover:bg-white/10 transition-colors group">
                <div className="aspect-video rounded-lg bg-white/5 mb-4 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20"><Snowflake className="w-8 h-8" /></div>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{lang === 'ja' ? p.nameJa : p.name}</h3>
                <p className="text-white/50 text-sm mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-dragon-400 font-mono font-bold">${p.price.toFixed(2)}</span>
                  <span className="text-xs uppercase tracking-wider text-white/30">{p.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
EOF

cat > "$SITE_DIR/src/components/TabletOrderKiosk.tsx" << 'EOF'
import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Send } from 'lucide-react';
import type { Product, Language, OrderItem, KioskOrder } from '@/types';

export default function TabletOrderKiosk({ lang }: { lang: Language }) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const demoProducts: Product[] = [
    { id: '1', name: 'Tokyo Vanilla', nameJa: '東京バニラ', price: 6.50, category: 'scoop', available: true, description: 'Madagascar bourbon, local cream' },
    { id: '2', name: 'Dragon Matcha', nameJa: 'ドラゴン抹茶', price: 7.00, category: 'scoop', available: true, description: 'Uji matcha, ceremonial grade' },
    { id: '3', name: 'Shavings Special', nameJa: 'シェービングスペシャル', price: 9.00, category: 'sundae', available: true, description: '90/9/1 split, sovereign topping' },
  ];

  const adjustQty = (productId: string, delta: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (!existing) return delta > 0 ? [...prev, { productId, quantity: 1, notes: '' }] : prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) return prev.filter(i => i.productId !== productId);
      return prev.map(i => i.productId === productId ? { ...i, quantity: newQty } : i);
    });
  };

  const total = cart.reduce((sum, item) => {
    const p = demoProducts.find(d => d.id === item.productId);
    return sum + (p?.price || 0) * item.quantity;
  }, 0);

  const submit = async () => {
    if (!name || cart.length === 0) return;
    const order: KioskOrder = { items: cart, total, customerName: name, pickupTime: new Date().toISOString(), language: lang };
    await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    setSubmitted(true); setCart([]); setName(''); setTimeout(() => setSubmitted(false), 3000);
  };

  const t = {
    en: { title: 'Order Kiosk', yourName: 'Your Name', submit: 'Place Order', sent: 'Order Sent!' },
    ja: { title: '注文キオスク', yourName: 'お名前', submit: '注文する', sent: '注文完了！' }
  }[lang];

  return (
    <section className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="w-5 h-5 text-ice-500" />
        <h2 className="text-xl font-bold">{t.title}</h2>
      </div>
      <div className="space-y-3 mb-6">
        {demoProducts.map(p => {
          const item = cart.find(c => c.productId === p.id);
          return (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="font-medium">{lang === 'ja' ? p.nameJa : p.name}</p>
                <p className="text-sm text-white/40">${p.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => adjustQty(p.id, -1)} className="p-1 rounded hover:bg-white/10">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-mono">{item?.quantity || 0}</span>
                <button onClick={() => adjustQty(p.id, 1)} className="p-1 rounded hover:bg-white/10">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t.yourName} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-dragon-500 outline-none mb-4" />
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg text-dragon-400">${total.toFixed(2)}</span>
        <button onClick={submit} disabled={!name || cart.length === 0} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-dragon-600 hover:bg-dragon-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium">
          {submitted ? <><Send className="w-4 h-4" /> {t.sent}</> : t.submit}
        </button>
      </div>
    </section>
  );
}
EOF

cat > "$SITE_DIR/src/components/InstagramFeed.tsx" << 'EOF'
import { useEffect, useState } from 'react';
import { Instagram, RefreshCw } from 'lucide-react';
import type { InstagramPost, Language } from '@/types';

export default function InstagramFeed({ lang }: { lang: Language }) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFeed = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/instagram');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    const iv = setInterval(fetchFeed, 60000);
    return () => clearInterval(iv);
  }, []);

  const t = {
    en: { title: 'Fresh from the Plant', error: 'Scraper offline. Check localhost:3000.', empty: 'No posts yet.' },
    ja: { title: 'プラントからの新着', error: 'スクレイパーがオフラインです。localhost:3000を確認してください。', empty: '投稿はまだありません。' }
  }[lang];

  return (
    <section className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Instagram className="w-5 h-5 text-pink-400" />
          <h2 className="text-xl font-bold">{t.title}</h2>
        </div>
        <button onClick={fetchFeed} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {error ? (
        <p className="text-red-400 text-sm">{t.error}</p>
      ) : posts.length === 0 ? (
        <p className="text-white/40 text-sm italic">{t.empty}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {posts.map(post => (
            <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-lg overflow-hidden bg-white/5">
              <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-xs line-clamp-3 text-white/80">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
EOF

cat > "$SITE_DIR/src/App.tsx" << 'EOF'
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SeasonalStorefront from '@/components/SeasonalStorefront';
import TabletOrderKiosk from '@/components/TabletOrderKiosk';
import InstagramFeed from '@/components/InstagramFeed';
import type { Language } from '@/types';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const toggleLang = () => setLang(l => l === 'en' ? 'ja' : 'en');
  return (
    <div className="min-h-screen bg-dragon-950">
      <Navbar lang={lang} onToggleLang={toggleLang} />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <SeasonalStorefront lang={lang} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InstagramFeed lang={lang} />
          </div>
          <div>
            <TabletOrderKiosk lang={lang} />
          </div>
        </div>
      </main>
      <footer className="mt-16 py-8 border-t border-white/5 text-center text-sm text-white/30">Ice Plant × Dragon 9 — Sovereign Commerce Node</footer>
    </div>
  );
}
EOF

print "✅ Scaffolded all files in $SITE_DIR/ successfully"
print "Next: cd ice-plant && npm install && npm run dev"