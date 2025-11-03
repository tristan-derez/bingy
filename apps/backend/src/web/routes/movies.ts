import { type Context, Hono } from "hono";
import { logger } from "#lib/logger";
import {
	serveBadRequest,
	serveInternalServerError,
} from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";

const moviesRoutes = new Hono();

moviesRoutes.get("/:id", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/alternative_titles", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const country = c.req.query("country") ?? "";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/credits", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/external_ids", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/images", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/keywords", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

	try {
		const movieKeywords = await tmdbClient.get("/movie/{movie_id}/keywords", {
			path: { movie_id: id },
		});
		return serveData(c, movieKeywords);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

moviesRoutes.get("/latest", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

	try {
		const movie = await tmdbClient.get("/movie/latest");
		return serveData(c, movie);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

moviesRoutes.get("/:id/lists", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/recommendations", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/release_dates", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/reviews", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/similar", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/translations", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/videos", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/:id/watch/providers", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid movie ID");

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
});

moviesRoutes.get("/now_playing", async (c: Context) => {
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;
	const region = c.req.query("region") ?? "";

	try {
		const movieNowPlaying = await tmdbClient.get("/movie/now_playing", {
			query: { language, region, page },
		});
		return serveData(c, movieNowPlaying);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

moviesRoutes.get("/popular", async (c: Context) => {
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;
	const region = c.req.query("region") ?? "";

	try {
		const moviePopular = await tmdbClient.get("/movie/popular", {
			query: { language, region, page },
		});
		return serveData(c, moviePopular);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

moviesRoutes.get("/top_rated", async (c: Context) => {
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;
	const region = c.req.query("region") ?? "";

	try {
		const movieTopRated = await tmdbClient.get("/movie/top_rated", {
			query: { language, region, page },
		});
		return serveData(c, movieTopRated);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

moviesRoutes.get("/upcoming", async (c: Context) => {
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;
	const region = c.req.query("region") ?? "";

	try {
		const movieUpcoming = await tmdbClient.get("/movie/upcoming", {
			query: { language, region, page },
		});
		return serveData(c, movieUpcoming);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

export default moviesRoutes;
