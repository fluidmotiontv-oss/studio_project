import { useState } from 'react'; import Navbar from '@/components/Navbar'; import SeasonalStorefront from '@/components/SeasonalStorefront'; import TabletOrderKiosk from '@/components/TabletOrderKiosk'; import InstagramFeed from '@/components/InstagramFeed'; import type { Language } from '@/types';
export default function App() {
  const [lang, setLang] = useState<Language>('en'); const toggleLang = () => setLang(l => l === 'en' ? 'ja' : 'en');
  return (
    <div className="min-h-screen bg-dragon-950">
      <Navbar lang={lang} onToggleLang={toggleLang} />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <SeasonalStorefront lang={lang} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2"><InstagramFeed lang={lang} /></div><div><TabletOrderKiosk lang={lang} /></div></div>
      </main>
      <footer className="mt-16 py-8 border-t border-white/5 text-center text-sm text-white/30">Ice Plant × Dragon 9 — Sovereign Commerce Node</footer>
    </div>
  );
}