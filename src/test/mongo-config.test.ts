import { prepareMongoDriverRuntime, resolveMongoConfig } from "@/lib/mongo-config.server";

describe("resolveMongoConfig", () => {
  it("requires a MongoDB connection URI", () => {
    expect(resolveMongoConfig({})).toBeNull();
  });

  it("uses the default catalog database name", () => {
    expect(resolveMongoConfig({ MONGODB_URI: "mongodb+srv://example.invalid" })).toEqual({
      uri: "mongodb+srv://example.invalid",
      databaseName: "maya_collection",
    });
  });

  it("uses the configured database name and trims whitespace", () => {
    expect(
      resolveMongoConfig({
        MONGODB_URI: " mongodb+srv://example.invalid ",
        MONGODB_DATABASE: " maya_store ",
      }),
    ).toEqual({
      uri: "mongodb+srv://example.invalid",
      databaseName: "maya_store",
    });
  });
});

describe("prepareMongoDriverRuntime", () => {
  it("provides a safe snapshot check for the Mongo driver in Bun", () => {
    prepareMongoDriverRuntime();

    if ("bun" in process.versions) {
      const processWithBuiltinModule = process as typeof process & {
        getBuiltinModule?: (id: string) => {
          startupSnapshot?: { isBuildingSnapshot?: () => boolean };
        };
      };
      expect(
        processWithBuiltinModule.getBuiltinModule
          ?.call(process, "v8")
          ?.startupSnapshot?.isBuildingSnapshot?.(),
      ).toBe(false);
    }
  });
});
