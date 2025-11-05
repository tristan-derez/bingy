import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError, serveNotFound } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { TmdbError, tmdbClient } from "#lib/tmdb/tmdb.client";
import { idParamSchema } from "#web/validators/query-param";

const networkRoutes = new Hono();

networkRoutes.get("/:id", zValidator("param", idParamSchema), async (c) => {
	const { id } = c.req.valid("param");

	try {
		const results = await tmdbClient.get("/network/{network_id}", {
			path: { network_id: id },
		});
		return serveData(c, results);
	} catch (error) {
		if (error instanceof TmdbError && error.status === 404) {
			return serveNotFound(c, "Resource not found");
		}
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

networkRoutes.get(
	"/:id/alternative_names",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const results = await tmdbClient.get(
				"/network/{network_id}/alternative_names",
				{
					path: { network_id: id },
				},
			);
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

networkRoutes.get(
	"/:id/images",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const results = await tmdbClient.get("/network/{network_id}/images", {
				path: { network_id: id },
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

export default networkRoutes;
