const isProd = process.env.NODE_ENV === "production";

export const connectionString = isProd ? process.env.DB_CONNECTION_PROD : process.env.DB_CONNECTION_DEV;
export const MAXIMUM_INSERTED_PRODUCTS_WITHIN_ONE_HOUR = 3;
