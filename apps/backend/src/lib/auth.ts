import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { sendOTPEmail } from "#emails/index";
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
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendOTPEmail({
				to: user.email,
				url: url,
				fromEmail: env.TRANSACTIONAL_EMAIL,
				fromName: env.APP_NAME,
				subject: "Verify your email",
				expirationMinutes: 10,
				userName: user.name,
			});
		},
		sendOnSignUp: true,
		expiresIn: 600,
	},
	session: {
		expiresIn: 604800, // 7 days
		updateAge: 86400, // 1 day
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
