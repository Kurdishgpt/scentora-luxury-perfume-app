type MongoEnvironment = {
  MONGODB_URI?: string;
  MONGODB_DATABASE?: string;
};

type BunV8Module = {
  startupSnapshot?: {
    isBuildingSnapshot?: () => boolean;
  };
};

export function resolveMongoConfig(env: MongoEnvironment = process.env) {
  const uri = env.MONGODB_URI?.trim();
  if (!uri) return null;

  return {
    uri,
    databaseName: env.MONGODB_DATABASE?.trim() || "maya_collection",
  };
}

export function prepareMongoDriverRuntime() {
  if (!("bun" in process.versions)) return;

  const processWithBuiltinModule = process as typeof process & {
    getBuiltinModule?: (id: string) => unknown;
  };
  const builtinV8 = processWithBuiltinModule.getBuiltinModule?.call(process, "v8");
  const v8 = builtinV8 as BunV8Module | undefined;
  const snapshot = v8?.startupSnapshot;

  if (snapshot && typeof snapshot.isBuildingSnapshot === "function") {
    snapshot.isBuildingSnapshot = () => false;
  }
}
