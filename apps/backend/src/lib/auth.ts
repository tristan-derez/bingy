import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { sendOTPEmail, sendResetPasswordEmail } from "#emails/index";
import { db } from "#lib/database";
import * as schema from "#schemas/user";
import env from "./env";
import { logger } from "./logger";

export const auth = betterAuth({
	appName: "bingy",
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
		ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false,
		},
		useSecureCookies: env.NODE_ENV === "production",
		cookiePrefix: env.APP_NAME,
	},
	rateLimit: {
		enabled: env.NODE_ENV === "production",
		window: 10,
		max: 20,
		storage: "memory",
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
		minPasswordLength: 8,
		maxPasswordLength: 256,
		sendResetPassword: async ({ user, url }) => {
			await sendResetPasswordEmail({
				to: user.email,
				url: url,
				fromEmail: env.TRANSACTIONAL_EMAIL,
				fromName: env.APP_NAME,
				subject: "Reset your password",
				expirationMinutes: 15,
				userName: user.name,
			});
		},
		onPasswordReset: async ({ user }) => {
			logger.info(`Password for ${user.email} has been reset`);
		},
		resetPasswordTokenExpiresIn: 900, // 15 min
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendOTPEmail({
				to: user.email,
				url: url,
				fromEmail: env.TRANSACTIONAL_EMAIL,
				fromName: env.APP_NAME,
				subject: "Verify your email",
				expirationMinutes: 15,
				userName: user.name,
			});
		},
		sendOnSignUp: true,
		expiresIn: 900, // 15 min
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
