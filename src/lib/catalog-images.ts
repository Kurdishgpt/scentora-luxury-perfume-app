import type { StorefrontCatalog } from "./catalog-types";

const BUNDLED_IMAGE_PATHS = {
  "oud-wood": "/images/oud-wood.jpg",
  rosewater: "/images/rosewater.jpg",
  "hero-bottle": "/images/hero-bottle.jpg",
} as const;

export function normalizeCatalogImage(image: string) {
  if (image.startsWith("data:")) return image;

  const path = image.split(/[?#]/, 1)[0] ?? image;
  if (!path.startsWith("/src/assets/") && !path.startsWith("/assets/")) return image;

  const filename = path.slice(path.lastIndexOf("/") + 1);
  const matchingImage = Object.entries(BUNDLED_IMAGE_PATHS).find(([name]) =>
    new RegExp(`^${name}(?:-[a-z0-9_-]+)?\\.jpg$`, "i").test(filename),
  );
  return matchingImage?.[1] ?? image;
}

export function normalizeCatalogImages(catalog: StorefrontCatalog): StorefrontCatalog {
  return {
    ...catalog,
    products: catalog.products.map((product) => ({
      ...product,
      image: normalizeCatalogImage(product.image),
    })),
  };
}
