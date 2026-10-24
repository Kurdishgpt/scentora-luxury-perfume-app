import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft, ShoppingBag, Home, Sparkles, Layers, Heart, User, Star, Share2,
  Citrus, Flower2, TreePine, Droplets, Flame, Clock, Wind, Users, ChevronRight, Minus, Plus, Search, Trash2,
} from "lucide-react";
import hero from "@/assets/hero-bottle.jpg";
import oud from "@/assets/oud-wood.jpg";
import rose from "@/assets/rosewater.jpg";
import bokeh from "@/assets/bokeh-bg.jpg";

export const WHATSAPP_NUMBER = "9647701575609";
export const SIZES = [20, 100, 250, 500] as const;
type Size = (typeof SIZES)[number];

const PRODUCTS = {
  oud: { name: "عوود وود", img: oud, prices: { 20: 25, 100: 95, 250: 210, 500: 390 } as Record<Size, number> },
  rose: { name: "ڕۆزواتەر", img: rose, prices: { 20: 20, 100: 80, 250: 180, 500: 330 } as Record<Size, number> },
};
type PId = keyof typeof PRODUCTS;
type Line = { id: PId; size: Size; q: number };
const SHIPPING = 8.5;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سێنتۆرا — بۆنی بەناوبانگ" },
      { name: "description", content: "سێنتۆرا: بۆنی لوکس بە گرام بکڕە — ٢٠، ١٠٠، ٢٥٠ و ٥٠٠ گرام، داواکاری بە واتسئاپ." },
      { property: "og:title", content: "سێنتۆرا — بۆنی بەناوبانگ" },
      { property: "og:description", content: "جەوهەری خۆت بدۆزەرەوە. بۆنی لوکس بە گرام." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@500;600;700&display=swap" },
    ],
  }),
  component: Index,
});

const money = (n: number) => `$${n.toFixed(2)}`;

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
      <span className="font-serif text-lg text-gold-soft">{label}</span>
    </div>
  );
}

