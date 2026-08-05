import { useEffect, useState } from 'react'; import { Snowflake, Flame, Leaf, Flower2 } from 'lucide-react'; import { getDragon9Time, getSeasonalTheme } from '@/lib/dragon9Engine'; import type { Product, Language, Season } from '@/types';
const SEASON_ICONS: Record<Season, typeof Snowflake> = { winter: Snowflake, summer: Flame, autumn: Leaf, spring: Flower2 };
export default function SeasonalStorefront({ lang }: { lang: Language }) {
  const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(true); const d9 = getDragon9Time(); const SeasonIcon = SEASON_ICONS[d9.season];
  useEffect(() => { fetch('/api/products').then(r => r.json()).then((data: Product[]) => { setProducts(data.filter(p => p.available)); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const t = { en: { title: 'Seasonal Selection', subtitle: `Curated for ${d9.season}`, empty: 'No scoops available right now.' }, ja: { title: '季節のセレクション', subtitle: `${d9.season}向けの厳選品`, empty: '現在利用可能な商品がありません。' } }[lang];
  return (
    <section className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getSeasonalTheme(d9.season)} p-8 sovereign-glow`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2"><SeasonIcon className="w-6 h-6 text-white/80" /><h2 className="text-2xl font-bold">{t.title}</h2></div>
        <p className="text-white/60 mb-6">{t.subtitle}</p>
        {loading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />)}</div> : products.length === 0 ? <p className="text-white/40 italic">{t.empty}</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{products.map(p => (
            <div key={p.id} className="glass-panel p-5 hover:bg-white/10 transition-colors group">
              <div className="aspect-video rounded-lg bg-white/5 mb-4 overflow-hidden">{p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-white/20"><Snowflake className="w-8 h-8" /></div>}</div>
              <h3 className="font-semibold text-lg">{lang === 'ja' ? p.nameJa : p.name}</h3><p className="text-white/50 text-sm mt-1 line-clamp-2">{p.description}</p>
              <div className="mt-4 flex items-center justify-between"><span className="text-dragon-400 font-mono font-bold">${p.price.toFixed(2)}</span><span className="text-xs uppercase tracking-wider text-white/30">{p.category}</span></div>
            </div>
          ))}</div>
        )}
      </div>
    </section>
  );
}