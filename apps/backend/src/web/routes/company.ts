import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { logger } from "#lib/logger";
import { serveInternalServerError, serveNotFound } from "#lib/responses/error";
import { serveData } from "#lib/responses/resp";
import { TmdbError, tmdbClient } from "#lib/tmdb/tmdb.client";
import { idParamSchema } from "#web/validators/query-param";

const companyRoutes = new Hono();

companyRoutes.get("/:id", zValidator("param", idParamSchema), async (c) => {
	const { id } = c.req.valid("param");

	try {
		const results = await tmdbClient.get("/company/{company_id}", {
			path: { company_id: id },
		});
		return serveData(c, results);
	} catch (error) {
		logger.error(error);
		return serveInternalServerError(c, error);
	}
});

companyRoutes.get(
	"/:id/alternative_names",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const results = await tmdbClient.get(
				"/company/{company_id}/alternative_names",
				{
					path: { company_id: id },
				},
			);
			return serveData(c, results);
		} catch (error) {
			if (error instanceof TmdbError && error.status === 404) {
				return serveNotFound(c, "Resource not found");
			}
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

companyRoutes.get(
	"/:id/images",
	zValidator("param", idParamSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		try {
			const results = await tmdbClient.get("/company/{company_id}/images", {
				path: { company_id: id },
			});
			return serveData(c, results);
		} catch (error) {
			if (error instanceof TmdbError && error.status === 404) {
				return serveNotFound(c, "Resource not found");
			}
			logger.error(error);
			return serveInternalServerError(c, error);
		}
	},
);

export default companyRoutes;