function Onboarding() {
  return (
    <div className="h-full relative flex items-center justify-center p-6">
      <img src={bokeh} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="glass relative rounded-xl p-8 text-center flex flex-col items-center gap-5">
        <Logo size={64} />
        <h1 className="font-serif text-4xl text-gold-soft">سێنتۆرا</h1>
        <div>
          <p className="font-serif text-2xl">جەوهەری خۆت بدۆزەرەوە</p>
          <p className="mt-2 text-sm text-muted-foreground">بۆنی لوکس. عەتری نایاب.</p>
        </div>
        <button className="btn-gold mt-2 w-full rounded-full py-4 font-semibold flex items-center justify-center gap-2">
          بۆنەکان ببینە <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
}

const notes = [
  { i: Citrus, n: "لیمۆیی" }, { i: Flower2, n: "گوڵ" }, { i: TreePine, n: "دار" },
  { i: Droplets, n: "فێنک" }, { i: Flame, n: "بەهارات" },
];

function Stars() {
  return <div className="flex gap-0.5 text-gold">{[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}</div>;
}

function BottomNav({ count }: { count: number }) {
  const items = [Home, Sparkles, Layers, Heart, User];
  return (
    <div className="absolute bottom-0 inset-x-0 glass rounded-t-xl px-6 py-3 flex justify-between">
      {items.map((I, k) => <I key={k} size={20} className={k === 0 ? "text-gold" : "text-muted-foreground"} />)}
      <span className="sr-only">{count}</span>
    </div>
  );
}

function SizePicker({ value, onChange }: { value: Size; onChange: (s: Size) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SIZES.map((s) => (
        <button key={s} onClick={() => onChange(s)}
          className={`rounded-full py-1.5 text-xs font-semibold ${value === s ? "btn-gold" : "glass text-gold"}`}>
          {s} گ
        </button>
      ))}
    </div>
  );
}

function HomeScreen({ count, add }: { count: number; add: (id: PId, s: Size) => void }) {
  const [active, setActive] = useState("گوڵ");
  return (
    <div className="h-full relative overflow-hidden">
      <div className="h-full overflow-y-auto pb-20 px-5 pt-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Logo size={28} /><span className="font-serif text-lg text-gold-soft">سێنتۆرا</span></div>
          <div className="relative glass rounded-full p-2">
            <ShoppingBag size={18} className="text-gold" />
            <span className="absolute -top-1 -left-1 btn-gold text-[10px] font-bold h-4 min-w-4 px-1 rounded-full grid place-items-center">{count}</span>
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden h-44">
          <img src={hero} alt="بوتڵی بۆن" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/90 to-transparent" />
          <div className="relative p-5 h-full flex flex-col justify-end w-2/3">
            <p className="font-serif text-2xl leading-snug">بۆنی تایبەتی خۆت بدۆزەرەوە</p>
          </div>
        </div>
        <div>
          <p className="font-serif text-lg mb-3">نۆتەکان</p>
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
          <p className="font-serif text-lg mb-3">پڕفرۆشترین</p>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(PRODUCTS) as PId[]).map((id) => {
              const p = PRODUCTS[id];
              return (
                <div key={id} className="glass rounded-lg p-2">
                  <img src={p.img} alt={p.name} className="h-28 w-full object-cover rounded-md" />
                  <p className="mt-2 font-serif text-base">{p.name}</p>
                  <Stars />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gold font-semibold">{money(p.prices[100])} / ١٠٠گ</p>
                    <button onClick={() => add(id, 100)} className="btn-gold rounded-full p-1"><Plus size={12} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav count={count} />
    </div>
  );
}

function Detail({ add }: { add: (id: PId, s: Size) => void }) {
  const [liked, setLiked] = useState(true);
  const [size, setSize] = useState<Size>(100);
  const [added, setAdded] = useState(false);
  const p = PRODUCTS.oud;
  const feats = [
    { i: TreePine, k: "نۆتی سەرەکی", v: "عوود" }, { i: Clock, k: "مانەوە", v: "درێژخایەن" },
    { i: Wind, k: "بڵاوبوونەوە", v: "بەهێز" }, { i: Users, k: "ڕەگەز", v: "هەردووک" },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="relative h-[42%]">
        <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <button className="absolute top-5 right-5 glass rounded-full p-2"><ChevronRight size={18} /></button>
        <div className="absolute top-5 left-5 flex gap-2">
          <button onClick={() => setLiked(!liked)} className="glass rounded-full p-2 text-gold"><Heart size={18} fill={liked ? "currentColor" : "none"} /></button>
          <button className="glass rounded-full p-2 text-gold"><Share2 size={18} /></button>
        </div>
      </div>
      <div className="flex-1 px-5 -mt-6 relative flex flex-col">
        <div className="flex justify-between items-end">
          <h2 className="font-serif text-3xl">{p.name}</h2>
          <p className="text-xl text-gold font-semibold">{money(p.prices[size])}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">تێکەڵەیەکی دەگمەن و دوکەڵاوی لە عوود، سەندەڵ و ڤێتیڤەر، گەرمکراوە بە هێل و تۆنکا.</p>
        <p className="text-xs mt-3 mb-2 text-gold-soft">قەبارە (گرام)</p>
        <SizePicker value={size} onChange={setSize} />
        <div className="glass rounded-lg mt-3 grid grid-cols-4 py-2">
          {feats.map(({ i: I, k, v }) => (
            <div key={k} className="flex flex-col items-center text-center gap-1">
              <I size={15} className="text-gold" />
              <span className="text-[9px] text-muted-foreground">{k}</span>
              <span className="text-[10px] font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { add("oud", size); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          className="btn-gold mt-auto mb-5 rounded-full py-4 font-semibold flex items-center justify-center gap-2">
          <ShoppingBag size={18} /> {added ? "زیادکرا ✓" : "زیادکردن بۆ سەبەتە"}
        </button>
      </div>
    </div>
  );
}

function Bag({ lines, setLines }: { lines: Line[]; setLines: (l: Line[]) => void }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const change = (i: number, d: number) => setLines(lines.map((l, k) => k === i ? { ...l, q: Math.max(1, l.q + d) } : l));
  const setSize = (i: number, s: Size) => setLines(lines.map((l, k) => k === i ? { ...l, size: s } : l));
  const remove = (i: number) => setLines(lines.filter((_, k) => k !== i));
  const sub = lines.reduce((s, l) => s + PRODUCTS[l.id].prices[l.size] * l.q, 0);
  const total = sub + (lines.length ? SHIPPING : 0);

  const checkout = () => {
    const rows = lines.map((l) => `• ${PRODUCTS[l.id].name} — ${l.size} گرام × ${l.q} = ${money(PRODUCTS[l.id].prices[l.size] * l.q)}`);
    const msg = [
      "داواکاری نوێ لە سێنتۆرا 🌿", "", ...rows, "",
      `کۆی بەرهەم: ${money(sub)}`, `گەیاندن: ${money(SHIPPING)}`, `کۆی گشتی: ${money(total)}`, "",
      name && `ناو: ${name}`, address && `ناونیشان: ${address}`,
    ].filter((x) => x !== false && x !== "" || x === "").join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="h-full flex flex-col px-5 pt-6 pb-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <ChevronRight size={20} /><h2 className="font-serif text-2xl">سەبەتەکەم</h2><ShoppingBag size={18} className="text-gold" />
      </div>
      <div className="space-y-3">
        {lines.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">سەبەتەکەت بەتاڵە</p>}
        {lines.map((l, k) => {
          const p = PRODUCTS[l.id];
          return (
            <div key={k} className="glass rounded-lg p-2 space-y-2">
              <div className="flex items-center gap-3">
                <img src={p.img} alt={p.name} className="h-14 w-14 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-serif text-base">{p.name}</p>
                  <p className="text-sm text-gold">{money(p.prices[l.size])}</p>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-2 py-1">
                  <button onClick={() => change(k, 1)}><Plus size={12} /></button>
                  <span className="text-sm w-3 text-center">{l.q}</span>
                  <button onClick={() => change(k, -1)}><Minus size={12} /></button>
                </div>
                <button onClick={() => remove(k)} className="text-muted-foreground"><Trash2 size={14} /></button>
              </div>
              <SizePicker value={l.size} onChange={(s) => setSize(k, s)} />
            </div>
          );
        })}
      </div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ناوت"
        className="glass rounded-full mt-4 px-4 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground" />
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ناونیشان"
        className="glass rounded-full mt-2 px-4 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground" />
      <div className="glass rounded-full mt-2 flex items-center pr-4 pl-1 py-1">
        <Search size={14} className="text-muted-foreground" />
        <input placeholder="کۆدی داشکاندن" className="bg-transparent flex-1 text-sm px-2 outline-none placeholder:text-muted-foreground" />
        <button className="text-xs text-gold px-3 py-1">جێبەجێکردن</button>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground"><span>کۆی بەرهەم</span><span>{money(sub)}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>گەیاندن</span><span>{money(lines.length ? SHIPPING : 0)}</span></div>
        <div className="flex justify-between border-t pt-3 font-serif text-xl"><span>کۆی گشتی</span><span className="text-gold">{money(total)}</span></div>
      </div>
      <button disabled={!lines.length} onClick={checkout}
        className="btn-gold mt-4 rounded-full py-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
        ناردنی داواکاری بە واتسئاپ <ArrowLeft size={18} />
      </button>
    </div>
  );
}

function Index() {
  const [lines, setLines] = useState<Line[]>([
    { id: "oud", size: 100, q: 1 }, { id: "rose", size: 100, q: 1 },
  ]);
  const add = (id: PId, size: Size) => {
    const i = lines.findIndex((l) => l.id === id && l.size === size);
    if (i >= 0) setLines(lines.map((l, k) => k === i ? { ...l, q: l.q + 1 } : l));
    else setLines([...lines, { id, size, q: 1 }]);
  };
  const count = lines.reduce((s, l) => s + l.q, 0);
  return (
    <main dir="rtl" className="min-h-screen relative overflow-hidden">
      <img src={bokeh} alt="" className="fixed inset-0 h-full w-full object-cover opacity-30" />
      <div className="relative px-6 py-14">
        <header className="text-center mb-12">
          <p className="text-xs text-gold">بۆنی لوکس بە گرام</p>
          <h1 className="font-serif text-5xl md:text-6xl mt-3 text-gold-soft">سێنتۆرا</h1>
          <p className="text-muted-foreground mt-3">٢٠ · ١٠٠ · ٢٥٠ · ٥٠٠ گرام — داواکاری بە واتسئاپ</p>
        </header>
        <div className="flex flex-wrap justify-center gap-10">
          <Phone label="بەخێربێیت"><Onboarding /></Phone>
          <Phone label="فرۆشگا"><HomeScreen count={count} add={add} /></Phone>
          <Phone label="عوود وود"><Detail add={add} /></Phone>
          <Phone label="سەبەتەکەم"><Bag lines={lines} setLines={setLines} /></Phone>
        </div>
      </div>
    </main>
  );
}
