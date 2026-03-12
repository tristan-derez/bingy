import { type Context, Hono } from "hono";
import { logger } from "../../lib/logger";
import {
	serveBadRequest,
	serveInternalServerError,
} from "../../lib/responses/error";
import { serveData } from "../../lib/responses/resp";
import { tmdbClient } from "../../lib/tmdb/tmdb.client";

const trendingRoutes = new Hono();

trendingRoutes.get("/all/:time_window", async (c: Context) => {
	const timeWindowParam = c.req.param("time_window") ?? "day";
	const time_window =
		timeWindowParam === "day" || timeWindowParam === "week"
			? timeWindowParam
			: "day";
	const page = Number(c.req.query("page") || "1");
	const language = c.req.query("language") || "en-US";

	if (!time_window)
		return serveBadRequest(
			c,
			`time_window param is required ("day" or "week")`,
		);

	try {
		const results = await tmdbClient.get("/trending/all/{time_window}", {
			query: { language, page },
			path: { time_window },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

trendingRoutes.get("/movie/:time_window", async (c: Context) => {
	const timeWindowParam = c.req.param("time_window") ?? "day";
	const time_window =
		timeWindowParam === "day" || timeWindowParam === "week"
			? timeWindowParam
			: "day";
	const page = Number(c.req.query("page") || "1");
	const language = c.req.query("language") || "en-US";

	if (!time_window)
		return serveBadRequest(
			c,
			`time_window param is required ("day" or "week")`,
		);

	try {
		const results = await tmdbClient.get("/trending/movie/{time_window}", {
			query: { language, page },
			path: { time_window },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

trendingRoutes.get("/tv/:time_window", async (c: Context) => {
	const timeWindowParam = c.req.param("time_window") ?? "day";
	const time_window =
		timeWindowParam === "day" || timeWindowParam === "week"
			? timeWindowParam
			: "day";
	const page = Number(c.req.query("page") || "1");
	const language = c.req.query("language") || "en-US";

	if (!time_window)
		return serveBadRequest(
			c,
			`time_window param is required ("day" or "week")`,
		);

	try {
		const results = await tmdbClient.get("/trending/tv/{time_window}", {
			query: { language, page },
			path: { time_window },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

trendingRoutes.get("/person/:time_window", async (c: Context) => {
	const timeWindowParam = c.req.param("time_window") ?? "day";
	const time_window =
		timeWindowParam === "day" || timeWindowParam === "week"
			? timeWindowParam
			: "day";
	const page = Number(c.req.query("page") || "1");
	const language = c.req.query("language") || "en-US";

	if (!time_window)
		return serveBadRequest(
			c,
			`time_window param is required ("day" or "week")`,
		);

	try {
		const results = await tmdbClient.get("/trending/person/{time_window}", {
			query: { language, page },
			path: { time_window },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

export default trendingRoutes;
