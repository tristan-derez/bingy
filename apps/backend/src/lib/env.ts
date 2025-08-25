import { z } from "zod";

const envSchema = z.object({
	PORT: z.string().default("3000"),
	LOG_LEVEL: z.string().default("info"),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	JWT_SECRET_KEY: z.string(),
	PEPPER_KEY: z.string(),
	DB_HOST: z.string().default("localhost"),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	DB_PORT: z.string().default("5432"),
	DB_URL: z.string(),
	REDIS_HOST: z.string().default("localhost"),
	REDIS_PORT: z.string().default("6379"),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	DISCORD_CLIENT_ID: z.string(),
	DISCORD_CLIENT_SECRET: z.string(),
	BASE_URL: z.string(),
	API_VERSION: z.string(),
	FRONT_URL_DEV: z.string(),
	FRONT_URL_PROD: z.string(),
});

export default envSchema.parse(Bun.env);
