export type CatalogCategory = string;

export type ProductSize = {
  volume: number;
  price: number;
};

export type CatalogProduct = {
  id: string;
  name: string;
  brand: string;
  image: string;
  subtitle: string;
  categories: CatalogCategory[];
  sizes: ProductSize[];
  rating: number;
  reviews: number;
  tag: string;
  top: string;
  heart: string;
  base: string;
  longevity: string;
  projection: string;
  description: string;
  inStock: boolean;
};

export type StorefrontCatalog = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  whatsappNumber: string;
};
