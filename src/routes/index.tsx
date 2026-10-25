import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, Clock3, Citrus, Droplets, Flame,
  Flower2, Heart, Info, Leaf, Minus, Plus, Search, ShoppingBag, Sparkles, Star,
  Settings2, Trash2, TreePine, Wind, X,
} from "lucide-react";
import hero from "@/assets/hero-bottle.jpg";
import bokeh from "@/assets/bokeh-bg.jpg";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { getStorefrontCatalogFn } from "@/lib/catalog.functions";
import type { CatalogProduct } from "@/lib/catalog-types";

type Language = "en" | "ku" | "ar";
type Size = number;
type ProductId = string;
type Product = CatalogProduct;
type CartLine = { id: ProductId; size: Size; quantity: number };

const CATEGORY_META: { name: string; Icon: typeof Citrus; ku: string; ar: string }[] = [
  { name: "Citrus", Icon: Citrus, ku: "ترش", ar: "حمضيات" },
  { name: "Floral", Icon: Flower2, ku: "گوڵاوی", ar: "زهري" },
  { name: "Woody", Icon: TreePine, ku: "داری", ar: "خشبي" },
  { name: "Oriental", Icon: Sparkles, ku: "ڕۆژهەڵاتی", ar: "شرقي" },
  { name: "Fresh", Icon: Droplets, ku: "تازە", ar: "منعش" },
  { name: "Spicy", Icon: Flame, ku: "بەهاراتی", ar: "متبّل" },
];

