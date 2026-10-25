import { MongoClient, type Collection } from "mongodb";
import { normalizeCatalogImages } from "./catalog-images";
import { resolveMongoConfig } from "./mongo-config.server";
import type { CatalogCategory, CatalogProduct, StorefrontCatalog } from "./catalog-types";

const DEFAULT_CATEGORIES: CatalogCategory[] = ["Citrus", "Floral", "Woody", "Oriental", "Fresh", "Spicy"];

const DEFAULT_PRODUCTS: CatalogProduct[] = [
  {
    id: "oud",
    name: "Oud Wood",
    brand: "Maya Collection",
    image: "/images/oud-wood.jpg",
    subtitle: "Smoky woods · quiet confidence",
    categories: ["Woody", "Spicy"],
    sizes: [{ volume: 30, price: 45 }, { volume: 50, price: 88 }, { volume: 100, price: 145 }],
    rating: 4.9,
    reviews: 128,
    tag: "House favourite",
    top: "Cardamom · pink pepper",
    heart: "Oud · sandalwood",
    base: "Vetiver · tonka bean",
    longevity: "8–10 hours",
    projection: "Intimate, then assured",
    description: "A slow-burning composition of rare oud and polished woods. Warm, textured, and impossible to mistake for anyone else.",
    inStock: true,
  },
  {
    id: "rose",
    name: "Rosewater",
    brand: "Maya Collection",
    image: "/images/rosewater.jpg",
    subtitle: "Petal-soft · luminous",
    categories: ["Floral", "Fresh", "Citrus"],
    sizes: [{ volume: 30, price: 38 }, { volume: 50, price: 74 }, { volume: 100, price: 126 }],
    rating: 4.8,
    reviews: 94,
    tag: "A softer ritual",
    top: "Bergamot · pear",
    heart: "Damask rose · peony",
    base: "White musk · cedar",
    longevity: "6–8 hours",
    projection: "A graceful halo",
    description: "Freshly gathered rose petals meet a clean, airy musk. An understated floral with a little light in every layer.",
    inStock: true,
  },
  {
    id: "amber",
    name: "Amber Royal",
    brand: "Maya Collection",
    image: "/images/hero-bottle.jpg",
    subtitle: "Golden amber · velvet spice",
    categories: ["Oriental", "Spicy", "Citrus"],
    sizes: [{ volume: 30, price: 52 }, { volume: 50, price: 102 }, { volume: 100, price: 168 }],
    rating: 4.7,
    reviews: 76,
    tag: "The evening edit",
    top: "Saffron · mandarin",
    heart: "Amber · jasmine",
    base: "Vanilla · labdanum",
    longevity: "9–12 hours",
    projection: "Rich, beautifully lasting",
    description: "A luminous amber accord wrapped in saffron and soft vanilla. Made for the last light and the stories that follow.",
    inStock: true,
  },
];

let didWarnAboutPreviewCatalog = false;

type CatalogDocument = StorefrontCatalog & {
  _id: "singleton";
  updatedAt?: Date | string;
};

async function withCatalogCollection<T>(
  operation: (collection: Collection<CatalogDocument>) => Promise<T>,
): Promise<T> {
  const config = resolveMongoConfig();
  if (!config) {
    throw new Error("MONGODB_URI is required to read or save the Maya Collection catalog.");
  }

  const client = new MongoClient(config.uri, {
    maxPoolSize: 1,
    minPoolSize: 0,
    maxIdleTimeMS: 20_000,
    serverSelectionTimeoutMS: 5_000,
  });

  try {
    await client.connect();
    const collection = client.db(config.databaseName).collection<CatalogDocument>("store_state");
    return await operation(collection);
  } finally {
    await client.close();
  }
}

function getDefaultCatalog(): StorefrontCatalog {
  return normalizeCatalogImages({
    products: DEFAULT_PRODUCTS,
    categories: DEFAULT_CATEGORIES,
    whatsappNumber: "9647701575609",
  });
}

export async function getStorefrontCatalog(): Promise<StorefrontCatalog> {
  if (!resolveMongoConfig() && process.env["NODE_ENV"] === "development") {
    if (!didWarnAboutPreviewCatalog) {
      console.warn(
        "MONGODB_URI is not configured; showing the built-in sample catalog in this local preview. Catalog edits will not persist.",
      );
      didWarnAboutPreviewCatalog = true;
    }
    return getDefaultCatalog();
  }

  return withCatalogCollection(async (collection) => {
    const existing = await collection.findOne({ _id: "singleton" });
    if (!existing) return getDefaultCatalog();

    return normalizeCatalogImages({
      products: existing.products,
      categories: existing.categories,
      whatsappNumber: existing.whatsappNumber,
    });
  });
}

export async function saveStorefrontCatalog(catalog: StorefrontCatalog) {
  const { products, categories, whatsappNumber } = normalizeCatalogImages(catalog);
  await withCatalogCollection((collection) =>
    collection.updateOne(
      { _id: "singleton" },
      { $set: { products, categories, whatsappNumber, updatedAt: new Date() } },
      { upsert: true },
    ),
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
