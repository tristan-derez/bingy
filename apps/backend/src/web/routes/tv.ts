import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { logger } from "#lib/logger";
import {
	serveBadRequest,
	serveInternalServerError,
} from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";
import {
	idWithSeasonNumberAndEpisodeNumber,
	idWithSeasonNumberSchema,
	tvEpisodeGroupId,
} from "#validators/query-param";

const tvRoutes = new Hono();

const idParamSchema = z.object({
	id: z.coerce.number(),
});

const languageQuerySchema = z.object({
	language: z.string().default("en-US"),
});

const paginationQuerySchema = z.object({
	language: z.string().default("en-US"),
	page: z.coerce.number().default(1),
});

tvRoutes.get("/latest", async (c) => {
	try {
		const tvLatest = await tmdbClient.get("/tv/latest");
		return serveData(c, tvLatest);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

tvRoutes.get(
	"/top_rated",
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { language, page } = c.req.valid("query");

		try {
			const tvWatchProviders = await tmdbClient.get("/tv/top_rated", {
				query: { language, page },
			});
			return serveData(c, tvWatchProviders);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

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
	},
);

tvRoutes.get(
	"/:id/aggregate_credits",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

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
	},
);

tvRoutes.get(
	"/:id/alternate_titles",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

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
	},
);

tvRoutes.get(
	"/:id/content_ratings",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

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
	},
);

tvRoutes.get(
	"/:id/credits",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

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
	},
);

tvRoutes.get(
	"/:id/episode_groups",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

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
	},
);

tvRoutes.get(
	"/:id/external_ids",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const tvExternalIds = await tmdbClient.get(
				"/tv/{series_id}/external_ids",
				{
					path: { series_id: id },
				},
			);
			return serveData(c, tvExternalIds);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/images",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");
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
	},
);

tvRoutes.get("/:id/keywords", zValidator("param", idParamSchema), async (c) => {
	const { id } = c.req.valid("param");

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

tvRoutes.get(
	"/:id/lists",
	zValidator("param", idParamSchema),
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language, page } = c.req.valid("query");

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
	},
);

tvRoutes.get(
	"/:id/recommendations",
	zValidator("param", idParamSchema),
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language, page } = c.req.valid("query");

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
	},
);

tvRoutes.get(
	"/:id/reviews",
	zValidator("param", idParamSchema),
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language, page } = c.req.valid("query");

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
	},
);

tvRoutes.get(
	"/:id/screened_theatrically",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

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
	},
);

tvRoutes.get(
	"/:id/similar",
	zValidator("param", idParamSchema),
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language, page } = c.req.valid("query");

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
	},
);

tvRoutes.get(
	"/:id/translations",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

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
	},
);

tvRoutes.get(
	"/:id/videos",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

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
	},
);

tvRoutes.get(
	"/:id/watch/providers",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

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
	},
);

tvRoutes.get(
	"/:id/season/:season_number",
	zValidator("param", idWithSeasonNumberSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const tvSeasonDetails = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}",
				{
					query: { language },
					path: { series_id: id, season_number },
				},
			);
			return serveData(c, tvSeasonDetails);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/aggregate_credits",
	zValidator("param", idWithSeasonNumberSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/aggregate_credits",
				{
					query: { language },
					path: { series_id: id, season_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/credits",
	zValidator("param", idWithSeasonNumberSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/credits",
				{
					query: { language },
					path: { series_id: id, season_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/external_ids",
	zValidator("param", idWithSeasonNumberSchema),
	async (c) => {
		const { id, season_number } = c.req.valid("param");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/external_ids",
				{
					path: { series_id: id, season_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/images",
	zValidator("param", idWithSeasonNumberSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/images",
				{
					query: { language },
					path: { series_id: id, season_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/translations",
	zValidator("param", idWithSeasonNumberSchema),
	async (c) => {
		const { id, season_number } = c.req.valid("param");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/translations",
				{
					path: { series_id: id, season_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/videos",
	zValidator("param", idWithSeasonNumberSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/videos",
				{
					query: { language },
					path: { series_id: id, season_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/watch/providers",
	zValidator("param", idWithSeasonNumberSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/watch/providers",
				{
					query: { language },
					path: { series_id: id, season_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/episode/:episode_number",
	zValidator("param", idWithSeasonNumberAndEpisodeNumber),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number, episode_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/episode/{episode_number}",
				{
					query: { language },
					path: { series_id: id, season_number, episode_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/episode/:episode_number/credits",
	zValidator("param", idWithSeasonNumberAndEpisodeNumber),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number, episode_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/episode/{episode_number}/credits",
				{
					query: { language },
					path: { series_id: id, season_number, episode_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/episode/:episode_number/external_ids",
	zValidator("param", idWithSeasonNumberAndEpisodeNumber),
	async (c) => {
		const { id, season_number, episode_number } = c.req.valid("param");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids",
				{
					path: { series_id: id, season_number, episode_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/episode/:episode_number/images",
	zValidator("param", idWithSeasonNumberAndEpisodeNumber),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number, episode_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/episode/{episode_number}/images",
				{
					query: { language },
					path: { series_id: id, season_number, episode_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/episode/:episode_number/translations",
	zValidator("param", idWithSeasonNumberAndEpisodeNumber),
	async (c) => {
		const { id, season_number, episode_number } = c.req.valid("param");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/episode/{episode_number}/translations",
				{
					path: { series_id: id, season_number, episode_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/:id/season/:season_number/episode/:episode_number/videos",
	zValidator("param", idWithSeasonNumberAndEpisodeNumber),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id, season_number, episode_number } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}/episode/{episode_number}/videos",
				{
					query: { language },
					path: { series_id: id, season_number, episode_number },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

tvRoutes.get(
	"/episode_group/:tv_episode_group_id",
	zValidator("param", tvEpisodeGroupId),
	async (c) => {
		const { tv_episode_group_id } = c.req.valid("param");

		try {
			const results = await tmdbClient.get(
				"/tv/episode_group/{tv_episode_group_id}",
				{
					path: { tv_episode_group_id },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default tvRoutes;
