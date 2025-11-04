import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";
import {
	externalIdParamSchema,
	queryParamsFindByExternalId,
} from "#web/validators/query-param";

const findRoutes = new Hono();

findRoutes.get(
	"/:external_id",
	zValidator("param", externalIdParamSchema),
	zValidator("query", queryParamsFindByExternalId),
	async (c) => {
		const { external_id } = c.req.valid("param");
		const { external_source, language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get("/find/{external_id}", {
				query: { external_source, language },
				path: { external_id },
			});
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default findRoutes;
