import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";
import { creditIdSchemas } from "#web/validators/query-param";

const creditRoutes = new Hono();

creditRoutes.get(
	"/:credit_id",
	zValidator("param", creditIdSchemas),
	async (c) => {
		const { credit_id } = c.req.valid("param");

		try {
			const results = await tmdbClient.get("/credit/{credit_id}", {
				path: { credit_id },
			});
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default creditRoutes;
