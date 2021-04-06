/**
 * Whether or not the app is running in development mode
 */
export const isDev = process.env.NODE_ENV === "development";

export const apiKey = process.env.API_KEY || "";

export const apiSecret = process.env.API_SECRET || "";

export const token = process.env.TOKEN || "";

export const accessToken = process.env.API_ACCESS_TOKEN || "";

export const accessTokenSecret = process.env.API_ACCESS_SECRET || "";
