import { type Context, Hono } from "hono";
import { logger } from "#lib/logger";
import {
	serveBadRequest,
	serveInternalServerError,
} from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";

const searchRoutes = new Hono();

searchRoutes.get("/movie", async (c: Context) => {
	const query = c.req.query("query");
	const page = Number(c.req.query("page")) || 1;
	const language = c.req.query("language") ?? "en-US";

	if (!query) return serveBadRequest(c, "Query params is required");

	try {
		const results = await tmdbClient.get("/search/movie", {
			query: { query, page, language },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

searchRoutes.get("/tv", async (c: Context) => {
	const query = c.req.query("query");
	const page = Number(c.req.query("page")) || 1;
	const language = c.req.query("language") ?? "en-US";

	if (!query) return serveBadRequest(c, "Query params is required");

	try {
		const results = await tmdbClient.get("/search/tv", {
			query: { query, page, language },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

searchRoutes.get("person", async (c: Context) => {
	const query = c.req.query("query");
	const page = Number(c.req.query("page")) || 1;
	const language = c.req.query("language") ?? "en-US";

	if (!query) return serveBadRequest(c, "Query params is required");

	try {
		const results = await tmdbClient.get("/search/person", {
			query: { query, page, language },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

searchRoutes.get("collection", async (c: Context) => {
	const query = c.req.query("query");
	const page = Number(c.req.query("page")) || 1;
	const language = c.req.query("language") ?? "en-US";

	if (!query) return serveBadRequest(c, "Query params is required");

	try {
		const results = await tmdbClient.get("/search/collection", {
			query: { query, page, language },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

searchRoutes.get("company", async (c: Context) => {
	const query = c.req.query("query");
	const page = Number(c.req.query("page")) || 1;

	if (!query) return serveBadRequest(c, "Query params is required");

	try {
		const results = await tmdbClient.get("/search/company", {
			query: { query, page },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

searchRoutes.get("keyword", async (c: Context) => {
	const query = c.req.query("query");
	const page = Number(c.req.query("page")) || 1;

	if (!query) return serveBadRequest(c, "Query params is required");

	try {
		const results = await tmdbClient.get("/search/keyword", {
			query: { query, page },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

searchRoutes.get("multi", async (c: Context) => {
	const query = c.req.query("query");
	const page = Number(c.req.query("page")) || 1;
	const language = c.req.query("language") ?? "en-US";

	if (!query) return serveBadRequest(c, "Query params is required");

	try {
		const results = await tmdbClient.get("/search/multi", {
			query: { query, page, language },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

export default searchRoutes;
