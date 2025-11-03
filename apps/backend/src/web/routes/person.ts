import { type Context, Hono } from "hono";
import { logger } from "#lib/logger";
import {
	serveBadRequest,
	serveInternalServerError,
} from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";

const personRoutes = new Hono();

personRoutes.get("/:id", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid person ID");

	try {
		const person = await tmdbClient.get("/person/{person_id}", {
			query: { language },
			path: { person_id: id },
		});
		return serveData(c, person);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get("/:id/combined_credits", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid person ID");

	try {
		const personCombinedCredits = await tmdbClient.get(
			"/person/{person_id}/combined_credits",
			{
				query: { language },
				path: { person_id: id },
			},
		);
		return serveData(c, personCombinedCredits);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get("/:id/external_ids", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid person ID");

	try {
		const personExternalIds = await tmdbClient.get(
			"/person/{person_id}/external_ids",
			{
				path: { person_id: id },
			},
		);
		return serveData(c, personExternalIds);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get("/:id/images", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid person ID");

	try {
		const personImages = await tmdbClient.get("/person/{person_id}/images", {
			path: { person_id: id },
		});
		return serveData(c, personImages);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get("/latest", async (c: Context) => {
	try {
		const person = await tmdbClient.get("/person/latest");
		return serveData(c, person);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get("/:id/movie_credits", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid person ID");

	try {
		const personMovieCredits = await tmdbClient.get(
			"/person/{person_id}/movie_credits",
			{
				query: { language },
				path: { person_id: id },
			},
		);
		return serveData(c, personMovieCredits);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get("/:id/tv_credits", async (c: Context) => {
	const id = Number(c.req.param("id"));
	const language = c.req.query("language") ?? "en-US";

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid person ID");

	try {
		const personTvCredits = await tmdbClient.get(
			"/person/{person_id}/tv_credits",
			{
				query: { language },
				path: { person_id: id },
			},
		);
		return serveData(c, personTvCredits);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get("/:id/translations", async (c: Context) => {
	const id = Number(c.req.param("id"));

	if (Number.isNaN(id)) return serveBadRequest(c, "Invalid person ID");

	try {
		const personTranslations = await tmdbClient.get(
			"/person/{person_id}/translations",
			{
				path: { person_id: id },
			},
		);
		return serveData(c, personTranslations);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get("/popular", async (c: Context) => {
	const language = c.req.query("language") ?? "en-US";
	const page = Number(c.req.query("page")) ?? 1;

	try {
		const personPopular = await tmdbClient.get("/person/popular", {
			query: { language, page },
		});
		return serveData(c, personPopular);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

export default personRoutes;
