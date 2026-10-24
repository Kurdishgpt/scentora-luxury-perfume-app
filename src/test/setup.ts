import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("@/lib/catalog.functions", () => {
  const catalog = {
    categories: ["Citrus", "Floral", "Woody", "Oriental", "Fresh", "Spicy"],
    whatsappNumber: "9647701575609",
    products: [
      {
        id: "oud",
        name: "Oud Wood",
        brand: "Maya Collection",
        image: "/test-oud.jpg",
        subtitle: "Smoky woods · quiet confidence",
        categories: ["Woody", "Spicy"],
        sizes: [
          { volume: 30, price: 45 },
          { volume: 50, price: 88 },
        ],
        rating: 4.9,
        reviews: 128,
        tag: "House favourite",
        top: "Cardamom · pink pepper",
        heart: "Oud · sandalwood",
        base: "Vetiver · tonka bean",
        longevity: "8–10 hours",
        projection: "Intimate, then assured",
        description: "A slow-burning composition of rare oud and polished woods.",
        inStock: true,
      },
      {
        id: "rose",
        name: "Rosewater",
        brand: "Maya Collection",
        image: "/test-rose.jpg",
        subtitle: "Petal-soft · luminous",
        categories: ["Floral", "Fresh", "Citrus"],
        sizes: [
          { volume: 30, price: 38 },
          { volume: 50, price: 74 },
        ],
        rating: 4.8,
        reviews: 94,
        tag: "A softer ritual",
        top: "Bergamot · pear",
        heart: "Damask rose · peony",
        base: "White musk · cedar",
        longevity: "6–8 hours",
        projection: "A graceful halo",
        description: "Fresh rose petals meet a clean, airy musk.",
        inStock: true,
      },
      {
        id: "amber",
        name: "Amber Royal",
        brand: "Maya Collection",
        image: "/test-amber.jpg",
        subtitle: "Golden amber · velvet spice",
        categories: ["Oriental", "Spicy", "Citrus"],
        sizes: [
          { volume: 30, price: 52 },
          { volume: 50, price: 102 },
        ],
        rating: 4.7,
        reviews: 76,
        tag: "The evening edit",
        top: "Saffron · mandarin",
        heart: "Amber · jasmine",
        base: "Vanilla · labdanum",
        longevity: "9–12 hours",
        projection: "Rich, beautifully lasting",
        description: "A luminous amber accord wrapped in saffron and soft vanilla.",
        inStock: true,
      },
    ],
  };
  let nextProductId = 1;
  let isAdmin = true;

  return {
    getStorefrontCatalogFn: vi.fn(async () => catalog),
    getAdminSessionFn: vi.fn(async () => ({ isAdmin })),
    getAdminCatalogFn: vi.fn(async () => catalog),
    signInAdminFn: vi.fn(async () => {
      isAdmin = true;
      return { ok: true };
    }),
    signOutAdminFn: vi.fn(async () => {
      isAdmin = false;
      return { ok: true };
    }),
    createProductFn: vi.fn(async (input: { data: Record<string, unknown> }) => {
      const product = {
        ...input.data,
        id: `created-${nextProductId++}`,
        rating: 5,
        reviews: 0,
        tag: "New",
        longevity: "—",
        projection: "—",
      };
      catalog.products.unshift(product as (typeof catalog.products)[number]);
      return catalog;
    }),
    updateProductFn: vi.fn(async (input: { data: { id: string; product: unknown } }) => {
      const index = catalog.products.findIndex((product) => product.id === input.data.id);
      if (index >= 0) {
        catalog.products[index] = input.data.product as (typeof catalog.products)[number];
      }
      return catalog;
    }),
    deleteProductFn: vi.fn(async (input: { data: { id: string } }) => {
      catalog.products = catalog.products.filter((product) => product.id !== input.data.id);
      return catalog;
    }),
    updateCategoriesFn: vi.fn(async (input: { data: { categories: string[] } }) => {
      catalog.categories = input.data.categories;
      catalog.products = catalog.products.map((product) => ({
        ...product,
        categories: product.categories.filter((category) => catalog.categories.includes(category)),
      }));
      return catalog;
    }),
    updateWhatsappFn: vi.fn(async (input: { data: { whatsappNumber: string } }) => {
      catalog.whatsappNumber = input.data.whatsappNumber;
      return catalog;
    }),
  };
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
