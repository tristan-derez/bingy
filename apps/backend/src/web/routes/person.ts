import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";
import {
	idParamSchema,
	languageQuerySchema,
	paginationQuerySchema,
} from "#schemas/queries-params";

const personRoutes = new Hono();

personRoutes.get(
	"/popular",
	zValidator("query", paginationQuerySchema),
	async (c) => {
		const { language, page } = c.req.valid("query");

		try {
			const personPopular = await tmdbClient.get("/person/popular", {
				query: { language, page },
			});
			return serveData(c, personPopular);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

personRoutes.get("/latest", async (c) => {
	try {
		const person = await tmdbClient.get("/person/latest");
		return serveData(c, person);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

personRoutes.get(
	"/:id",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

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
	},
);

personRoutes.get(
	"/:id/combined_credits",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

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
	},
);

personRoutes.get(
	"/:id/external_ids",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

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
	},
);

personRoutes.get(
	"/:id/images",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const personImages = await tmdbClient.get("/person/{person_id}/images", {
				path: { person_id: id },
			});
			return serveData(c, personImages);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

personRoutes.get(
	"/:id/movie_credits",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

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
	},
);

personRoutes.get(
	"/:id/tv_credits",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

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
	},
);

personRoutes.get(
	"/:id/translations",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

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
	},
);

export default personRoutes;
