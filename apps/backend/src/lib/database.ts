import type { Logger as drizzleLogger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { users } from "#schemas/user";
import * as schema from "#schemas/user";
import env from "./env";
import { logger } from "./logger";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OauthAccount = typeof schema.oauthAccounts.$inferSelect;
export type NewOauthAccount = typeof schema.oauthAccounts.$inferInsert;

const dbLogger: drizzleLogger = {
	logQuery(query: string, params: unknown[]): void {
		logger.debug({ query, params });
	},
};

export const connection = postgres({
	host: env.DB_HOST,
	username: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	port: Number(env.DB_PORT),
	ssl: env.NODE_ENV === "production",
	max: 20,
	idle_timeout: 20,
	connect_timeout: 60,
});

export const db = drizzle(connection, {
	schema,
	logger: dbLogger,
});

export const DB_ERRORS = {
	DUPLICATE_KEY: "23505",
	INVALID_FOREIGN_KEY: "23503",
	REQUIRED_FIELD_MISSING: "23502",
	INVALID_VALUE: "23514",
	INVALID_DATA_FORMAT: "22P02",
	DISK_FULL: "53100",
	OUT_OF_MEMORY: "53200",
	TABLE_NOT_FOUND: "42P01",
	COLUMN_NOT_FOUND: "42703",
	SYNTAX_ERROR: "42601",
};
