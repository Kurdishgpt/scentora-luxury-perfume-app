import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { CatalogCategory, CatalogProduct } from "./catalog-types";

const productSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(120),
  brand: z.string().trim().min(1).max(120),
  image: z.string().trim().min(1).max(3_000_000),
  subtitle: z.string().max(240),
  categories: z.array(z.string().trim().min(1).max(48)).max(12),
  sizes: z.array(z.object({
    volume: z.number().int().min(1).max(5000),
    price: z.number().min(0).max(10_000_000),
  })).min(1).max(12),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0),
  tag: z.string().max(100),
  top: z.string().max(240),
  heart: z.string().max(240),
  base: z.string().max(240),
  longevity: z.string().max(100),
  projection: z.string().max(160),
  description: z.string().max(2000),
  inStock: z.boolean(),
}).refine((product) => new Set(product.sizes.map((size) => size.volume)).size === product.sizes.length, {
  message: "Bottle volumes must be unique.",
});

const productDraftSchema = productSchema.omit({ id: true, rating: true, reviews: true, tag: true, longevity: true, projection: true });

export const getStorefrontCatalogFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getStorefrontCatalog } = await import("./catalog.server");
  return getStorefrontCatalog();
});

export const getAdminSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isAdminSignedIn } = await import("./admin-auth.server");
  return { isAdmin: await isAdminSignedIn() };
});

export const signInAdminFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ password: z.string().min(1).max(512) }).parse(data))
  .handler(async ({ data }) => {
    const { signInAdmin } = await import("./admin-auth.server");
    return signInAdmin(data.password);
  });

export const signOutAdminFn = createServerFn({ method: "POST" }).handler(async () => {
  const { signOutAdmin } = await import("./admin-auth.server");
  return signOutAdmin();
});

export const getAdminCatalogFn = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin-auth.server");
  await requireAdmin();
  const { getStorefrontCatalog } = await import("./catalog.server");
  return getStorefrontCatalog();
});

export const createProductFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => productDraftSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-auth.server");
    await requireAdmin();
    const { createProduct } = await import("./catalog.server");
    const product: CatalogProduct = {
      ...data,
      id: crypto.randomUUID(),
      rating: 5,
      reviews: 0,
      tag: "New",
      longevity: "—",
      projection: "—",
    };
    return createProduct(product);
  });

export const updateProductFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().min(1), product: productSchema }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-auth.server");
    await requireAdmin();
    const { updateProduct } = await import("./catalog.server");
    return updateProduct(data.id, data.product);
  });

export const deleteProductFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().min(1).max(100) }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-auth.server");
    await requireAdmin();
    const { removeProduct } = await import("./catalog.server");
    return removeProduct(data.id);
  });

export const updateCategoriesFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    categories: z.array(z.string().trim().min(1).max(48)).max(40),
  }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-auth.server");
    await requireAdmin();
    const categories: CatalogCategory[] = [...new Set(data.categories.map((item) => item.trim()))];
    const { updateCategories } = await import("./catalog.server");
    return updateCategories(categories);
  });

export const updateWhatsappFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    whatsappNumber: z.string().trim().regex(/^\+?\d{7,18}$/),
  }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-auth.server");
    await requireAdmin();
    const { updateWhatsappNumber } = await import("./catalog.server");
    return updateWhatsappNumber(data.whatsappNumber.replace(/^\+/, ""));
  });
