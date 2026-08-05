import { useState } from 'react'; import { Plus, Minus, ShoppingCart, Send } from 'lucide-react'; import type { Product, Language, OrderItem, KioskOrder } from '@/types';
export default function TabletOrderKiosk({ lang }: { lang: Language }) {
  const [cart, setCart] = useState<OrderItem[]>([]); const [name, setName] = useState(''); const [submitted, setSubmitted] = useState(false);
  const demoProducts: Product[] = [
    { id: '1', name: 'Tokyo Vanilla', nameJa: '東京バニラ', price: 6.50, category: 'scoop', available: true, description: 'Madagascar bourbon, local cream' },
    { id: '2', name: 'Dragon Matcha', nameJa: 'ドラゴン抹茶', price: 7.00, category: 'scoop', available: true, description: 'Uji matcha, ceremonial grade' },
    { id: '3', name: 'Shavings Special', nameJa: 'シェービングスペシャル', price: 9.00, category: 'sundae', available: true, description: '90/9/1 split, sovereign topping' },
  ];
  const adjustQty = (productId: string, delta: number) => { setCart(prev => { const existing = prev.find(i => i.productId === productId); if (!existing) return delta > 0 ? [...prev, { productId, quantity: 1, notes: '' }] : prev; const newQty = existing.quantity + delta; if (newQty <= 0) return prev.filter(i => i.productId !== productId); return prev.map(i => i.productId === productId ? { ...i, quantity: newQty } : i); }); };
  const total = cart.reduce((sum, item) => { const p = demoProducts.find(d => d.id === item.productId); return sum + (p?.price || 0) * item.quantity; }, 0);
  const submit = async () => { if (!name || cart.length === 0) return; const order: KioskOrder = { items: cart, total, customerName: name, pickupTime: new Date().toISOString(), language: lang }; await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }); setSubmitted(true); setCart([]); setName(''); setTimeout(() => setSubmitted(false), 3000); };
  const t = { en: { title: 'Order Kiosk', yourName: 'Your Name', submit: 'Place Order', sent: 'Order Sent!' }, ja: { title: '注文キオスク', yourName: 'お名前', submit: '注文する', sent: '注文完了！' } }[lang];
  return (
    <section className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-6"><ShoppingCart className="w-5 h-5 text-ice-500" /><h2 className="text-xl font-bold">{t.title}</h2></div>
      <div className="space-y-3 mb-6">{demoProducts.map(p => { const item = cart.find(c => c.productId === p.id); return (
        <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div><p className="font-medium">{lang === 'ja' ? p.nameJa : p.name}</p><p className="text-sm text-white/40">${p.price.toFixed(2)}</p></div>
          <div className="flex items-center gap-3"><button onClick={() => adjustQty(p.id, -1)} className="p-1 rounded hover:bg-white/10"><Minus className="w-4 h-4" /></button><span className="w-6 text-center font-mono">{item?.quantity || 0}</span><button onClick={() => adjustQty(p.id, 1)} className="p-1 rounded hover:bg-white/10"><Plus className="w-4 h-4" /></button></div>
        </div>
      ); })}</div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t.yourName} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-dragon-500 outline-none mb-4" />
      <div className="flex items-center justify-between"><span className="font-mono text-lg text-dragon-400">${total.toFixed(2)}</span><button onClick={submit} disabled={!name || cart.length === 0} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-dragon-600 hover:bg-dragon-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium">{submitted ? <><Send className="w-4 h-4" /> {t.sent}</> : t.submit}</button></div>
    </section>
  );
}