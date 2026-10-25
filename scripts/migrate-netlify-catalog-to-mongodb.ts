import { neon } from "@neondatabase/serverless";
import { prepareMongoDriverRuntime, resolveMongoConfig } from "../src/lib/mongo-config.server";
import type { CatalogCategory, CatalogProduct } from "../src/lib/catalog-types";

type LegacyCatalogRow = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  whatsapp_number: string;
  updated_at: Date | string;
};

function isConnectionUrl(value: string, protocols: string[]) {
  try {
    const url = new URL(value);
    return protocols.includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

async function migrateCatalog() {
  const legacyConnectionString = process.env.NETLIFY_DB_URL;
  if (!legacyConnectionString) {
    throw new Error("NETLIFY_DB_URL is required only for this one-time legacy catalog import.");
  }
  if (!isConnectionUrl(legacyConnectionString, ["postgres:", "postgresql:"])) {
    throw new Error("NETLIFY_DB_URL must be a valid PostgreSQL connection URL. No data was changed.");
  }

  const mongoConfig = resolveMongoConfig();
  if (!mongoConfig) {
    throw new Error("MONGODB_URI is required to import the catalog into MongoDB.");
  }
  if (!isConnectionUrl(mongoConfig.uri, ["mongodb:", "mongodb+srv:"])) {
    throw new Error("MONGODB_URI must be a valid MongoDB connection URL. No data was changed.");
  }

  const query = neon(legacyConnectionString);
  const rows = (await query`
    SELECT products, categories, whatsapp_number, updated_at
    FROM maya_store_state
    WHERE singleton = true
    LIMIT 1
  `) as unknown as LegacyCatalogRow[];
  const legacyCatalog = rows[0];

  if (!legacyCatalog) {
    console.log("The old database has no saved catalog; nothing was copied.");
    return;
  }

  prepareMongoDriverRuntime();
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(mongoConfig.uri, {
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5_000,
  });

  try {
    await client.connect();
    const collection = client.db(mongoConfig.databaseName).collection("store_state");
    const existing = await collection.findOne({ _id: "singleton" });
    if (existing) {
      throw new Error(
        `MongoDB already contains a catalog in "${mongoConfig.databaseName}". No data was changed; back up or review it before retrying.`,
      );
    }

    await collection.insertOne({
      _id: "singleton",
      products: legacyCatalog.products,
      categories: legacyCatalog.categories,
      whatsappNumber: legacyCatalog.whatsapp_number,
      updatedAt: legacyCatalog.updated_at,
    });

    console.log(
      `Copied ${legacyCatalog.products.length} products and ${legacyCatalog.categories.length} categories to MongoDB. The old database was not changed.`,
    );
  } finally {
    await client.close();
  }
}

void migrateCatalog().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  const secrets = [process.env.NETLIFY_DB_URL, process.env.MONGODB_URI].filter(
    (secret): secret is string => Boolean(secret),
  );
  const safeMessage = secrets.reduce(
    (result, secret) => result.replaceAll(secret, "[redacted]"),
    message,
  );
  console.error(`Catalog migration failed: ${safeMessage}`);
  process.exitCode = 1;
});
