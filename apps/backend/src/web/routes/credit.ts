import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	creditIdSchemas,
	languageQuerySchema,
} from "#web/validators/query-param";
import { logger } from "../../lib/logger";
import {
	serveInternalServerError,
	serveNotFound,
} from "../../lib/responses/error";
import { serveData } from "../../lib/responses/resp";
import { TmdbError, tmdbClient } from "../../lib/tmdb/tmdb-client";

const creditRoutes = new Hono();

creditRoutes.get(
	"/:credit_id",
	zValidator("param", creditIdSchemas),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { credit_id } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get("/credit/{credit_id}", {
				path: { credit_id },
				query: { language },
			});
			return serveData(c, results);
		} catch (error) {
			if (error instanceof TmdbError && error.status === 404) {
				return serveNotFound(c, "Resource not found");
			}
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default creditRoutes;
