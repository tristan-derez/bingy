import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError, serveNotFound } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { TmdbError, tmdbClient } from "#lib/tmdb/tmdb.client";
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
			if (error instanceof TmdbError && error.status === 404) {
				return serveNotFound(c, "Resource not found");
			}
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
