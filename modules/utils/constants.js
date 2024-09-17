export const { SECRET_JWT = "secret", PORT = 3001, MONGO_DB_URI = undefined, NODE_ENV = "development" } = process.env || {};

export const EXPIRATION_JWT = 3600;
