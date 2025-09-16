import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { sendOTPEmail } from "#emails/index";
import { auth } from "#lib/auth";
import { db } from "#lib/database";
import env from "#lib/env";
import { logger } from "#lib/logger";
import { generateOtpWithExpiration } from "#lib/otp";
import { codes } from "#schemas/user";
import { handleApiError } from "#utils/handle-api-error";
import { signUpSchema } from "#web/validator/auth";

const authRoutes = new Hono();

authRoutes.post(
	"/sign-up/email",
	zValidator("json", signUpSchema),
	async (c) => {
		const { email, password, name, image, callbackURL } = c.req.valid("json");

		try {
			logger.info(`Sign-up attempt for: ${email}`);

			const result = await auth.api.signUpEmail({
				body: { email, password, name, image, callbackURL },
			});

			const userId = result.user.id;
			if (userId) {
				const newOtp = generateOtpWithExpiration();

				await db
					.insert(codes)
					.values({
						userId: result.user.id,
						code: newOtp.code,
						expiresAt: newOtp.expiresAt,
					})
					.onConflictDoUpdate({
						target: codes.userId,
						set: { code: newOtp.code, expiresAt: newOtp.expiresAt },
					});

				await sendOTPEmail({
					to: result.user.email,
					otpCode: newOtp.code,
					fromEmail: env.TRANSACTIONAL_EMAIL,
					fromName: env.APP_NAME,
					subject: "Verify your email",
					expirationMinutes: newOtp.expirationMinutes,
					userName: result.user.name,
				});
			}

			return c.json(result, 200);
		} catch (error: unknown) {
			const { statusCode, message } = handleApiError(error);
			logger.warn(`Sign-up failed for ${email}: ${message} (${statusCode})`);

			return c.json({ message }, statusCode as ContentfulStatusCode);
		}
	},
);

authRoutes.all("*", (c: Context) => {
	return auth.handler(c.req.raw);
});

export default authRoutes;
