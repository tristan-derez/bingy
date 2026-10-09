import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "../../lib/logger";
import { serveInternalServerError } from "../../lib/responses/error";
import { serveData } from "../../lib/responses/resp";
import { tmdbClient } from "../../lib/tmdb/tmdb-client";
import { languageQuerySchema } from "../../web/validators/query-param";

const watchProvidersRoutes = new Hono();

watchProvidersRoutes.get(
	"/regions",
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get("/watch/providers/regions", {
				query: { language },
			});
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default watchProvidersRoutes;
