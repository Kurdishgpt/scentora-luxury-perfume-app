type DatabaseEnvironment = {
  NETLIFY_DB_URL?: string;
  CF_PAGES?: string;
  VERCEL?: string;
  VERCEL_ENV?: string;
  POSTGRES_URL?: string;
  DATABASE_URL?: string;
  POSTGRES_PRISMA_URL?: string;
  POSTGRES_URL_NON_POOLING?: string;
};

export type CatalogDatabaseConfig =
  | { provider: "netlify"; connectionString: string }
  | { provider: "neon"; connectionString: string };

export function isVercelRuntime(env: DatabaseEnvironment = process.env) {
  return env.VERCEL === "1" || Boolean(env.VERCEL_ENV);
}

export function isCloudflareRuntime(env: DatabaseEnvironment = process.env) {
  return (
    env.CF_PAGES === "1" ||
    (typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers")
  );
}

export function resolveCatalogDatabaseConfig(
  env: DatabaseEnvironment = process.env,
): CatalogDatabaseConfig | null {
  if (env.NETLIFY_DB_URL) {
    return { provider: "netlify", connectionString: env.NETLIFY_DB_URL };
  }

  if (!isVercelRuntime(env) && !isCloudflareRuntime(env)) return null;

  const connectionString =
    env.POSTGRES_URL || env.DATABASE_URL || env.POSTGRES_PRISMA_URL || env.POSTGRES_URL_NON_POOLING;

  return connectionString ? { provider: "neon", connectionString } : null;
}
