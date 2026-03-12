import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod";
import { media } from "../../db/schemas/list";
import { db } from "../../lib/database";

const ratingRoutes = new Hono();

ratingRoutes.get(
	"/:mediaType/:tmdbId",
	zValidator(
		"param",
		z.object({
			mediaType: z.enum(["movie", "tv"]),
			tmdbId: z.coerce.number(),
		}),
	),
	async (c) => {
		const { mediaType, tmdbId } = c.req.valid("param");

		const mediaEntry = await db.query.media.findFirst({
			where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, mediaType)),
			columns: {
				averageRating: true,
				ratingCount: true,
			},
		});

		if (!mediaEntry) {
			return c.json(undefined, 200);
		}

		return c.json(
			{
				averageRating: mediaEntry.averageRating
					? Number(mediaEntry.averageRating)
					: null,
				ratingCount: mediaEntry.ratingCount,
			},
			200,
		);
	},
);

export default ratingRoutes;
