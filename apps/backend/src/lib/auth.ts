import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, lastLoginMethod, twoFactor } from "better-auth/plugins";
import * as schema from "../db/schemas/user";
import { sendEmail } from "../emails/index";
import { db } from "../lib/database";
import { deleteImageByUrl } from "../web/utils/image";
import env from "./env";
import { logger } from "./logger";
import { hash, verify } from "./password-processing";
import {
	assertUsernameAvailable,
	generateUniqueUsername,
	validateUsernameOrThrow,
} from "./username";

const options = {
	appName: "Bingy",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
			user: schema.users,
			twoFactors: schema.two_factor,
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
	// secondaryStorage: {
	// 	get: async (key) => {
	// 		return await redis.get(key);
	// 	},
	// 	set: async (key, value, ttl) => {
	// 		await redis.set(key, value);
	// 		if (ttl) {
	// 			await redis.expire(key, ttl);
	// 		}
	// 	},
	// 	delete: async (key) => {
	// 		await redis.del(key);
	// 	},
	// },
	user: {
		fields: {
			image: "avatarUrl",
		},
		additionalFields: {
			displayName: {
				type: "string",
				required: false,
				input: false,
				returned: true,
			},
			twoFactorEnabled: {
				type: "boolean",
				required: false,
				input: false,
				returned: true,
			},
		},
		changeEmail: {
			enabled: true,
			sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
				await sendEmail({
					type: "update-email",
					to: user.email,
					url,
					fromEmail: env.TRANSACTIONAL_EMAIL,
					fromName: env.APP_NAME,
					expirationMinutes: 15,
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

				if (user.image) {
					await deleteImageByUrl(user.image);
				}

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
			void sendEmail({
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
		autoSignInAfterVerification: true,
		sendOnSignUp: true,
		expiresIn: 900, // 15 min
	},
	session: {
		expiresIn: 604800, // 7 days
		updateAge: 86400, // 1 day
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 min
		},
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			prompt: "select_account",
		},
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user, ctx) => {
					const isOAuth = !ctx?.body?.password;

					if (isOAuth) {
						const { username, displayName } = await generateUniqueUsername(
							user.name,
						);

						return {
							data: {
								...user,
								name: username,
								displayName,
							},
						};
					}

					const { normalized, displayName } = validateUsernameOrThrow(
						user.name,
					);

					await assertUsernameAvailable(normalized);

					return {
						data: {
							...user,
							name: normalized,
							displayName,
						},
					};
				},
			},
		},
	},
	plugins: [
		twoFactor(),
		lastLoginMethod({
			storeInDatabase: true,
			cookieName: "bingy.last_used_login_method",
		}),
	],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
	...options,
	plugins: [
		...(options.plugins ?? []),
		customSession(async ({ user, session }) => {
			return {
				session,
				user: {
					...user,
				},
			};
		}, options),
	],
});

export type Auth = typeof auth;
