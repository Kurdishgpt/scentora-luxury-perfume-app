type MongoEnvironment = {
  MONGODB_URI?: string;
  MONGODB_DATABASE?: string;
};

export function resolveMongoConfig(env: MongoEnvironment = process.env) {
  const uri = env.MONGODB_URI?.trim();
  if (!uri) return null;

  return {
    uri,
    databaseName: env.MONGODB_DATABASE?.trim() || "maya_collection",
  };
}
