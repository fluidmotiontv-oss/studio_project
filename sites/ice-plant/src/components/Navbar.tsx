import { useEffect, useState } from 'react'; import { IceCream, Clock, Globe } from 'lucide-react'; import { getDragon9Time, formatD9Time } from '@/lib/dragon9Engine'; import type { Dragon9TimeState, Language } from '@/types';
export default function Navbar({ lang, onToggleLang }: { lang: Language; onToggleLang: () => void }) {
  const [time, setTime] = useState<Dragon9TimeState>(getDragon9Time());
  useEffect(() => { const iv = setInterval(() => setTime(getDragon9Time()), 1000); return () => clearInterval(iv); }, []);
  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3"><IceCream className="w-6 h-6 text-dragon-500" /><span className="font-bold text-lg tracking-tight">Ice Plant <span className="text-dragon-500">×</span> Dragon 9</span></div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-mono text-white/60"><Clock className="w-4 h-4" /><span>{formatD9Time(time)}</span>{time.apexActive && <span className="text-dragon-400 animate-pulse">⚡ APEX</span>}</div>
          <button onClick={onToggleLang} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"><Globe className="w-4 h-4" />{lang === 'en' ? 'EN' : 'JP'}</button>
        </div>
      </div>
    </nav>
  );
}