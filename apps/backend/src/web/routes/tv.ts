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

tvRoutes.get("/:id/aggregate_credits", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvAggregateCredits = await tmdbClient.get(
			"/tv/{series_id}/aggregate_credits",
			{
				query: { language },
				path: { series_id: id },
			},
		);
		return serveData(c, tvAggregateCredits);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/alternate_titles", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvAlternativeTitles = await tmdbClient.get(
			"/tv/{series_id}/alternative_titles",
			{
				path: { series_id: id },
			},
		);
		return serveData(c, tvAlternativeTitles);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/content_ratings", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvContentRatings = await tmdbClient.get(
			"/tv/{series_id}/content_ratings",
			{
				path: { series_id: id },
			},
		);
		return serveData(c, tvContentRatings);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/credits", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvCredits = await tmdbClient.get("/tv/{series_id}/credits", {
			query: { language },
			path: { series_id: id },
		});
		return serveData(c, tvCredits);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/episode_groups", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvEpisodeGroups = await tmdbClient.get(
			"/tv/{series_id}/episode_groups",
			{
				path: { series_id: id },
			},
		);
		return serveData(c, tvEpisodeGroups);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/external_ids", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvExternalIds = await tmdbClient.get("/tv/{series_id}/external_ids", {
			path: { series_id: id },
		});
		return serveData(c, tvExternalIds);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/images", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvImages = await tmdbClient.get("/tv/{series_id}/images", {
			query: { language },
			path: { series_id: id },
		});
		return serveData(c, tvImages);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/images", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvKeywords = await tmdbClient.get("/tv/{series_id}/keywords", {
			path: { series_id: id },
		});
		return serveData(c, tvKeywords);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/latest", async (c: Context) => {
	try {
		const tvLatest = await tmdbClient.get("/tv/latest");
		return serveData(c, tvLatest);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/lists", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvLists = await tmdbClient.get("/tv/{series_id}/lists", {
			query: { language, page },
			path: { series_id: id },
		});
		return serveData(c, tvLists);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/recommendations", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvRecommendations = await tmdbClient.get(
			"/tv/{series_id}/recommendations",
			{
				query: { language, page },
				path: { series_id: id },
			},
		);
		return serveData(c, tvRecommendations);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/reviews", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvReviews = await tmdbClient.get("/tv/{series_id}/reviews", {
			query: { language, page },
			path: { series_id: id },
		});
		return serveData(c, tvReviews);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/screened_theatrically", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvScreenTheatrically = await tmdbClient.get(
			"/tv/{series_id}/screened_theatrically",
			{
				path: { series_id: id },
			},
		);
		return serveData(c, tvScreenTheatrically);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/similar", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvSimilar = await tmdbClient.get("/tv/{series_id}/similar", {
			query: { language, page },
			path: { series_id: id },
		});
		return serveData(c, tvSimilar);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/translations", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvTranslations = await tmdbClient.get(
			"/tv/{series_id}/translations",
			{
				path: { series_id: id },
			},
		);
		return serveData(c, tvTranslations);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/videos", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvVideos = await tmdbClient.get("/tv/{series_id}/videos", {
			query: { language },
			path: { series_id: id },
		});
		return serveData(c, tvVideos);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get("/:id/watch/providers", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid tv ID");

	try {
		const tvWatchProviders = await tmdbClient.get(
			"/tv/{series_id}/watch/providers",
			{
				path: { series_id: id },
			},
		);
		return serveData(c, tvWatchProviders);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

export default tvRoutes;
