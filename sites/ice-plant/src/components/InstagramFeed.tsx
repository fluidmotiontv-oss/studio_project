import { useEffect, useState } from 'react'; import { Instagram, RefreshCw } from 'lucide-react'; import type { InstagramPost, Language } from '@/types';
export default function InstagramFeed({ lang }: { lang: Language }) {
  const [posts, setPosts] = useState<InstagramPost[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  const fetchFeed = async () => { setLoading(true); setError(false); try { const res = await fetch('/api/instagram'); if (!res.ok) throw new Error(); const data = await res.json(); setPosts(data.posts || []); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { fetchFeed(); const iv = setInterval(fetchFeed, 60000); return () => clearInterval(iv); }, []);
  const t = { en: { title: 'Fresh from the Plant', error: 'Scraper offline. Check localhost:3000.', empty: 'No posts yet.' }, ja: { title: 'プラントからの新着', error: 'スクレイパーがオフラインです。localhost:3000を確認してください。', empty: '投稿はまだありません。' } }[lang];
  return (
    <section className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><Instagram className="w-5 h-5 text-pink-400" /><h2 className="text-xl font-bold">{t.title}</h2></div><button onClick={fetchFeed} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button></div>
      {error ? <p className="text-red-400 text-sm">{t.error}</p> : posts.length === 0 ? <p className="text-white/40 text-sm italic">{t.empty}</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{posts.map(post => (
          <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-lg overflow-hidden bg-white/5">
            <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"><p className="text-xs line-clamp-3 text-white/80">{post.caption}</p></div>
          </a>
        ))}</div>
      )}
    </section>
  );
}