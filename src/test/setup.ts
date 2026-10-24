import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("@/lib/catalog.functions", () => ({
  getStorefrontCatalogFn: async () => ({
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
  }),
  signInAdminFn: vi.fn(async () => ({ ok: true })),
}));

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
