import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";
import {
	queryParamsDiscoverMovieSchema,
	queryParamsDiscoverTvSchema,
} from "#web/validators/query-param";

const discoverRoutes = new Hono();

discoverRoutes.get(
	"/movie",
	zValidator("query", queryParamsDiscoverMovieSchema),
	async (c) => {
		const query = c.req.valid("query");

		try {
			const results = await tmdbClient.get("/discover/movie", {
				query,
			});
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

discoverRoutes.get(
	"/tv",
	zValidator("query", queryParamsDiscoverTvSchema),
	async (c) => {
		const query = c.req.valid("query");

		try {
			const results = await tmdbClient.get("/discover/tv", {
				query,
			});
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default discoverRoutes;
