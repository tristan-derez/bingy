import { Hono } from "hono";
import { logger } from "../../lib/logger";
import {
	serveInternalServerError,
	serveNotFound,
} from "../../lib/responses/error";
import { serveData } from "../../lib/responses/resp";
import { TmdbError, tmdbClient } from "../../lib/tmdb/tmdb-client";

const certificationRoutes = new Hono();

certificationRoutes.get("/movie/list", async (c) => {
	try {
		const results = await tmdbClient.get("/certification/movie/list");
		return serveData(c, results);
	} catch (error) {
		if (error instanceof TmdbError && error.status === 404) {
			return serveNotFound(c, "Resource not found");
		}
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

certificationRoutes.get("/tv/list", async (c) => {
	try {
		const results = await tmdbClient.get("/certification/tv/list");
		return serveData(c, results);
	} catch (error) {
		if (error instanceof TmdbError && error.status === 404) {
			return serveNotFound(c, "Resource not found");
		}
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

export default certificationRoutes;
