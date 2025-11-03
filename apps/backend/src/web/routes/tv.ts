import { type Context, Hono } from "hono";
import { logger } from "#lib/logger";
import {
	serveBadRequest,
	serveInternalServerError,
} from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";

const tvRoutes = new Hono();

tvRoutes.get("/:id", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tv = await tmdbClient.get("/tv/{series_id}", {
			query: { language },
			path: { series_id: id },
		});
		return serveData(c, tv);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

export default tvRoutes;
