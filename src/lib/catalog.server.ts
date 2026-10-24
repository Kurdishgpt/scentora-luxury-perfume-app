import { Pool } from "pg";
import oud from "@/assets/oud-wood.jpg";
import rose from "@/assets/rosewater.jpg";
import amber from "@/assets/hero-bottle.jpg";
import type { CatalogCategory, CatalogProduct, StorefrontCatalog } from "./catalog-types";

const DEFAULT_CATEGORIES: CatalogCategory[] = [
  "Citrus",
  "Floral",
  "Woody",
  "Oriental",
  "Fresh",
  "Spicy",
];

const DEFAULT_PRODUCTS: CatalogProduct[] = [
  {
    id: "oud",
    name: "Oud Wood",
    brand: "Maya Collection",
    image: oud,
    subtitle: "Smoky woods · quiet confidence",
    categories: ["Woody", "Spicy"],
    sizes: [
      { volume: 30, price: 45 },
      { volume: 50, price: 88 },
      { volume: 100, price: 145 },
    ],
    rating: 4.9,
    reviews: 128,
    tag: "House favourite",
    top: "Cardamom · pink pepper",
    heart: "Oud · sandalwood",
    base: "Vetiver · tonka bean",
    longevity: "8–10 hours",
    projection: "Intimate, then assured",
    description:
      "A slow-burning composition of rare oud and polished woods. Warm, textured, and impossible to mistake for anyone else.",
    inStock: true,
  },
  {
    id: "rose",
    name: "Rosewater",
    brand: "Maya Collection",
    image: rose,
    subtitle: "Petal-soft · luminous",
    categories: ["Floral", "Fresh", "Citrus"],
    sizes: [
      { volume: 30, price: 38 },
      { volume: 50, price: 74 },
      { volume: 100, price: 126 },
    ],
    rating: 4.8,
    reviews: 94,
    tag: "A softer ritual",
    top: "Bergamot · pear",
    heart: "Damask rose · peony",
    base: "White musk · cedar",
    longevity: "6–8 hours",
    projection: "A graceful halo",
    description:
      "Freshly gathered rose petals meet a clean, airy musk. An understated floral with a little light in every layer.",
    inStock: true,
  },
  {
    id: "amber",
    name: "Amber Royal",
    brand: "Maya Collection",
    image: amber,
    subtitle: "Golden amber · velvet spice",
    categories: ["Oriental", "Spicy", "Citrus"],
    sizes: [
      { volume: 30, price: 52 },
      { volume: 50, price: 102 },
      { volume: 100, price: 168 },
    ],
    rating: 4.7,
    reviews: 76,
    tag: "The evening edit",
    top: "Saffron · mandarin",
    heart: "Amber · jasmine",
    base: "Vanilla · labdanum",
    longevity: "9–12 hours",
    projection: "Rich, beautifully lasting",
    description:
      "A luminous amber accord wrapped in saffron and soft vanilla. Made for the last light and the stories that follow.",
    inStock: true,
  },
];

let pool: Pool | undefined;

function getPool() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error(
      "The database is not configured. Add the Replit database to this app before saving store data.",
    );
  }
  pool ??= new Pool({ connectionString, max: 5, idleTimeoutMillis: 30_000 });
  return pool;
}

export async function getStorefrontCatalog(): Promise<StorefrontCatalog> {
  const db = getPool();
  const result = await db.query<{
    products: CatalogProduct[];
    categories: CatalogCategory[];
    whatsapp_number: string;
  }>("SELECT products, categories, whatsapp_number FROM maya_store_state WHERE singleton = TRUE");

  if (result.rows[0]) {
    return {
      products: result.rows[0].products,
      categories: result.rows[0].categories,
      whatsappNumber: result.rows[0].whatsapp_number,
    };
  }

  const defaults = {
    products: DEFAULT_PRODUCTS,
    categories: DEFAULT_CATEGORIES,
    whatsappNumber: "9647701575609",
  };
  const inserted = await db.query<{
    products: CatalogProduct[];
    categories: CatalogCategory[];
    whatsapp_number: string;
  }>(
    `INSERT INTO maya_store_state (singleton, products, categories, whatsapp_number)
     VALUES (TRUE, $1::jsonb, $2::jsonb, $3)
     ON CONFLICT (singleton) DO UPDATE SET singleton = TRUE
     RETURNING products, categories, whatsapp_number`,
    [
      JSON.stringify(defaults.products),
      JSON.stringify(defaults.categories),
      defaults.whatsappNumber,
    ],
  );
  const row = inserted.rows[0];
  if (!row) throw new Error("Could not initialize store data.");
  return {
    products: row.products,
    categories: row.categories,
    whatsappNumber: row.whatsapp_number,
  };
}

export async function saveStorefrontCatalog(catalog: StorefrontCatalog) {
  const db = getPool();
  await db.query(
    `INSERT INTO maya_store_state (singleton, products, categories, whatsapp_number)
     VALUES (TRUE, $1::jsonb, $2::jsonb, $3)
     ON CONFLICT (singleton) DO UPDATE
     SET products = EXCLUDED.products,
         categories = EXCLUDED.categories,
         whatsapp_number = EXCLUDED.whatsapp_number,
         updated_at = NOW()`,
    [JSON.stringify(catalog.products), JSON.stringify(catalog.categories), catalog.whatsappNumber],
  );
}

export async function createProduct(product: CatalogProduct) {
  const catalog = await getStorefrontCatalog();
  catalog.products = [product, ...catalog.products];
  await saveStorefrontCatalog(catalog);
  return catalog;
}

export async function updateProduct(id: string, patch: Partial<CatalogProduct>) {
  const catalog = await getStorefrontCatalog();
  const index = catalog.products.findIndex((product) => product.id === id);
  if (index < 0) throw new Error("Product not found.");
  catalog.products[index] = { ...catalog.products[index]!, ...patch, id };
  await saveStorefrontCatalog(catalog);
  return catalog;
}

export async function removeProduct(id: string) {
  const catalog = await getStorefrontCatalog();
  catalog.products = catalog.products.filter((product) => product.id !== id);
  await saveStorefrontCatalog(catalog);
  return catalog;
}

export async function updateCategories(categories: CatalogCategory[]) {
  const catalog = await getStorefrontCatalog();
  catalog.categories = categories;
  catalog.products = catalog.products.map((product) => ({
    ...product,
    categories: product.categories.filter((category) => categories.includes(category)),
  }));
  await saveStorefrontCatalog(catalog);
  return catalog;
}

export async function updateWhatsappNumber(whatsappNumber: string) {
  const catalog = await getStorefrontCatalog();
  catalog.whatsappNumber = whatsappNumber;
  await saveStorefrontCatalog(catalog);
  return catalog;
}
