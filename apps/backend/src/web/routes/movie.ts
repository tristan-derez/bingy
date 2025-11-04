import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";
import {
	countryQuerySchema,
	idParamSchema,
	languageQuerySchema,
	paginationQuerySchema,
	queryParamsTrending,
} from "#web/validators/query-param";

const movieRoutes = new Hono();

movieRoutes.get("/latest", async (c) => {
	try {
		const movie = await tmdbClient.get("/movie/latest");
		return serveData(c, movie);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

movieRoutes.get(
	"/now_playing",
	zValidator("query", queryParamsTrending),
	async (c) => {
		const { language, page, region } = c.req.valid("query");

		try {
			const movieNowPlaying = await tmdbClient.get("/movie/now_playing", {
				query: { language, region, page },
			});
			return serveData(c, movieNowPlaying);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/popular",
	zValidator("query", queryParamsTrending),
	async (c) => {
		const { language, page, region } = c.req.valid("query");

		try {
			const moviePopular = await tmdbClient.get("/movie/popular", {
				query: { language, region, page },
			});
			return serveData(c, moviePopular);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/top_rated",
	zValidator("query", queryParamsTrending),
	async (c) => {
		const { language, page, region } = c.req.valid("query");

		try {
			const movieTopRated = await tmdbClient.get("/movie/top_rated", {
				query: { language, region, page },
			});
			return serveData(c, movieTopRated);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/upcoming",
	zValidator("query", queryParamsTrending),
	async (c) => {
		const { language, page, region } = c.req.valid("query");

		try {
			const movieUpcoming = await tmdbClient.get("/movie/upcoming", {
				query: { language, region, page },
			});
			return serveData(c, movieUpcoming);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const movie = await tmdbClient.get("/movie/{movie_id}", {
				query: { language },
				path: { movie_id: id },
			});
			return serveData(c, movie);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/alternative_titles",
	zValidator("param", idParamSchema),
	zValidator("query", countryQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { country } = c.req.valid("query");

		try {
			const movieAlternativeTitles = await tmdbClient.get(
				"/movie/{movie_id}/alternative_titles",
				{
					query: { country },
					path: { movie_id: id },
				},
			);
			return serveData(c, movieAlternativeTitles);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/credits",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const movieCredits = await tmdbClient.get("/movie/{movie_id}/credits", {
				query: { language },
				path: { movie_id: id },
			});
			return serveData(c, movieCredits);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/external_ids",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const movieExternalIds = await tmdbClient.get(
				"/movie/{movie_id}/external_ids",
				{
					path: { movie_id: id },
				},
			);
			return serveData(c, movieExternalIds);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/images",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const movieImages = await tmdbClient.get("/movie/{movie_id}/images", {
				query: { language },
				path: { movie_id: id },
			});
			return serveData(c, movieImages);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/keywords",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const movieKeywords = await tmdbClient.get("/movie/{movie_id}/keywords", {
				path: { movie_id: id },
			});
			return serveData(c, movieKeywords);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/lists",
	zValidator("param", idParamSchema),
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language, page } = c.req.valid("query");

		try {
			const movieLists = await tmdbClient.get("/movie/{movie_id}/lists", {
				query: { language, page },
				path: { movie_id: id },
			});
			return serveData(c, movieLists);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/recommendations",
	zValidator("param", idParamSchema),
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language, page } = c.req.valid("query");

		try {
			const movieRecommendations = await tmdbClient.get(
				"/movie/{movie_id}/recommendations",
				{
					query: { language, page },
					path: { movie_id: id },
				},
			);
			return serveData(c, movieRecommendations);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/release_dates",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const movieReleaseDates = await tmdbClient.get(
				"/movie/{movie_id}/release_dates",
				{
					path: { movie_id: id },
				},
			);
			return serveData(c, movieReleaseDates);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/reviews",
	zValidator("param", idParamSchema),
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language, page } = c.req.valid("query");

		try {
			const movieReviews = await tmdbClient.get("/movie/{movie_id}/reviews", {
				query: { language, page },
				path: { movie_id: id },
			});
			return serveData(c, movieReviews);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/similar",
	zValidator("param", idParamSchema),
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language, page } = c.req.valid("query");

		try {
			const movieSimilar = await tmdbClient.get("/movie/{movie_id}/similar", {
				query: { language, page },
				path: { movie_id: id },
			});
			return serveData(c, movieSimilar);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/translations",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const movieTranslations = await tmdbClient.get(
				"/movie/{movie_id}/translations",
				{
					path: { movie_id: id },
				},
			);
			return serveData(c, movieTranslations);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/videos",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const movieVideos = await tmdbClient.get("/movie/{movie_id}/videos", {
				query: { language },
				path: { movie_id: id },
			});
			return serveData(c, movieVideos);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

movieRoutes.get(
	"/:id/watch/providers",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const movieWatchProviders = await tmdbClient.get(
				"/movie/{movie_id}/watch/providers",
				{
					path: { movie_id: id },
				},
			);
			return serveData(c, movieWatchProviders);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default movieRoutes;
