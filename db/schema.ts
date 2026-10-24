import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { CatalogCategory, CatalogProduct } from "../src/lib/catalog-types";

export const mayaStoreState = pgTable("maya_store_state", {
  singleton: boolean().primaryKey().default(true),
  products: jsonb().$type<CatalogProduct[]>().notNull(),
  categories: jsonb().$type<CatalogCategory[]>().notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