const COPY = {
  en: {
    navCollection: "The collection", navStory: "Our philosophy", navNotes: "The notes",
    search: "Search fragrances", wishlist: "Wishlist", cart: "Shopping bag",
    admin: "Admin settings", outOfStock: "Out of stock",
    kicker: "A fragrance, remembered", headlineA: "Discover Your", headlineB: "Signature Scent",
    description: "Rare compositions. A little ceremony. Find the fragrance that feels like it has always been yours.",
    explore: "Explore Scents", heroNote: "Curated in Kurdistan", allScents: "All scents",
    collectionEyebrow: "A considered collection", collectionTitle: "Find your note.",
    collectionDesc: "Follow a feeling, not a trend. Each scent is chosen to become part of your own story.",
    fragrances: "fragrances", favourites: "Saved scents only", clearFilters: "Clear filters",
    add: "Add to bag", added: "Added to your bag", details: "Discover fragrance",
    cardOrder: "Order via WhatsApp",
    volume: "Volume", rating: "Customer rating", notes: "The composition",
    top: "Top", heart: "Heart", base: "Base", longevity: "Longevity", projection: "Projection",
    detailAdd: "Add to bag", browse: "Continue discovering", bagTitle: "Your bag",
    bagEmpty: "A beautiful beginning.", bagEmptyText: "Your bag is waiting for something unforgettable.",
    subtotal: "Subtotal", delivery: "Delivery", total: "Total", checkout: "Order via WhatsApp",
    name: "Your name", address: "Delivery address", remove: "Remove item", increase: "Increase quantity",
    decrease: "Decrease quantity", close: "Close", storyEyebrow: "The Maya point of view",
    storyTitleA: "Scent is a", storyTitleB: "way back to you.",
    storyText: "We believe the best fragrance is not the loudest thing in a room. It is the detail someone remembers after you have left. Maya Collection brings rare, characterful scents closer to home, chosen slowly and worn your own way.",
    storySign: "With care, Maya", notesEyebrow: "A scent in three acts", notesTitle: "Made to unfold.",
    notesDesc: "A fragrance is never a single note. It moves with you, changing gently as the hours pass.",
    noteTopTitle: "The first impression", noteTopText: "Bright, fleeting notes introduce the fragrance and invite you closer.",
    noteHeartTitle: "The true character", noteHeartText: "The heart opens slowly, revealing the personality at the centre of the scent.",
    noteBaseTitle: "What remains", noteBaseText: "Warm, lasting accords settle into the skin and leave a beautiful trace.",
    closingEyebrow: "Your next memory", closingTitle: "Let scent find you.", closingCta: "Find your fragrance",
    footerLine: "Fragrance, chosen to feel like you.", copyright: "Maya Collection · Erbil, Iraq",
    waItem: "Hello Maya Collection, I would like to order:",
    freeDelivery: "Complimentary delivery on orders over $150",
  },
  ku: {
    navCollection: "کۆمەڵەکە", navStory: "دیدگای ئێمە", navNotes: "نۆتەکان",
    search: "گەڕان بەدوای بۆن", wishlist: "دڵخوازەکان", cart: "سەبەتە",
    admin: "ڕێکخستنی ئەدمین", outOfStock: "لە کۆگا نەماوە",
    kicker: "بۆنێک کە لەبیر دەکرێت", headlineA: "کۆڵینەوە لە بۆنی", headlineB: "تایبەتی خۆت بکە",
    description: "تێکەڵەی دەگمەن. ڕێوڕەسمێکی جوان. ئەو بۆنە بدۆزەرەوە کە هەمیشە هی خۆت بووە.",
    explore: "دۆزینەوەی بۆنەکان", heroNote: "بە وردی هەڵبژێردراوە لە کوردستان",
    allScents: "هەموو بۆنەکان", collectionEyebrow: "کۆمەڵەیەکی هەڵبژێردراو",
    collectionTitle: "نۆتەکەت بدۆزەرەوە.", collectionDesc: "بەدوای هەستێکدا بگەڕێ، نەک ترێند. هەر بۆنێک دەکرێت ببێتە بەشێک لە چیرۆکی خۆت.",
    fragrances: "بۆن", favourites: "تەنها دڵخوازەکان", clearFilters: "پاککردنەوەی فلتەر",
    add: "زیادکردن بۆ سەبەتە", added: "زیادکرا بۆ سەبەتە", details: "ناسینی بۆن",
    volume: "قەبارە", rating: "هەڵسەنگاندنی کڕیار", notes: "پێکهاتە",
    top: "سەرەتا", heart: "ناوەڕاست", base: "بنەڕەت", longevity: "مانەوە", projection: "بڵاوبوونەوە",
    detailAdd: "زیادکردن بۆ سەبەتە", browse: "بەردەوام بە لە دۆزینەوە", bagTitle: "سەبەتەکەت",
    bagEmpty: "سەرەتایەکی جوان.", bagEmptyText: "سەبەتەکەت چاوەڕێی شتێکی لەبیرنەکراوە.",
    subtotal: "کۆی بەرهەم", delivery: "گەیاندن", total: "کۆی گشتی", checkout: "پەیوەندی لە ڕێگەی واتسئاپ",
    cardOrder: "پەیوەندی لە ڕێگەی واتسئاپ",
    name: "ناوت", address: "ناونیشانی گەیاندن", remove: "لابردنی بەرهەم", increase: "زیادکردنی ژمارە",
    decrease: "کەمکردنەوەی ژمارە", close: "داخستن", storyEyebrow: "دیدگای مایا",
    storyTitleA: "بۆن، ڕێگایەکە", storyTitleB: "بۆ گەڕانەوە بۆ خۆت.",
    storyText: "باوەڕمان وایە باشترین بۆن ئەوە نییە کە لە ژوورێکدا زۆرترین دەنگی هەبێت؛ ئەوەیە کە دوای ڕۆیشتنت لەبیر دەمێنێت. Maya Collection بۆنە دەگمەن و پڕ لە کەسایەتییەکان نزیکتر دەکاتەوە.",
    storySign: "بە خۆشەویستی، مایا", notesEyebrow: "بۆنێک لە سێ بەشدا", notesTitle: "بۆ گەشەکردن دروستکراوە.",
    notesDesc: "بۆن تەنها یەک نۆت نییە. لەگەڵ تۆ دەگۆڕێت و بە تێپەڕبوونی کات بە نەرمی دەکرێتەوە.",
    noteTopTitle: "یەکەم هەست", noteTopText: "نۆتە درەوشاوە و کاتییەکان بۆنەکە دەناسێنن و بانگهێشتت دەکەن.",
    noteHeartTitle: "کەسایەتیی ڕاستەقینە", noteHeartText: "ناوەڕاستی بۆن بە هێواشی دەکرێتەوە و سروشتی ناوەندی دەردەخات.",
    noteBaseTitle: "ئەوەی دەمێنێتەوە", noteBaseText: "نۆتە گەرم و بەردەوامەکان لەسەر پێست جێگیر دەبن و شوێنێکی جوان دەمێنن.",
    closingEyebrow: "بیرەوەریی داهاتووت", closingTitle: "با بۆنەکە دەت بدۆزێتەوە.",
    closingCta: "بۆنی خۆت بدۆزەرەوە", footerLine: "بۆن، بە شێوەیەک هەڵبژێردراوە کە لەگەڵ تۆ بگونجێت.",
    copyright: "Maya Collection · هەولێر، عێراق", waItem: "سڵاو Maya Collection، دەمەوێت ئەم بۆنانە داوا بکەم:",
    freeDelivery: "گەیاندنی خۆڕایی بۆ داواکاری زیاتر لە $150",
  },
  ar: {
    navCollection: "المجموعة", navStory: "رؤيتنا", navNotes: "النفحات",
    search: "ابحث عن عطر", wishlist: "المفضلة", cart: "حقيبة التسوق",
    admin: "إعدادات الإدارة", outOfStock: "غير متوفر",
    kicker: "عطر يبقى في الذاكرة", headlineA: "اكتشف عطرك", headlineB: "المميّز",
    description: "تركيبات نادرة، ولمسة من الطقوس الجميلة. اعثر على العطر الذي تشعر أنه كان لك دائماً.",
    explore: "اكتشف العطور", heroNote: "مختارة بعناية في كردستان", allScents: "كل العطور",
    collectionEyebrow: "مجموعة مختارة بعناية", collectionTitle: "اعثر على نفحتك.",
    collectionDesc: "اتبع إحساسك لا صيحات الموضة. كل عطر مختار ليصبح جزءاً من قصتك.",
    fragrances: "عطور", favourites: "المفضلة فقط", clearFilters: "مسح الفلاتر",
    add: "أضف إلى الحقيبة", added: "أضيف إلى حقيبتك", details: "اكتشف العطر",
    cardOrder: "اطلب عبر واتساب",
    volume: "الحجم", rating: "تقييم العملاء", notes: "التركيبة",
    top: "المقدمة", heart: "القلب", base: "القاعدة", longevity: "الثبات", projection: "الانتشار",
    detailAdd: "أضف إلى الحقيبة", browse: "واصل الاكتشاف", bagTitle: "حقيبتك",
    bagEmpty: "بداية جميلة.", bagEmptyText: "حقيبتك تنتظر شيئاً لا يُنسى.",
    subtotal: "المجموع الفرعي", delivery: "التوصيل", total: "الإجمالي", checkout: "اطلب عبر واتساب",
    name: "اسمك", address: "عنوان التوصيل", remove: "إزالة المنتج", increase: "زيادة الكمية",
    decrease: "تقليل الكمية", close: "إغلاق", storyEyebrow: "رؤية مايا",
    storyTitleA: "العطر طريق", storyTitleB: "للعودة إلى ذاتك.",
    storyText: "نؤمن أن أفضل عطر ليس الأعلى صوتاً في الغرفة، بل هو التفصيل الذي يتذكره الآخرون بعد رحيلك. تقرّب Maya Collection إليك العطور النادرة ذات الشخصية المميزة، المختارة بتأنٍ والمصممة لتُرتدى بطريقتك.",
    storySign: "بكل عناية، مايا", notesEyebrow: "عطر في ثلاثة فصول", notesTitle: "يتكشف مع الوقت.",
    notesDesc: "العطر ليس نفحة واحدة. إنه يتغير معك وينفتح برفق مع مرور الساعات.",
    noteTopTitle: "الانطباع الأول", noteTopText: "تقدم النفحات المشرقة والعابرة العطر وتدعوك للاقتراب.",
    noteHeartTitle: "الشخصية الحقيقية", noteHeartText: "ينفتح القلب بهدوء ليكشف عن شخصية العطر في جوهره.",
    noteBaseTitle: "ما يبقى", noteBaseText: "تستقر النفحات الدافئة والثابتة على البشرة وتترك أثراً جميلاً.",
    closingEyebrow: "ذكراك القادمة", closingTitle: "دع العطر يجدك.", closingCta: "اعثر على عطرك",
    footerLine: "عطر مختار ليشبهك.", copyright: "Maya Collection · أربيل، العراق",
    waItem: "مرحباً Maya Collection، أود طلب:",
    freeDelivery: "توصيل مجاني للطلبات التي تتجاوز $150",
  },
} as const;

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function getPrice(product: Product, volume: number) {
  return product.sizes.find((size) => size.volume === volume)?.price ?? product.sizes[0]?.price ?? 0;
}

