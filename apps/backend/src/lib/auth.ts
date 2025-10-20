import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { redis } from "bun";
import { sendEmail } from "#emails/index";
import { db } from "#lib/database";
import * as schema from "#schemas/user";
import env from "./env";
import { logger } from "./logger";
import { hash, verify } from "./password-processing";
import { lastLoginMethod } from "better-auth/plugins";

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
	trustedOrigins: [env.FRONT_URL],
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
	secondaryStorage: {
		get: async (key) => {
			return await redis.get(key);
		},
		set: async (key, value, ttl) => {
			await redis.set(key, value);
			if (ttl) {
				await redis.expire(key, ttl);
			}
		},
		delete: async (key) => {
			await redis.del(key);
		},
	},
	user: {
		fields: {
			image: "avatarUrl",
		},
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, newEmail, url }) => {
				await sendEmail({
					type: "update-email",
					to: user.email,
					url,
					fromEmail: env.TRANSACTIONAL_EMAIL,
					fromName: env.APP_NAME,
					expirationInMinutes: 15,
					userName: user.name,
					newEmail: newEmail,
				});
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url }) => {
				await sendEmail({
					type: "delete-account",
					to: user.email,
					url,
					fromEmail: env.TRANSACTIONAL_EMAIL,
					fromName: env.APP_NAME,
					subject: "Account deletion",
					expirationMinutes: 15,
					userName: user.name,
				});
			},
			deleteTokenExpiresIn: 900, // 15 min
			afterDelete: async (user) => {
				const deletionDate = new Date().toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				});

				await sendEmail({
					type: "deleted-account",
					to: user.email,
					fromEmail: env.TRANSACTIONAL_EMAIL,
					fromName: env.APP_NAME,
					userName: user.name,
					date: deletionDate,
				});
			},
		},
	},
	account: {
		fields: {
			password: "passwordHash",
		},
		accountLinking: {
			enabled: true,
			allowDifferentEmails: true,
		},
		encryptOAuthTokens: true,
	},
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 256,
		password: {
			hash: hash,
			verify: verify,
		},
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				type: "reset-password",
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
			await sendEmail({
				type: "verification-email",
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
		lastLoginMethod({
			storeInDatabase: true,
		}),
	],
});
