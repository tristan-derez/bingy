import { defineConfig } from "drizzle-kit";
import env from "#lib/env";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schemas",
	dialect: "postgresql",
	dbCredentials: {
		host: env.DB_HOST,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
		ssl: env.NODE_ENV === "production",
	},
});
