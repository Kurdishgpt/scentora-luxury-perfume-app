import { isCloudflareRuntime, resolveCatalogDatabaseConfig } from "@/lib/database-config.server";

describe("resolveCatalogDatabaseConfig", () => {
  it("keeps the existing Netlify database binding", () => {
    expect(
      resolveCatalogDatabaseConfig({
        NETLIFY_DB_URL: "postgres://netlify.example/db",
        VERCEL: "1",
        POSTGRES_URL: "postgres://vercel.example/db",
      }),
    ).toEqual({
      provider: "netlify",
      connectionString: "postgres://netlify.example/db",
    });
  });

  it("uses the Neon-compatible database when running on Vercel", () => {
    expect(
      resolveCatalogDatabaseConfig({
        VERCEL: "1",
        POSTGRES_URL: "postgres://vercel.example/db",
      }),
    ).toEqual({
      provider: "neon",
      connectionString: "postgres://vercel.example/db",
    });
  });

  it("accepts DATABASE_URL on Vercel as a connection-string alternative", () => {
    expect(
      resolveCatalogDatabaseConfig({
        VERCEL_ENV: "production",
        DATABASE_URL: "postgres://vercel.example/db",
      }),
    ).toEqual({
      provider: "neon",
      connectionString: "postgres://vercel.example/db",
    });
  });

  it("uses a Neon-compatible database on Cloudflare Pages", () => {
    expect(
      resolveCatalogDatabaseConfig({
        CF_PAGES: "1",
        DATABASE_URL: "postgres://cloudflare.example/db",
      }),
    ).toEqual({
      provider: "neon",
      connectionString: "postgres://cloudflare.example/db",
    });
  });

  it("recognizes Cloudflare Pages as a Cloudflare runtime", () => {
    expect(isCloudflareRuntime({ CF_PAGES: "1" })).toBe(true);
  });

  it("does not accidentally use Replit's DATABASE_URL outside a supported host", () => {
    expect(
      resolveCatalogDatabaseConfig({
        DATABASE_URL: "postgres://replit.example/db",
      }),
    ).toBeNull();
  });
});
