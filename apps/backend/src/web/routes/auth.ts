import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { auth } from "#lib/auth";
import { logger } from "#lib/logger";
import { serve } from "#lib/responses/resp";
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

			return serve(c, result, 200);
		} catch (error: unknown) {
			const { statusCode, message } = handleApiError(error);
			logger.warn(`Sign-up failed for ${email}: ${message} (${statusCode})`);

			return c.json({ error: message }, statusCode as ContentfulStatusCode);
		}
	},
);

authRoutes.all("*", (c: Context) => {
	return auth.handler(c.req.raw);
});

export default authRoutes;
