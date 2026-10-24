import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  ImagePlus, Save, Pencil, Citrus, Flower2, TreePine, Moon, Droplets, Plus, GripVertical, X,
  Mail, Lock, ScanFace, Shield, Store, Bell, Globe, CreditCard, ChevronLeft, Package,
} from "lucide-react";
import oud from "@/assets/oud-wood.jpg";
import rose from "@/assets/rosewater.jpg";
import hero from "@/assets/hero-bottle.jpg";
import bokeh from "@/assets/bokeh-bg.jpg";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "سێنتۆرا ئەدمین — بەڕێوەبردنی فرۆشگا" },
      { name: "description", content: "داشبۆردی بەڕێوەبردنی سێنتۆرا: زیادکردنی بەرهەم، نرخ و کۆگا، پۆل و نۆتەکان، و ڕێکخستنەکان." },
      { property: "og:title", content: "سێنتۆرا ئەدمین" },
      { property: "og:description", content: "بەڕێوەبردنی فرۆشگای بۆنی لوکس." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@500;600;700&display=swap" },
    ],
  }),
  component: Admin,
});

function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="phone"><div className="h-full overflow-y-auto px-5 pt-6 pb-6">{children}</div></div>
      <span className="font-serif text-lg text-gold-soft">{label}</span>
    </div>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-2xl mb-4 flex items-center justify-between">{children}<ChevronLeft size={18} className="text-muted-foreground" /></h2>;
}

const field = "glass w-full rounded-lg px-3 py-2.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground";
const label = "text-xs text-gold-soft mb-1 block";

function Toggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={() => set(!on)} className={`w-10 h-6 rounded-full p-0.5 flex ${on ? "btn-gold justify-start" : "glass justify-end"}`}>
      <span className="h-5 w-5 rounded-full bg-foreground" />
    </button>
  );
}

function AddProduct() {
  const [notes, setNotes] = useState(["عوود", "گوڵ", "ڤانیلا"]);
  const [saved, setSaved] = useState(false);
  const [imageName, setImageName] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);
  return (
    <>
      <Title>زیادکردنی بۆن</Title>
      <div className="space-y-3">
        <input
          ref={imageInput}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="هەڵبژاردنی وێنەی بەرهەم"
          onChange={(event) => setImageName(event.target.files?.[0]?.name ?? "")}
        />
        <button type="button" onClick={() => imageInput.current?.click()} className="glass w-full h-28 rounded-lg border-dashed flex flex-col items-center justify-center gap-1 text-gold">
          <ImagePlus size={24} /><span className="text-xs text-muted-foreground">{imageName || "بارکردنی وێنە"}</span>
        </button>
        <div><span className={label}>ناوی بۆن</span><input className={field} placeholder="عوود وود" /></div>
        <div><span className={label}>براند</span><input className={field} placeholder="سێنتۆرا" /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><span className={label}>قەبارە (مل)</span><input className={field} placeholder="100" /></div>
          <div><span className={label}>نرخ ($)</span><input className={field} placeholder="95.00" /></div>
        </div>
        <div>
          <span className={label}>نۆتە / بۆنەکان</span>
          <div className="flex flex-wrap gap-2">
            {notes.map((n) => (
              <span key={n} className="glass rounded-full px-3 py-1 text-xs flex items-center gap-1">
                {n}<button type="button" aria-label={`لابردنی ${n}`} onClick={() => setNotes(notes.filter((x) => x !== n))}><X size={10} /></button>
              </span>
            ))}
            <button type="button" onClick={() => setNotes((current) => current.includes("مسک") ? current : [...current, "مسک"])} className="rounded-full px-3 py-1 text-xs text-gold border border-dashed">+ زیادکردن</button>
          </div>
        </div>
        <button type="button" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}
          className="btn-gold w-full rounded-full py-3.5 font-semibold flex items-center justify-center gap-2 mt-2">
          <Save size={16} /> {saved ? "پاشەکەوت کرا ✓" : "پاشەکەوتکردنی بەرهەم"}
        </button>
        {saved && <p role="status" className="text-center text-xs text-gold-soft">بەرهەمەکە لەم پێشبینینەدا پاشەکەوت کرا.</p>}
      </div>
    </>
  );
}

