import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { tmdbClient } from "#lib/tmdb/tmdb.client";
import {
	idParamSchema,
	languageQuerySchema,
} from "#web/validators/query-param";

const collectionRoutes = new Hono();

collectionRoutes.get(
	"/:id",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get("/collection/{collection_id}", {
				query: { language },
				path: { collection_id: id },
			});
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

collectionRoutes.get(
	"/:id/images",
	zValidator("param", idParamSchema),
	zValidator("query", languageQuerySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { language } = c.req.valid("query");

		try {
			const results = await tmdbClient.get(
				"/collection/{collection_id}/images",
				{
					query: { language },
					path: { collection_id: id },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

collectionRoutes.get(
	"/:id/translations",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const results = await tmdbClient.get(
				"/collection/{collection_id}/translations",
				{
					path: { collection_id: id },
				},
			);
			return serveData(c, results);
		} catch (error) {
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default collectionRoutes;
