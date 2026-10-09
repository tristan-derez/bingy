import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { media, tvShowProgress } from "../../db/schemas/list";
import { type User, users } from "../../db/schemas/user";
import { db } from "../../lib/database";
import { logger } from "../../lib/logger";
import { TmdbError, tmdbClient } from "../../lib/tmdb/tmdb-client";
import { sessionMiddleware } from "../../web/middlewares/session";
import { getNextEpisodesForProgress } from "../../web/utils/tv-helper";

type Variables = {
	user: User | null;
	session: unknown;
};

const userProgressRoutes = new Hono<{ Variables: Variables }>();

userProgressRoutes.use("*", sessionMiddleware);

// get all tv shows with pending episodes for a user
userProgressRoutes.get("/:username/tv", async (c) => {
	const { username } = c.req.param();
	const language = c.req.query("language") || "en-US";
	const limitQuery = c.req.query("limit") || 24;
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const limit = Number(limitQuery);
	const offset = (page - 1) * limit;

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) return c.json("USER_NOT_FOUND", 404);

	const filters = and(
		eq(tvShowProgress.userId, targetUser.id),
		eq(media.mediaType, "tv"),
	);

	try {
		const [dbItems, totalCountResult] = await Promise.all([
			db
				.select({
					progress: tvShowProgress,
					media: media,
				})
				.from(tvShowProgress)
				.innerJoin(media, eq(tvShowProgress.mediaId, media.id))
				.where(filters)
				.orderBy(desc(tvShowProgress.updatedAt))
				.limit(limit)
				.offset(offset),

			db
				.select({ count: sql<number>`count(*)` })
				.from(tvShowProgress)
				.innerJoin(media, eq(tvShowProgress.mediaId, media.id))
				.where(filters),
		]);

		const totalResults = Number(totalCountResult[0]?.count ?? 0);

		const hydratedData = (
			await Promise.all(
				dbItems.map(async (item) => {
					try {
						const tvDetails = await tmdbClient.get("/tv/{series_id}", {
							query: { language },
							path: { series_id: item.media.tmdbId },
						});

						const nextEpisodes = await getNextEpisodesForProgress(
							item.media.tmdbId,
							tvDetails,
							language,
							item.progress,
						);

						return {
							id: tvDetails.id,
							name: tvDetails.name,
							original_name: tvDetails.original_name,
							poster_path: tvDetails.poster_path,
							status: tvDetails.status,
							tagline: tvDetails.tagline,
							last_episode_to_air: tvDetails.last_episode_to_air,
							number_of_seasons: tvDetails.number_of_seasons,
							number_of_episodes: tvDetails.number_of_episodes,
							progress: {
								id: item.progress.id,
								lastWatchedSeason: item.progress.lastWatchedSeason,
								lastWatchedEpisode: item.progress.lastWatchedEpisode,
								absoluteEpisode: item.progress.absoluteEpisode,
								trackingMode: item.progress.trackingMode,
								status: item.progress.status,
								createdAt: item.progress.createdAt,
								updatedAt: item.progress.updatedAt,
							},
							nextEpisodes,
						};
					} catch (error) {
						if (error instanceof TmdbError && error.status === 404) return null;
						throw error;
					}
				}),
			)
		).filter((item) => item !== null);

		return c.json({
			data: hydratedData,
			page,
			total_pages: Math.ceil(totalResults / limit),
			total_results: totalResults,
		});
	} catch (error) {
		logger.error(error);
		return c.json({ error: "Failed to fetch TV progress" }, 500);
	}
});

// get a tv show progress from an user by username
userProgressRoutes.get("/:username/tv/:tmdbId", async (c) => {});

// create entry in progress for tv - seasonNumber and episodeNumber are the last episode the user watched
// user must be logged in
userProgressRoutes.post(
	"/tv",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.iso.datetime().optional(),
			seasonNumber: z.number().min(1).optional(),
			episodeNumber: z.number().min(1).optional(),
			absoluteEpisode: z.number().optional(),
			trackingMode: z.enum(["season", "absolute"]).optional(),
		}),
	),
	async (c) => {},
);

export default userProgressRoutes;
