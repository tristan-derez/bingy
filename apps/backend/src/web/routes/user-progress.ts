import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
	media,
	tvShowProgress,
	tvShowWatchHistory,
	watchlist,
} from "../../db/schemas/list";
import { activity, type User, users } from "../../db/schemas/user";
import { db } from "../../lib/database";
import { logger } from "../../lib/logger";
import { TmdbError, tmdbClient } from "../../lib/tmdb/tmdb-client";
import { getOrCreateMedia } from "../../web/utils/create-update-media";
import {
	getAbsoluteFromSeasonEpisode,
	getNextEpisodesForProgress,
	getSeasonsAfterEpisode,
} from "../../web/utils/tv-helper";

type Variables = {
	user: User | null;
	session: unknown;
};

// statuses shown in the in-progress list
const IN_PROGRESS_STATUSES = [
	"watching",
	"on_hold",
	"dropped",
	"completed",
] as const;

// tmdb statuses for a show that will not air any more episodes
const isEndedShow = (tmdbStatus: string) =>
	tmdbStatus === "Ended" || tmdbStatus === "Canceled";
type InProgressStatus = (typeof IN_PROGRESS_STATUSES)[number];
const IN_PROGRESS_STATUS_FILTERS = ["all", ...IN_PROGRESS_STATUSES] as const;

const userProgressRoutes = new Hono<{ Variables: Variables }>();

// get all tv shows with pending episodes for a user
userProgressRoutes.get(
	"/:username/tv",
	zValidator(
		"query",
		z.object({
			language: z.string().default("en-US"),
			limit: z.coerce.number().int().min(1).max(100).default(24),
			page: z.coerce.number().int().min(1).default(1),
			status: z.enum(IN_PROGRESS_STATUS_FILTERS).default("all"),
		}),
	),
	async (c) => {
		const { username } = c.req.param();
		const { language, limit, page, status: statusQuery } = c.req.valid("query");
		const offset = (page - 1) * limit;

		const statuses: InProgressStatus[] =
			statusQuery === "all"
				? [...IN_PROGRESS_STATUSES]
				: [statusQuery as InProgressStatus];

		const targetUser = await db.query.users.findFirst({
			where: eq(users.name, username),
		});

		if (!targetUser) return c.json("USER_NOT_FOUND", 404);

		const filters = and(
			eq(tvShowProgress.userId, targetUser.id),
			eq(media.mediaType, "tv"),
			inArray(tvShowProgress.status, statuses),
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

							// show has ended and nothing is left to watch: it is completed
							let status = item.progress.status;
							if (
								status === "watching" &&
								nextEpisodes.length === 0 &&
								isEndedShow(tvDetails.status)
							) {
								status = "completed";
								await db
									.update(tvShowProgress)
									.set({ status, updatedAt: new Date() })
									.where(eq(tvShowProgress.id, item.progress.id));
							}

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
									status,
									createdAt: item.progress.createdAt,
									updatedAt: item.progress.updatedAt,
								},
								nextEpisodes,
							};
						} catch (error) {
							if (error instanceof TmdbError && error.status === 404)
								return null;
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
	},
);

// get a tv show progress from an user by username - returns null if not in progress
userProgressRoutes.get("/:username/tv/:tmdbId", async (c) => {
	const { username, tmdbId } = c.req.param();
	const tmdbIdNumber = Number(tmdbId);
	if (!Number.isInteger(tmdbIdNumber))
		return c.json({ error: "INVALID_TMDB_ID" }, 400);

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) return c.json("USER_NOT_FOUND", 404);

	try {
		const [row] = await db
			.select({ progress: tvShowProgress })
			.from(tvShowProgress)
			.innerJoin(media, eq(tvShowProgress.mediaId, media.id))
			.where(
				and(
					eq(tvShowProgress.userId, targetUser.id),
					eq(media.mediaType, "tv"),
					eq(media.tmdbId, tmdbIdNumber),
				),
			)
			.limit(1);

		return c.json(row?.progress ?? null);
	} catch (error) {
		logger.error(error);
		return c.json({ error: "Failed to fetch TV progress" }, 500);
	}
});

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
			status: z.enum(["watching", "on_hold", "dropped"]).optional(),
		}),
	),
	async (c) => {
		const user = c.get("user");
		if (!user) return c.json({ error: "UNAUTHORIZED" }, 401);

		const data = c.req.valid("json");
		const { seasonNumber, episodeNumber } = data;

		if (seasonNumber === undefined || episodeNumber === undefined) {
			return c.json({ error: "SEASON_AND_EPISODE_REQUIRED" }, 400);
		}

		const language = c.req.query("language") || "en-US";
		const trackingMode = data.trackingMode ?? "season";
		const watchedAt = data.watchedAt ? new Date(data.watchedAt) : new Date();

		try {
			const absoluteEpisode =
				trackingMode === "absolute"
					? await getAbsoluteFromSeasonEpisode(
							data.tmdbId,
							seasonNumber,
							episodeNumber,
							language,
						)
					: null;

			// marking the final episode of an ended show completes it
			let autoStatus: "completed" | undefined;
			if (!data.status) {
				try {
					const tvDetails = await tmdbClient.get("/tv/{series_id}", {
						query: { language },
						path: { series_id: data.tmdbId },
					});
					if (
						isEndedShow(tvDetails.status) &&
						getSeasonsAfterEpisode(
							tvDetails.seasons,
							seasonNumber,
							episodeNumber,
						).length === 0
					) {
						autoStatus = "completed";
					}
				} catch (error) {
					logger.error(error);
				}
			}

			const progress = await db.transaction(async (tx) => {
				const mediaId = await getOrCreateMedia(tx, data.tmdbId, "tv");

				const [entry] = await tx
					.insert(tvShowProgress)
					.values({
						userId: user.id,
						mediaId,
						lastWatchedSeason: seasonNumber,
						lastWatchedEpisode: episodeNumber,
						absoluteEpisode,
						trackingMode,
						status: data.status ?? autoStatus ?? "watching",
					})
					.onConflictDoUpdate({
						target: [tvShowProgress.userId, tvShowProgress.mediaId],
						set: {
							lastWatchedSeason: seasonNumber,
							lastWatchedEpisode: episodeNumber,
							absoluteEpisode,
							trackingMode,
							// only change status when explicitly provided
							...(data.status
								? { status: data.status }
								: autoStatus
									? { status: autoStatus }
									: {}),
							updatedAt: new Date(),
						},
					})
					.returning();

				if (!entry) throw new Error("FAILED_UPSERT_TV_PROGRESS");

				return entry;
			});

			return c.json(progress, 201);
		} catch (error) {
			logger.error(error);
			return c.json({ error: "Failed to update TV progress" }, 500);
		}
	},
);

export default userProgressRoutes;