function whatsappHref(number: string, message = "") {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function LogoMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 36 42" fill="none" aria-hidden="true">
      <path d="M18 2.5 31.5 10v15.5L18 40 4.5 25.5V10L18 2.5Z" stroke="currentColor" strokeWidth="1.15" />
      <path d="M12 28V14l6 8 6-8v14M18 3v8" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="11" r="1.6" fill="currentColor" />
    </svg>
  );
}

function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="rating-line" aria-label={`${value} out of 5 stars, ${reviews} reviews`}>
      <span className="rating-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={11} fill={star < Math.round(value) ? "currentColor" : "none"} />)}</span>
      <span>{value.toFixed(1)}</span><span className="rating-count">({reviews})</span>
    </div>
  );
}

function Index() {
  const { products, categories, whatsappNumber } = Route.useLoaderData();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("ku");
  const [category, setCategory] = useState<string | "All">("All");
  const [query, setQuery] = useState("");
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [favourites, setFavourites] = useState<ProductId[]>([]);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [sizes, setSizes] = useState<Record<ProductId, Size>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [detailId, setDetailId] = useState<ProductId | null>(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [toast, setToast] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const t = COPY[language];
  const isRtl = language !== "en";
  const detail = detailId ? products.find((product) => product.id === detailId) ?? null : null;
  const selectedVolume = (product: Product) => {
    const current = sizes[product.id];
    if (current && product.sizes.some((size) => size.volume === current)) return current;
    return product.sizes.find((size) => size.volume === 50)?.volume ?? product.sizes[0]?.volume ?? 50;
  };
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All" || product.categories.includes(category);
    const matchesSearch = `${product.name} ${product.subtitle} ${product.categories.join(" ")} ${product.top} ${product.heart} ${product.base}`
      .toLowerCase().includes(query.trim().toLowerCase());
    const matchesFavourite = !favouritesOnly || favourites.includes(product.id);
    return matchesCategory && matchesSearch && matchesFavourite;
  }), [products, category, query, favouritesOnly, favourites]);

  const subtotal = lines.reduce((total, line) => {
    const product = products.find((item) => item.id === line.id);
    return total + (product ? getPrice(product, line.size) * line.quantity : 0);
  }, 0);
  const delivery = lines.length && subtotal < 150 ? 8 : 0;
  const total = subtotal + delivery;

  useEffect(() => {
    if (!cartOpen && !detail) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setDetailId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cartOpen, detail]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1900);
  };

  const addToCart = (id: ProductId, size: Size) => {
    const product = products.find((item) => item.id === id);
    if (!product || !product.inStock) return;
    setLines((current) => {
      const existing = current.find((line) => line.id === id && line.size === size);
      return existing
        ? current.map((line) => line.id === id && line.size === size ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { id, size, quantity: 1 }];
    });
    showToast(`${product.name} · ${t.added}`);
  };

  const updateQuantity = (index: number, amount: number) => setLines((current) => current.map((line, i) => i === index
    ? { ...line, quantity: Math.max(1, line.quantity + amount) } : line));
  const removeLine = (index: number) => setLines((current) => current.filter((_, i) => i !== index));
  const toggleFavourite = (id: ProductId) => setFavourites((current) => current.includes(id)
    ? current.filter((item) => item !== id) : [...current, id]);

  const makeOrderMessage = (selected: CartLine[], withCustomer = false) => {
    const orderLines = selected.flatMap((line) => {
      const product = products.find((item) => item.id === line.id);
      if (!product) return [];
      return [`${product.name} — ${line.size} ml × ${line.quantity} = ${formatMoney(getPrice(product, line.size) * line.quantity)}`];
    });
    const orderSubtotal = selected.reduce((sum, line) => {
      const product = products.find((item) => item.id === line.id);
      return sum + (product ? getPrice(product, line.size) * line.quantity : 0);
    }, 0);
    const orderDelivery = orderSubtotal >= 150 ? 0 : 8;
    return [
      t.waItem, "", ...orderLines, "",
      `${t.subtotal}: ${formatMoney(orderSubtotal)}`,
      `${t.delivery}: ${orderDelivery ? formatMoney(orderDelivery) : "Complimentary"}`,
      `${t.total}: ${formatMoney(orderSubtotal + orderDelivery)}`,
      ...(withCustomer && customerName ? ["", `${t.name}: ${customerName}`] : []),
      ...(withCustomer && customerAddress ? [`${t.address}: ${customerAddress}`] : []),
    ].join("\n");
  };

  return (
    <main className={`site-shell${isRtl ? " arabic" : ""}`} dir={isRtl ? "rtl" : "ltr"} lang={language === "ku" ? "ckb" : language}>
      <header className="topbar">
        <a className="brand-lockup" href="#home" aria-label="Maya Collection home">
          <LogoMark /><span className="serif brand-name">Maya Collection</span>
        </a>
          <nav className="top-links" aria-label={language === "ku" ? "بەستەرە سەرەکییەکان" : language === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          <a href="#collection">{t.navCollection}</a>
          <a href="#philosophy">{t.navStory}</a>
          <a href="#notes">{t.navNotes}</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" aria-label={t.search} title={t.search} onClick={() => {
            document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" });
            window.setTimeout(() => searchRef.current?.focus(), 350);
          }}><Search size={18} strokeWidth={1.5} /></button>
          <button className={`icon-button${favouritesOnly ? " gold-text" : ""}`} type="button" aria-label={t.wishlist}
            aria-pressed={favouritesOnly} title={t.wishlist} onClick={() => {
              setFavouritesOnly((current) => !current);
              document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" });
            }}><Heart size={18} strokeWidth={1.5} fill={favouritesOnly ? "currentColor" : "none"} /></button>
          <button className="icon-button" type="button" aria-label={`${t.cart}, ${itemCount} items`} title={t.cart} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} strokeWidth={1.5} />{itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </button>
          <button className="icon-button" type="button" aria-label={t.admin} title={t.admin} onClick={() => setAdminLoginOpen(true)}>
            <Settings2 size={18} strokeWidth={1.5} />
          </button>
          <button className="lang-toggle" type="button" onClick={() => setLanguage(language === "ku" ? "ar" : language === "ar" ? "en" : "ku")}
            aria-label={language === "ku" ? "گۆڕینی زمان بۆ عەرەبی" : language === "ar" ? "التبديل إلى الإنجليزية" : "Switch language to Kurdish"}
            title="کوردی · العربية · English">{language === "ku" ? "العربية · EN" : language === "ar" ? "EN · کوردی" : "کوردی"}</button>
        </div>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <img className="hero-art" src={hero} alt="A golden perfume bottle glowing in forest-green light" />
        <div className="hero-copy">
          <div className="hero-kicker eyebrow reveal">{t.kicker}</div>
          <h1 id="hero-title" className="serif reveal delay-1">{language === "en" ? <>Discover Your<br /><em>Signature Scent</em></> : <>{t.headlineA}<br /><em>{t.headlineB}</em></>}</h1>
          <p className="hero-description reveal delay-2">{t.description}</p>
          <div className="hero-cta-row reveal delay-3">
            <a className="gold-button hero-cta" href="#collection">{t.explore}<ArrowRight size={17} strokeWidth={1.6} /></a>
            <span className="hero-note"><Sparkles size={14} strokeWidth={1.4} />{t.heroNote}</span>
          </div>
        </div>
        <div className="hero-stamp serif" aria-hidden="true">THE ART OF<br />BEING<br />REMEMBERED</div>
        <div className="hero-index">01 <span /> MAYA COLLECTION</div>
      </section>

      <section className="section" id="collection">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t.collectionEyebrow}</span>
            <h2 className="serif">{t.collectionTitle}</h2>
          </div>
          <p>{t.collectionDesc}</p>
        </div>
        <div className="category-strip" role="group" aria-label={language === "ku" ? "فلتەرکردنی بۆنەکان" : language === "ar" ? "تصفية العطور حسب العائلة" : "Filter fragrances by family"}>
          <button className={`category-button${category === "All" ? " active" : ""}`} type="button" onClick={() => setCategory("All")}>
            <Leaf size={20} strokeWidth={1.3} /><span>{t.allScents}</span>
          </button>
          {categories.map((name) => {
            const meta = CATEGORY_META.find((item) => item.name === name);
            const Icon = meta?.Icon ?? Sparkles;
            return (
            <button className={`category-button${category === name ? " active" : ""}`} type="button" key={name}
              aria-pressed={category === name} onClick={() => setCategory(category === name ? "All" : name)}>
              <Icon size={20} strokeWidth={1.3} /><span>{language === "ku" && meta ? meta.ku : language === "ar" && meta ? meta.ar : name}</span>
            </button>
            );
          })}
        </div>

        <div className="section collection-section">
          <div className="collection-tools">
            <span className="results-copy">{favouritesOnly ? t.favourites : `${visibleProducts.length} ${t.fragrances}`}</span>
            <label className="search-field">
              <Search size={16} strokeWidth={1.5} />
              <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search} aria-label={t.search} />
            </label>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product) => {
              const size = selectedVolume(product);
              const cardOrder = makeOrderMessage([{ id: product.id, size, quantity: 1 }]);
              const isFavourite = favourites.includes(product.id);
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <button className="product-detail-trigger" type="button" aria-label={`${t.details}: ${product.name}`} onClick={() => setDetailId(product.id)}>
                      <img className="product-image" src={product.image} alt={`${product.name} eau de parfum bottle`} />
                    </button>
                    <span className="product-tag">{product.tag}</span>
                    <button className={`wish-button${isFavourite ? " liked" : ""}`} type="button"
                      aria-label={`${isFavourite ? "Remove" : "Add"} ${product.name} ${t.wishlist.toLowerCase()}`}
                      aria-pressed={isFavourite} onClick={() => toggleFavourite(product.id)}>
                      <Heart size={17} strokeWidth={1.6} fill={isFavourite ? "currentColor" : "none"} />
                    </button>
                    <div className="image-caption"><span>EAU DE PARFUM</span><span>NO. {String(products.indexOf(product) + 1).padStart(2, "0")}</span></div>
                  </div>
                  <div className="product-info">
                    <div className="product-title-row">
                      <h3 className="serif product-title">
                        <button
                          className="product-title-button"
                          type="button"
                          aria-label={product.name}
                          onClick={() => setDetailId(product.id)}
                        >
                          {product.name}
                        </button>
                      </h3>
                      <span className="product-price">{formatMoney(getPrice(product, size))}</span>
                    </div>
                    <p className="product-subtitle">{product.subtitle}</p>
                    <Rating value={product.rating} reviews={product.reviews} />
                    <div className="product-foot">
                      <label>
                        <span className="sr-only">{t.volume}</span>
                        <select className="volume-select" value={size} onChange={(event) => setSizes((current) => ({ ...current, [product.id]: Number(event.target.value) as Size }))} aria-label={`${product.name} ${t.volume}`}>
                          {product.sizes.map((option) => <option key={option.volume} value={option.volume}>{option.volume} ml</option>)}
                        </select>
                      </label>
                      <div className="card-actions">
                        {product.inStock ? <a className="wa-link" href={whatsappHref(whatsappNumber, cardOrder)} target="_blank" rel="noreferrer"
                          aria-label={`Order ${product.name}, ${size} ml, directly via WhatsApp`}>
                          {t.cardOrder} <ArrowUpRight size={13} aria-hidden="true" />
                        </a> : <span className="wa-link" aria-label={t.outOfStock}>{t.outOfStock}</span>}
                        <button className="add-mini" type="button" disabled={!product.inStock} onClick={() => addToCart(product.id, size)} aria-label={`${t.add}: ${product.name}, ${size} ml`}>
                          <Plus size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            {visibleProducts.length === 0 && <div className="empty-products">
              <Sparkles size={24} /><p className="serif" style={{ fontSize: "1.5rem", margin: "12px 0 8px" }}>{language === "ku" ? "ئەم بۆنە بەردەست نییە" : language === "ar" ? "لا توجد عطور هنا حالياً." : "Nothing here, just yet."}</p>
              <p style={{ margin: 0 }}>{language === "en" ? "Try another search or clear your filters to see the full collection." : language === "ku" ? "وشەیەکی تر تاقی بکەرەوە یان فلتەرەکان پاک بکەرەوە." : "جرّب البحث بكلمة أخرى أو امسح الفلاتر لرؤية المجموعة كاملة."}</p>
              <button className="outline-button" type="button" onClick={() => { setCategory("All"); setQuery(""); setFavouritesOnly(false); }}
                style={{ marginTop: 18, padding: "10px 14px", background: "transparent", color: "var(--gold-soft)" }}>{t.clearFilters}</button>
            </div>}
          </div>
        </div>
      </section>

      <section className="story-section" id="philosophy">
        <div className="story-visual"><img className="story-image" src={bokeh} alt="Soft candlelit bokeh in deep emerald and antique gold" /></div>
        <div className="story-copy">
          <span className="eyebrow">{t.storyEyebrow}</span>
          <h2 className="serif">{t.storyTitleA}<br /><em className="gold-text">{t.storyTitleB}</em></h2>
          <p>{t.storyText}</p>
          <div className="story-signature"><span />{t.storySign}</div>
        </div>
      </section>

      <section className="section notes-section" id="notes">
        <div className="notes-intro">
          <span className="eyebrow">{t.notesEyebrow}</span>
          <h2 className="serif" style={{ margin: "10px 0 14px", fontSize: "clamp(2.8rem,5vw,4.8rem)", lineHeight: ".95", fontWeight: 400 }}>{t.notesTitle}</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: ".84rem", lineHeight: 1.8, margin: 0 }}>{t.notesDesc}</p>
        </div>
        <div className="note-columns">
          <article className="note-column">
            <span className="note-number">01</span><h3>{t.noteTopTitle}</h3><p>{t.noteTopText}</p>
            <div className="note-chips"><span>Bergamot</span><span>Cardamom</span><span>Pear</span></div>
          </article>
          <article className="note-column">
            <span className="note-number">02</span><h3>{t.noteHeartTitle}</h3><p>{t.noteHeartText}</p>
            <div className="note-chips"><span>Damask rose</span><span>Oud</span><span>Jasmine</span></div>
          </article>
          <article className="note-column">
            <span className="note-number">03</span><h3>{t.noteBaseTitle}</h3><p>{t.noteBaseText}</p>
            <div className="note-chips"><span>Amber</span><span>Vetiver</span><span>White musk</span></div>
          </article>
        </div>
      </section>

      <section className="closing">
        <span className="eyebrow">{t.closingEyebrow}</span>
        <h2 className="serif">{t.closingTitle}</h2>
        <a className="outline-button" href="#collection">{t.closingCta}<ArrowDownRight size={16} /></a>
      </section>
      <footer className="footer">
        <a className="brand-lockup" href="#home"><LogoMark /><span className="serif brand-name">Maya Collection</span></a>
        <span>{t.footerLine}</span>
        <div className="footer-links"><a href="#collection">{t.navCollection}</a><a href="#philosophy">{t.navStory}</a><a href={whatsappHref(whatsappNumber)} target="_blank" rel="noreferrer">WhatsApp</a></div>
        <span>{t.copyright}</span>
      </footer>

      {cartOpen && <div className="overlay-open" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
        <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-heading">
          <div className="panel-heading"><h2 id="cart-heading">{t.bagTitle}<span style={{ color: "var(--gold)", fontSize: "1rem", marginInlineStart: 10 }}>({itemCount})</span></h2>
            <button className="close-button" type="button" aria-label={t.close} onClick={() => setCartOpen(false)}><X size={19} /></button></div>
          {lines.length === 0 ? <div className="empty-cart">
            <ShoppingBag size={24} strokeWidth={1.3} /><p>{t.bagEmpty}</p><span>{t.bagEmptyText}</span>
            <br /><button className="outline-button" type="button" onClick={() => { setCartOpen(false); document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ marginTop: 20, padding: "11px 14px", background: "transparent", color: "var(--gold-soft)" }}>{t.browse}</button>
          </div> : <>
            <div className="cart-items">
              {lines.map((line, index) => {
                const product = products.find((item) => item.id === line.id);
                if (!product) return null;
                return <div className="cart-item" key={`${line.id}-${line.size}`}>
                  <img src={product.image} alt={`${product.name} perfume bottle`} />
                  <div><h3>{product.name}</h3><p>{formatMoney(getPrice(product, line.size))}</p><p className="cart-item-meta">{line.size} ml · {product.categories.join(" · ")}</p>
                    <div className="quantity-control">
                      <button type="button" aria-label={t.increase} onClick={() => updateQuantity(index, 1)}><Plus size={12} /></button>
                      <span>{line.quantity}</span>
                      <button type="button" aria-label={t.decrease} onClick={() => updateQuantity(index, -1)}><Minus size={12} /></button>
                    </div>
                  </div>
                  <button className="remove-item" type="button" aria-label={`${t.remove}: ${product.name}`} onClick={() => removeLine(index)}><Trash2 size={16} /></button>
                </div>;
              })}
            </div>
            <div className="cart-fields">
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder={t.name} aria-label={t.name} />
              <input value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} placeholder={t.address} aria-label={t.address} />
            </div>
            <p style={{ color: "var(--muted-foreground)", fontSize: ".69rem", margin: "0 0 17px" }}>{t.freeDelivery}</p>
            <div className="cart-total"><span>{t.subtotal}</span><span>{formatMoney(subtotal)}</span></div>
            <div className="cart-total"><span>{t.delivery}</span><span>{delivery ? formatMoney(delivery) : "Complimentary"}</span></div>
            <div className="cart-total final"><span>{t.total}</span><strong>{formatMoney(total)}</strong></div>
            <a className="gold-button checkout-link" href={whatsappHref(whatsappNumber, makeOrderMessage(lines, true))} target="_blank" rel="noreferrer">
              {t.checkout}<ArrowRight size={17} />
            </a>
          </>}
        </aside>
      </div>}

      {detail && <div className="overlay-open detail-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailId(null); }}>
        <section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-heading">
          <img className="detail-image" src={detail.image} alt={`${detail.name} perfume bottle, presented in rich green and gold light`} />
          <div className="detail-content">
            <button className="close-button" type="button" aria-label={t.close} onClick={() => setDetailId(null)}><X size={19} /></button>
            <span className="eyebrow">{detail.tag} · {detail.categories.join(" · ")}</span>
            <h2 id="detail-heading">{detail.name}</h2>
            <Rating value={detail.rating} reviews={detail.reviews} />
            <p className="detail-description">{detail.description}</p>
            <div className="product-title-row"><span className="eyebrow">{t.volume}</span><span className="detail-price">{formatMoney(getPrice(detail, selectedVolume(detail)))}</span></div>
            <label><span className="sr-only">{detail.name} {t.volume}</span>
              <select className="volume-select" style={{ marginTop: 10, border: "1px solid var(--border)", padding: "10px 13px", minWidth: 135, background: "#19372a" }}
                value={selectedVolume(detail)} onChange={(event) => setSizes((current) => ({ ...current, [detail.id]: Number(event.target.value) }))}>
                {detail.sizes.map((size) => <option key={size.volume} value={size.volume}>{size.volume} ml · {formatMoney(size.price)}</option>)}
              </select>
            </label>
            <div className="detail-notes" aria-label={t.notes}>
              <div className="detail-note-row"><strong title="The first notes you notice as the fragrance opens">{t.top}</strong><span>{detail.top}</span><Info size={13} color="var(--gold)" aria-hidden="true" /></div>
              <div className="detail-note-row"><strong title="The central character that develops on your skin">{t.heart}</strong><span>{detail.heart}</span><Info size={13} color="var(--gold)" aria-hidden="true" /></div>
              <div className="detail-note-row"><strong title="The warm notes that linger longest">{t.base}</strong><span>{detail.base}</span><Info size={13} color="var(--gold)" aria-hidden="true" /></div>
            </div>
            <div className="performance">
              <span title="Typical wear time; varies by skin and environment"><Clock3 size={13} style={{ verticalAlign: "middle", marginInlineEnd: 5 }} />{t.longevity}: {detail.longevity}</span>
              <span title="How far the scent gently carries from the skin"><Wind size={13} style={{ verticalAlign: "middle", marginInlineEnd: 5 }} />{t.projection}: {detail.projection}</span>
            </div>
            <button className="gold-button detail-add" type="button" disabled={!detail.inStock} onClick={() => { addToCart(detail.id, selectedVolume(detail)); setDetailId(null); }}>
              <ShoppingBag size={16} />{detail.inStock ? t.detailAdd : t.outOfStock}
            </button>
          </div>
        </section>
      </div>}

      {toast && <div className="toast" role="status"><Check size={15} style={{ verticalAlign: "middle", marginInlineEnd: 7 }} />{toast}</div>}
      <AdminLoginDialog
        open={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => {
          setAdminLoginOpen(false);
          void navigate({ to: "/admin" });
        }}
        language={language}
      />
    </main>
  );
}

export const Route = createFileRoute("/")({
  loader: () => getStorefrontCatalogFn(),
  head: () => ({
    meta: [
      { title: "Maya Collection — Discover Your Signature Scent" },
      { name: "description", content: "Discover rare, characterful fragrances at Maya Collection. Find the scent that feels like it has always been yours." },
      { property: "og:title", content: "Maya Collection — Discover Your Signature Scent" },
      { property: "og:description", content: "Rare compositions. A little ceremony. Find your signature scent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});