function Inventory() {
  const [items, setItems] = useState([
    { n: "عوود وود", img: oud, p: "95.00", stock: 24, on: true },
    { n: "ڕۆزواتەر", img: rose, p: "80.00", stock: 3, on: true },
    { n: "ڕاڤان", img: hero, p: "120.00", stock: 0, on: false },
  ]);
  const upd = (i: number, patch: Partial<(typeof items)[0]>) => setItems(items.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  const focusPrice = (index: number) => document.getElementById(`inventory-price-${index}`)?.focus();
  return (
    <>
      <Title>نرخ و کۆگا</Title>
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        {[["بەرهەم", items.length], ["لە کۆگا", items.filter((i) => i.on).length], ["کەم", items.filter((i) => i.stock < 5).length]].map(([k, v]) => (
          <div key={k} className="glass rounded-lg py-2"><p className="text-lg text-gold font-semibold">{v}</p><p className="text-[10px] text-muted-foreground">{k}</p></div>
        ))}
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={it.n} className="glass rounded-lg p-2.5 flex gap-3 items-center">
            <img src={it.img} alt={it.n} className="h-16 w-14 rounded-md object-cover" />
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="font-serif text-base">{it.n}</p>
                <button type="button" aria-label={`نرخ بگۆڕە: ${it.n}`} onClick={() => focusPrice(i)} className="text-gold">
                  <Pencil size={13} />
                </button>
              </div>
              <div className="flex items-center gap-1 glass rounded-md px-2 py-0.5 w-24">
                <span className="text-gold text-xs">$</span>
                <input id={`inventory-price-${i}`} aria-label={`نرخی ${it.n}`} inputMode="decimal" value={it.p} onChange={(e) => upd(i, { p: e.target.value })} className="bg-transparent text-sm w-full outline-none" />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] rounded-full px-2 py-0.5 ${it.stock === 0 ? "bg-destructive/30" : it.stock < 5 ? "glass text-gold" : "btn-gold"}`}>
                  <Package size={9} className="inline ml-1" />{it.stock === 0 ? "نەماوە" : `${it.stock} دانە`}
                </span>
                <div className="flex items-center gap-1.5"><span className="text-[10px] text-muted-foreground">لە کۆگا</span><Toggle on={it.on} set={(v) => upd(i, { on: v })} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Categories() {
  const icons = [Citrus, Flower2, TreePine, Moon, Droplets];
  const [cats, setCats] = useState([
    { n: "لیمۆیی", tags: ["پرتەقاڵ", "لیمۆ", "بێرگاموت"] },
    { n: "گوڵ", tags: ["گوڵ", "یاسەمین"] },
    { n: "دار", tags: ["عوود", "سەندەڵ"] },
    { n: "ڕۆژهەڵاتی", tags: ["عەنبەر", "ڤانیلا"] },
    { n: "فێنک", tags: ["نەعنا", "دەریا"] },
  ]);
  return (
    <div className="relative min-h-full">
      <Title>پۆل و نۆتەکان</Title>
      <div className="space-y-3 pb-16">
        {cats.map((c, i) => {
          const I = icons[i % icons.length] ?? Citrus;
          return (
            <div key={i} className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-9 w-9 rounded-full btn-gold grid place-items-center shrink-0"><I size={16} /></span>
                <input value={c.n} onChange={(e) => setCats(cats.map((x, k) => (k === i ? { ...x, n: e.target.value } : x)))}
                  className="bg-transparent font-serif text-base flex-1 outline-none border-b border-transparent focus:border-border" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span key={t} draggable className="glass rounded-full pl-2 pr-1 py-0.5 text-[11px] flex items-center gap-0.5 cursor-grab">
                    <GripVertical size={10} className="text-muted-foreground" />{t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={() => setCats((current) => [...current, { n: "پۆلی نوێ", tags: [] }])}
        className="sticky bottom-0 mr-auto btn-gold rounded-full px-4 py-3 text-sm font-semibold flex items-center gap-1">
        <Plus size={16} /> پۆلی نوێ
      </button>
    </div>
  );
}

function LoginSettings() {
  const [face, setFace] = useState(true);
  const [twoFa, setTwoFa] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [selectedSetting, setSelectedSetting] = useState("");
  const [storeName, setStoreName] = useState("سێنتۆرا");
  const [freeDelivery, setFreeDelivery] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [storeLanguage, setStoreLanguage] = useState("کوردی");
  const menu = [[Store, "زانیاری فرۆشگا"], [CreditCard, "پارەدان و گەیاندن"], [Bell, "ئاگادارکردنەوەکان"], [Globe, "زمان: کوردی"]] as const;
  return (
    <>
      <div className="relative rounded-xl overflow-hidden mb-5">
        <img src={bokeh} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <form
          className="glass relative m-3 rounded-xl p-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setLoginMessage("چوونەژوورەوە لەم پێشبینینەدا چالاک نییە.");
          }}
        >
          <p className="font-serif text-2xl text-center text-gold-soft">دەروازەی ئەدمین</p>
          <div className="glass rounded-lg flex items-center px-3 gap-2"><Mail size={14} className="text-gold" /><input type="email" autoComplete="username" className="bg-transparent py-2.5 text-sm flex-1 outline-none placeholder:text-muted-foreground" placeholder="ئیمەیڵ" /></div>
          <div className="glass rounded-lg flex items-center px-3 gap-2"><Lock size={14} className="text-gold" /><input type="password" autoComplete="current-password" className="bg-transparent py-2.5 text-sm flex-1 outline-none placeholder:text-muted-foreground" placeholder="وشەی نهێنی" /></div>
          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><ScanFace size={16} className="text-gold" />Face ID</span><Toggle on={face} set={setFace} /></div>
          <button type="submit" className="btn-gold w-full rounded-full py-3 font-semibold">چوونەژوورەوە</button>
          {loginMessage && <p role="status" className="text-center text-xs text-gold-soft">{loginMessage}</p>}
        </form>
      </div>
      <p className="text-xs text-gold-soft mb-2">ئاسایش</p>
      <div className="glass rounded-lg p-3 flex items-center justify-between text-sm mb-4">
        <span className="flex items-center gap-2"><Shield size={15} className="text-gold" />پشتڕاستکردنەوەی دوو هەنگاو</span><Toggle on={twoFa} set={setTwoFa} />
      </div>
      <p className="text-xs text-gold-soft mb-2">ڕێکخستنی فرۆشگا</p>
      <div className="glass rounded-lg divide-y">
        {menu.map(([I, t]) => (
          <button type="button" key={t} aria-expanded={selectedSetting === t} onClick={() => setSelectedSetting((current) => current === t ? "" : t)} className="w-full flex items-center justify-between p-3 text-sm text-right">
            <span className="flex items-center gap-2"><I size={15} className="text-gold" />{t}</span><ChevronLeft size={14} className="text-muted-foreground" />
          </button>
        ))}
      </div>
      {selectedSetting === "زانیاری فرۆشگا" && (
        <label className="block glass rounded-lg p-3 mt-2 text-xs text-gold-soft">
          ناوی فرۆشگا
          <input aria-label="ناوی فرۆشگا" value={storeName} onChange={(event) => setStoreName(event.target.value)} className={`${field} mt-2`} />
        </label>
      )}
      {selectedSetting === "پارەدان و گەیاندن" && (
        <div className="glass rounded-lg p-3 mt-2 flex items-center justify-between text-xs">
          <span>گەیاندنی خۆڕایی</span><Toggle on={freeDelivery} set={setFreeDelivery} />
        </div>
      )}
      {selectedSetting === "ئاگادارکردنەوەکان" && (
        <div className="glass rounded-lg p-3 mt-2 flex items-center justify-between text-xs">
          <span>چالاککردنی ئاگادارکردنەوەکان</span><Toggle on={notifications} set={setNotifications} />
        </div>
      )}
      {selectedSetting === "زمان: کوردی" && (
        <label className="block glass rounded-lg p-3 mt-2 text-xs text-gold-soft">
          زمانی فرۆشگا
          <select aria-label="زمانی فرۆشگا" value={storeLanguage} onChange={(event) => setStoreLanguage(event.target.value)} className={`${field} mt-2`}>
            <option>کوردی</option><option>العربية</option><option>English</option>
          </select>
        </label>
      )}
    </>
  );
}

function Admin() {
  return (
    <main dir="rtl" className="min-h-screen relative overflow-hidden">
      <img src={bokeh} alt="" className="fixed inset-0 h-full w-full object-cover opacity-30" />
      <div className="relative px-6 py-14">
        <header className="text-center mb-12">
          <p className="text-xs text-gold">داشبۆردی بەڕێوەبردن</p>
          <h1 className="font-serif text-5xl md:text-6xl mt-3 text-gold-soft">سێنتۆرا ئەدمین</h1>
          <Link to="/" className="inline-block mt-4 text-sm text-gold underline">گەڕانەوە بۆ فرۆشگا</Link>
        </header>
        <div className="flex flex-wrap justify-center gap-10">
          <Phone label="زیادکردنی بەرهەم"><AddProduct /></Phone>
          <Phone label="نرخ و کۆگا"><Inventory /></Phone>
          <Phone label="پۆلەکان"><Categories /></Phone>
          <Phone label="چوونەژوورەوە و ڕێکخستن"><LoginSettings /></Phone>
        </div>
      </div>
    </main>
  );
}
