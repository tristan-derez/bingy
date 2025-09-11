import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { db } from "#lib/database";
import * as schema from "#schemas/user";
import env from "./env";

export const auth = betterAuth({
	appName: "bingytrack",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
			user: schema.users,
			account: schema.accounts,
			session: schema.sessions,
			verification: schema.verifications,
		},
		usePlural: true,
	}),
	trustedOrigins: ["http://localhost:5173"],
	advanced: {
		database: {
			generateId: false,
		},
	},
	user: {
		fields: {
			image: "avatarUrl",
		},
	},
	account: {
		fields: {
			password: "passwordHash",
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		},
	},
	plugins: [
		twoFactor({
			schema: {
				user: {
					modelName: "users",
				},
				twoFactor: {
					modelName: "two_factor",
				},
			},
		}),
	],
});
