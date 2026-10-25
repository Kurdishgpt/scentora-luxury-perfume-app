import { resolveCatalogDatabaseConfig } from "@/lib/database-config.server";

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

  it("uses Vercel Postgres when running on Vercel", () => {
    expect(
      resolveCatalogDatabaseConfig({
        VERCEL: "1",
        POSTGRES_URL: "postgres://vercel.example/db",
      }),
    ).toEqual({
      provider: "vercel",
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
      provider: "vercel",
      connectionString: "postgres://vercel.example/db",
    });
  });

  it("does not accidentally use Replit's DATABASE_URL outside Vercel", () => {
    expect(
      resolveCatalogDatabaseConfig({
        DATABASE_URL: "postgres://replit.example/db",
      }),
    ).toBeNull();
  });
});
