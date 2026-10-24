import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowRight, ShoppingBag, Home, Sparkles, Layers, Heart, User, Star, Share2,
  Citrus, Flower2, TreePine, Droplets, Flame, Clock, Wind, Users, ChevronLeft, Minus, Plus, Search,
} from "lucide-react";
import hero from "@/assets/hero-bottle.jpg";
import oud from "@/assets/oud-wood.jpg";
import rose from "@/assets/rosewater.jpg";
import bokeh from "@/assets/bokeh-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SCENTORA — Luxury Perfume App UI" },
      { name: "description", content: "SCENTORA luxury perfume app: onboarding, shop, product detail and bag screens in dark green and gold." },
      { property: "og:title", content: "SCENTORA — Luxury Perfume App UI" },
      { property: "og:description", content: "Discover your essence. A premium perfume shopping experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: Index,
});

function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="text-gold">
      <path d="M12 6v34h24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="21" y="18" width="11" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="24" y="13" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  );
}

function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="phone">{children}</div>
      <span className="font-serif text-lg text-gold-soft tracking-wide">{label}</span>
    </div>
  );
}

function Onboarding() {
  return (
    <div className="h-full relative flex items-center justify-center p-6">
      <img src={bokeh} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="glass relative rounded-xl p-8 text-center flex flex-col items-center gap-5">
        <Logo size={64} />
        <h1 className="font-serif text-4xl tracking-[0.25em] text-gold-soft">SCENTORA</h1>
        <div>
          <p className="font-serif text-2xl">Discover Your Essence</p>
          <p className="mt-2 text-sm text-muted-foreground">Luxury perfumes. Exquisite scents.</p>
        </div>
        <button className="btn-gold mt-2 w-full rounded-full py-4 font-semibold flex items-center justify-center gap-2">
          Explore Scents <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

const notes = [
  { i: Citrus, n: "Citrus" }, { i: Flower2, n: "Floral" }, { i: TreePine, n: "Woody" },
  { i: Droplets, n: "Fresh" }, { i: Flame, n: "Spicy" },
];
const best = [
  { n: "Oud Wood", p: 95, img: oud }, { n: "Rosewater", p: 80, img: rose },
];

function Stars() {
  return <div className="flex gap-0.5 text-gold">{[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}</div>;
}

function BottomNav() {
  const items = [Home, Sparkles, Layers, Heart, User];
  return (
    <div className="absolute bottom-0 inset-x-0 glass rounded-t-xl px-6 py-3 flex justify-between">
      {items.map((I, k) => <I key={k} size={20} className={k === 0 ? "text-gold" : "text-muted-foreground"} />)}
    </div>
  );
}

function HomeScreen() {
  const [active, setActive] = useState("Floral");
  return (
    <div className="h-full relative overflow-hidden">
      <div className="h-full overflow-y-auto pb-20 px-5 pt-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Logo size={28} /><span className="font-serif text-lg tracking-[0.2em] text-gold-soft">SCENTORA</span></div>
          <div className="relative glass rounded-full p-2">
            <ShoppingBag size={18} className="text-gold" />
            <span className="absolute -top-1 -right-1 btn-gold text-[10px] font-bold h-4 w-4 rounded-full grid place-items-center">2</span>
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden h-44">
          <img src={hero} alt="Perfume bottle with gold cap" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
          <div className="relative p-5 h-full flex flex-col justify-end w-2/3">
            <p className="font-serif text-2xl leading-tight">Find Your Signature Scent.</p>
            <span className="mt-2 text-xs text-gold flex items-center gap-1">Shop now <ArrowRight size={12} /></span>
          </div>
        </div>
        <div>
          <p className="font-serif text-lg mb-3">Notes</p>
          <div className="flex gap-3 overflow-x-auto">
            {notes.map(({ i: I, n }) => (
              <button key={n} onClick={() => setActive(n)} className="flex flex-col items-center gap-1 shrink-0">
                <span className={`h-12 w-12 rounded-full grid place-items-center ${active === n ? "btn-gold" : "glass text-gold"}`}><I size={18} /></span>
                <span className="text-[11px] text-muted-foreground">{n}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-baseline mb-3"><p className="font-serif text-lg">Best Sellers</p><span className="text-xs text-gold">See all</span></div>
          <div className="grid grid-cols-2 gap-3">
            {best.map((b) => (
              <div key={b.n} className="glass rounded-lg p-2">
                <img src={b.img} alt={b.n} className="h-28 w-full object-cover rounded-md" />
                <p className="mt-2 font-serif text-base">{b.n}</p>
                <Stars />
                <p className="text-sm text-gold font-semibold mt-1">${b.p.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Detail() {
  const [liked, setLiked] = useState(true);
  const feats = [
    { i: TreePine, k: "Key Note", v: "Oud" }, { i: Clock, k: "Longevity", v: "Long Lasting" },
    { i: Wind, k: "Projection", v: "Strong" }, { i: Users, k: "Gender", v: "Unisex" },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="relative h-[52%]">
        <img src={oud} alt="Oud Wood perfume" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <button className="absolute top-5 left-5 glass rounded-full p-2"><ChevronLeft size={18} /></button>
        <div className="absolute top-5 right-5 flex gap-2">
          <button onClick={() => setLiked(!liked)} className="glass rounded-full p-2 text-gold"><Heart size={18} fill={liked ? "currentColor" : "none"} /></button>
          <button className="glass rounded-full p-2 text-gold"><Share2 size={18} /></button>
        </div>
      </div>
      <div className="flex-1 px-5 -mt-6 relative flex flex-col">
        <div className="flex justify-between items-end">
          <h2 className="font-serif text-3xl">Oud Wood</h2>
          <p className="text-xl text-gold font-semibold">$95.00</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">A rare, smoky blend of oud, sandalwood and vetiver, warmed by cardamom and tonka bean.</p>
        <div className="glass rounded-lg mt-4 grid grid-cols-4 py-3">
          {feats.map(({ i: I, k, v }) => (
            <div key={k} className="flex flex-col items-center text-center gap-1">
              <I size={16} className="text-gold" />
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{k}</span>
              <span className="text-[10px] font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <button className="btn-gold mt-auto mb-5 rounded-full py-4 font-semibold flex items-center justify-center gap-2">
          <ShoppingBag size={18} /> Add to Bag
        </button>
      </div>
    </div>
  );
}

function Bag() {
  const [items, setItems] = useState([
    { n: "Oud Wood", p: 95, q: 1, img: oud }, { n: "Rosewater", p: 80, q: 1, img: rose },
  ]);
  const set = (i: number, d: number) => setItems(items.map((it, k) => k === i ? { ...it, q: Math.max(1, it.q + d) } : it));
  const sub = items.reduce((s, i) => s + i.p * i.q, 0);
  const ship = 8.5;
  return (
    <div className="h-full flex flex-col px-5 pt-6 pb-5">
      <div className="flex items-center justify-between mb-5">
        <ChevronLeft size={20} /><h2 className="font-serif text-2xl">My Bag</h2><ShoppingBag size={18} className="text-gold" />
      </div>
      <div className="space-y-3">
        {items.map((it, k) => (
          <div key={it.n} className="glass rounded-lg p-2 flex items-center gap-3">
            <img src={it.img} alt={it.n} className="h-16 w-16 rounded-md object-cover" />
            <div className="flex-1">
              <p className="font-serif text-lg">{it.n}</p>
              <p className="text-sm text-gold">${it.p.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-2 py-1">
              <button onClick={() => set(k, 1)}><Plus size={12} /></button>
              <span className="text-sm w-3 text-center">{it.q}</span>
              <button onClick={() => set(k, -1)}><Minus size={12} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="glass rounded-full mt-5 flex items-center pl-4 pr-1 py-1">
        <Search size={14} className="text-muted-foreground" />
        <input placeholder="Promo code" className="bg-transparent flex-1 text-sm px-2 outline-none placeholder:text-muted-foreground" />
        <button className="text-xs text-gold px-3 py-2">Apply</button>
      </div>
      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>${ship.toFixed(2)}</span></div>
        <div className="flex justify-between border-t pt-3 font-serif text-xl"><span>Total</span><span className="text-gold">${(sub + ship).toFixed(2)}</span></div>
      </div>
      <button className="btn-gold mt-auto rounded-full py-4 font-semibold flex items-center justify-center gap-2">
        Proceed to Checkout <ArrowRight size={18} />
      </button>
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <img src={bokeh} alt="" className="fixed inset-0 h-full w-full object-cover opacity-30" />
      <div className="relative px-6 py-14">
        <header className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">UI Kit Showcase</p>
          <h1 className="font-serif text-5xl md:text-6xl mt-3 tracking-[0.15em] text-gold-soft">SCENTORA</h1>
          <p className="text-muted-foreground mt-3">Luxury perfume app — dark green & gold</p>
        </header>
        <div className="flex flex-wrap justify-center gap-10">
          <Phone label="Welcome"><Onboarding /></Phone>
          <Phone label="Shop"><HomeScreen /></Phone>
          <Phone label="Oud Wood"><Detail /></Phone>
          <Phone label="My Bag"><Bag /></Phone>
        </div>
      </div>
    </main>
  );
}
