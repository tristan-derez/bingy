import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
	favorites,
	media,
	movieWatchHistory,
	tvSeasons,
	tvShowProgress,
	tvShowWatchHistory,
	watchlist,
} from "../../db/schemas/list";
import type { User } from "../../db/schemas/user";
import { activity, users } from "../../db/schemas/user";
import { db } from "../../lib/database";
import { getMediaDetails } from "../../lib/tmdb/get-media-details";
import { getTvDetails } from "../../lib/tmdb/get-tv-details";
import { tmdbClient } from "../../lib/tmdb/tmdb.client";
import { sessionMiddleware } from "../../web/middlewares/session";
import { convertAbsoluteToSeasonEpisode } from "../../web/utils/absolute-to-season-episode";
import { getOrCreateMedia } from "../../web/utils/create-update-media";
import { updateMediaRating } from "../../web/utils/media-rating";

type Variables = {
	user: User | null;
	session: unknown;
};

const userHistoryRoutes = new Hono<{ Variables: Variables }>();

userHistoryRoutes.use("*", sessionMiddleware);

// rate a movie
// user must be logged in
userHistoryRoutes.post(
	"/movie",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			rating: z.number().min(0.5).max(5).nullable(),
			review: z.string().nullable(),
			watchedAt: z.coerce.date().nullable(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			const mediaId = await getOrCreateMedia(tx, data.tmdbId, "movie");

			const [watchEntry] = await tx
				.insert(movieWatchHistory)
				.values({
					userId: user.id,
					mediaId,
					rating: data.rating?.toString() ?? null,
					review: data.review ?? null,
					watchedAt: data.watchedAt ?? null,
				})
				.onConflictDoUpdate({
					target: [movieWatchHistory.userId, movieWatchHistory.mediaId],
					set: {
						rating: data.rating?.toString() ?? null,
						review: data.review ?? null,
						watchedAt: data.watchedAt ?? null,
						loggedAt: sql`now()`,
					},
				})
				.returning();

			await updateMediaRating(tx, mediaId);

			// Remove from watchlist if exists
			await tx
				.delete(watchlist)
				.where(
					and(eq(watchlist.userId, user.id), eq(watchlist.mediaId, mediaId)),
				);

			// add to activity
			await tx.insert(activity).values({
				userId: user.id,
				activityType: "watched_movie",
				movieWatchHistoryId: watchEntry.id,
			});

			return watchEntry;
		});

		return c.json(entry, 201);
	},
);

// rate a tv show
// user must be logged in
userHistoryRoutes.post(
	"/tv",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			rating: z.number().min(0.5).max(5).nullable(),
			review: z.string().nullable(),
			lastWatchedSeason: z.number().nullable(),
			lastWatchedEpisode: z.number().nullable(),
			absoluteEpisode: z.number().nullable(),
			trackingMode: z.enum(["absolute", "season"]).nullable(),
			watchedAt: z.coerce.date().nullable(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		let lastWatchedSeason = data.lastWatchedSeason;
		let lastWatchedEpisode = data.lastWatchedEpisode;

		// find the corresponding season and episode when user rate a tv show with absolute episode instead of traditionnal season/episode
		if (data.absoluteEpisode && !lastWatchedSeason && !lastWatchedEpisode) {
			const tvDetails = await tmdbClient.get("/tv/{series_id}", {
				query: {},
				path: { series_id: data.tmdbId },
			});

			const result = convertAbsoluteToSeasonEpisode(
				data.absoluteEpisode,
				tvDetails.seasons,
			);

			lastWatchedSeason = result.season;
			lastWatchedEpisode = result.episode;
		}

		const entry = await db.transaction(async (tx) => {
			const mediaId = await getOrCreateMedia(tx, data.tmdbId, "tv");

			const [watchEntry] = await tx
				.insert(tvShowWatchHistory)
				.values({
					userId: user.id,
					mediaId,
					rating: data.rating?.toString() ?? null,
					review: data.review ?? null,
					watchedAt: data.watchedAt ?? null,
				})
				.onConflictDoUpdate({
					target: [tvShowWatchHistory.userId, tvShowWatchHistory.mediaId],
					set: {
						rating: data.rating?.toString() ?? null,
						review: data.review ?? null,
						watchedAt: data.watchedAt ?? null,
					},
				})
				.returning();

			// add to tv show progress
			if (lastWatchedSeason && lastWatchedEpisode) {
				await tx
					.insert(tvShowProgress)
					.values({
						userId: user.id,
						mediaId,
						lastWatchedSeason,
						lastWatchedEpisode,
						absoluteEpisode: data.absoluteEpisode ?? null,
						trackingMode: data.trackingMode ?? "season",
					})
					.onConflictDoUpdate({
						target: [tvShowProgress.userId, tvShowProgress.mediaId],
						set: {
							lastWatchedSeason: lastWatchedSeason,
							lastWatchedEpisode: lastWatchedEpisode,
							absoluteEpisode: data.absoluteEpisode ?? null,
							trackingMode: data.trackingMode ?? "season",
							updatedAt: new Date(),
						},
					});
			}

			await updateMediaRating(tx, mediaId);

			// Remove from watchlist if exists
			await tx
				.delete(watchlist)
				.where(
					and(eq(watchlist.userId, user.id), eq(watchlist.mediaId, mediaId)),
				);

			// add to activity
			await tx.insert(activity).values({
				userId: user.id,
				activityType: "watched_show",
				tvShowWatchHistoryId: watchEntry.id,
			});

			return watchEntry;
		});

		return c.json(entry, 201);
	},
);

// create entry in progress for tv - seasonNumber and episodeNumber are the last episode the user watched
// user must be logged in
userHistoryRoutes.post(
	"/progress/tv",
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
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			const mediaId = await getOrCreateMedia(tx, data.tmdbId, "tv");

			let watchEntry;
			if (
				data.rating !== undefined ||
				data.review !== undefined ||
				data.watchedAt !== undefined
			) {
				[watchEntry] = await tx
					.insert(tvShowWatchHistory)
					.values({
						userId: user.id,
						mediaId,
						rating: data.rating?.toString(),
						review: data.review,
						watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
					})
					.onConflictDoUpdate({
						target: [tvShowWatchHistory.userId, tvShowWatchHistory.mediaId],
						set: {
							rating: data.rating?.toString(),
							review: data.review,
							watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
						},
					})
					.returning();

				if (data.rating) {
					await updateMediaRating(tx, mediaId);
				}
			}

			let progressEntry;
			if (data.seasonNumber !== undefined && data.episodeNumber !== undefined) {
				const season = await tx.query.tvSeasons.findFirst({
					where: and(
						eq(tvSeasons.mediaId, mediaId),
						eq(tvSeasons.seasonNumber, data.seasonNumber),
					),
				});

				if (!season || data.episodeNumber! > season.episodeCount) {
					throw new Error("Episode does not exist");
				}

				[progressEntry] = await tx
					.insert(tvShowProgress)
					.values({
						userId: user.id,
						mediaId,
						lastWatchedSeason: data.seasonNumber,
						lastWatchedEpisode: data.episodeNumber,
						absoluteEpisode: data.absoluteEpisode,
						trackingMode: data.trackingMode ?? "season",
					})
					.onConflictDoUpdate({
						target: [tvShowProgress.userId, tvShowProgress.mediaId],
						set: {
							lastWatchedSeason: data.seasonNumber,
							lastWatchedEpisode: data.episodeNumber,
							absoluteEpisode: data.absoluteEpisode,
							trackingMode: data.trackingMode ?? "season",
							updatedAt: sql`NOW()`,
						},
					})
					.returning();
			}

			if (watchEntry) {
				await tx.insert(activity).values({
					userId: user.id,
					activityType: "watched_show",
					tvShowWatchHistoryId: watchEntry.id,
				});
			}

			return {
				watchEntry,
				progressEntry,
			};
		});

		return c.json(entry, 201);
	},
);

// get a movie rating from an user by username
userHistoryRoutes.get(
	"/:username/movie/:tmdbId",
	zValidator(
		"param",
		z.object({
			username: z.string(),
			tmdbId: z.coerce.number(),
		}),
	),
	async (c) => {
		const { username, tmdbId } = c.req.valid("param");

		const targetUser = await db.query.users.findFirst({
			where: eq(users.name, username),
		});

		if (!targetUser) return c.json("User not found", 404);

		const [entry] = await db
			.select({
				rating: movieWatchHistory.rating,
				review: movieWatchHistory.review,
				watchedAt: movieWatchHistory.watchedAt,
			})
			.from(movieWatchHistory)
			.innerJoin(media, eq(media.id, movieWatchHistory.mediaId))
			.where(
				and(
					eq(movieWatchHistory.userId, targetUser.id),
					eq(media.tmdbId, tmdbId),
					eq(media.mediaType, "movie"),
				),
			)
			.orderBy(desc(movieWatchHistory.loggedAt))
			.limit(1);

		return c.json(entry ?? null, 200);
	},
);

// get a tv show rating from an user by username
userHistoryRoutes.get(
	"/:username/tv/:tmdbId",
	zValidator(
		"param",
		z.object({
			username: z.string(),
			tmdbId: z.coerce.number(),
		}),
	),
	async (c) => {
		const { username, tmdbId } = c.req.valid("param");

		const targetUser = await db.query.users.findFirst({
			where: eq(users.name, username),
		});

		if (!targetUser) return c.json("User not found", 404);

		const [entry] = await db
			.select({
				rating: tvShowWatchHistory.rating,
				review: tvShowWatchHistory.review,
				watchedAt: tvShowWatchHistory.watchedAt,
				seasonNumber: tvShowProgress.lastWatchedSeason,
				episodeNumber: tvShowProgress.lastWatchedEpisode,
				absoluteEpisode: tvShowProgress.absoluteEpisode,
			})
			.from(tvShowWatchHistory)
			.innerJoin(media, eq(media.id, tvShowWatchHistory.mediaId))
			.leftJoin(
				tvShowProgress,
				and(
					eq(tvShowProgress.mediaId, media.id),
					eq(tvShowProgress.userId, targetUser.id),
				),
			)
			.where(
				and(
					eq(tvShowWatchHistory.userId, targetUser.id),
					eq(media.tmdbId, tmdbId),
					eq(media.mediaType, "tv"),
				),
			);

		return c.json(entry, 200);
	},
);

// get a tv show progress from an user by username
// @todo: get every tv shows progress
userHistoryRoutes.get("/:username/tv/progress/:tmdbId", async (c) => {
	const { username } = c.req.param();
	const tmdbId = Number(c.req.param("tmdbId"));

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) return c.json("User not found", 404);

	const mediaEntry = await db.query.media.findFirst({
		where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, "tv")),
	});

	if (!mediaEntry) {
		return c.json({ progress: null, seasons: [] });
	}

	const [progress, seasons] = await Promise.all([
		db.query.tvShowProgress.findFirst({
			where: and(
				eq(tvShowProgress.userId, targetUser.id),
				eq(tvShowProgress.mediaId, mediaEntry.id),
			),
		}),
		db.query.tvSeasons.findMany({
			where: eq(tvSeasons.mediaId, mediaEntry.id),
			orderBy: [tvSeasons.seasonNumber],
		}),
	]);

	return c.json({ progress, seasons });
});

// get media history from an user by username
userHistoryRoutes.get("/:username", async (c) => {
	const { username } = c.req.param();
	const language = c.req.query("language") || "en-US";
	const limitQuery = c.req.query("limit") || 48;
	const page = Math.max(1, Number(c.req.query("page") || 1));
	const mediaTypeFilter = c.req.query("mediaType") as
		| "movie"
		| "tv"
		| undefined;

	const limit = Number(limitQuery);
	const offset = (page - 1) * limit;

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) return c.json("User not found", 404);

	const movieQuery = db
		.select({
			mediaId: media.id,
			tmdbId: media.tmdbId,
			mediaType: sql<"movie" | "tv">`'movie'`.as("media_type"),
			watchedAt: movieWatchHistory.watchedAt,
			rating: movieWatchHistory.rating,
		})
		.from(movieWatchHistory)
		.innerJoin(media, eq(movieWatchHistory.mediaId, media.id))
		.where(eq(movieWatchHistory.userId, targetUser.id));

	const tvQuery = db
		.select({
			mediaId: media.id,
			tmdbId: media.tmdbId,
			mediaType: sql<"movie" | "tv">`'tv'`.as("media_type"),
			watchedAt: tvShowWatchHistory.watchedAt,
			rating: tvShowWatchHistory.rating,
		})
		.from(tvShowWatchHistory)
		.innerJoin(media, eq(tvShowWatchHistory.mediaId, media.id))
		.where(eq(tvShowWatchHistory.userId, targetUser.id));

	let entries;
	if (mediaTypeFilter === "movie") {
		entries = await movieQuery
			.orderBy(desc(movieWatchHistory.watchedAt))
			.limit(limit)
			.offset(offset);
	} else if (mediaTypeFilter === "tv") {
		entries = await tvQuery
			.orderBy(desc(tvShowWatchHistory.watchedAt))
			.limit(limit)
			.offset(offset);
	} else {
		entries = await db
			.select()
			.from(movieQuery.as("m"))
			.unionAll(db.select().from(tvQuery.as("t")))
			.orderBy(desc(sql`watched_at`))
			.limit(limit)
			.offset(offset);
	}

	const [movieCount, tvCount] = await Promise.all([
		!mediaTypeFilter || mediaTypeFilter === "movie"
			? db
					.select({ count: sql<number>`count(*)` })
					.from(movieWatchHistory)
					.where(eq(movieWatchHistory.userId, targetUser.id))
			: [{ count: 0 }],
		!mediaTypeFilter || mediaTypeFilter === "tv"
			? db
					.select({ count: sql<number>`count(*)` })
					.from(tvShowWatchHistory)
					.where(eq(tvShowWatchHistory.userId, targetUser.id))
			: [{ count: 0 }],
	]);

	const totalResults = Number(movieCount[0].count) + Number(tvCount[0].count);

	const tvMediaIds = entries
		.filter((e) => e.mediaType === "tv")
		.map((e) => e.mediaId);
	const progressByMediaId = new Map();

	if (tvMediaIds.length > 0) {
		const progress = await db
			.select()
			.from(tvShowProgress)
			.where(
				and(
					eq(tvShowProgress.userId, targetUser.id),
					inArray(tvShowProgress.mediaId, tvMediaIds),
				),
			);
		progress.forEach((p) => progressByMediaId.set(p.mediaId, p));
	}

	const hydratedData = (
		await Promise.all(
			entries.map(async (entry) => {
				const details = await getMediaDetails(
					entry.tmdbId,
					entry.mediaType,
					language,
				);
				if (!details) return null;
				return {
					...details,
					mediaType: entry.mediaType,
					watchedAt: entry.watchedAt,
					rating: entry.rating,
					progress:
						entry.mediaType === "tv"
							? (progressByMediaId.get(entry.mediaId) ?? null)
							: null,
				};
			}),
		)
	).filter(Boolean);

	return c.json({
		data: hydratedData,
		page,
		total_pages: Math.ceil(totalResults / limit),
		total_results: totalResults,
	});
});

// get all tv shows with pending episodes for a user
userHistoryRoutes.get("/:username/tv/progress", async (c) => {
	const { username } = c.req.param();
	const language = c.req.query("language") || "en-US";

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) return c.json("User not found", 404);

	const progressEntries = await db
		.select({
			mediaId: media.id,
			tmdbId: media.tmdbId,
			lastWatchedSeason: tvShowProgress.lastWatchedSeason,
			lastWatchedEpisode: tvShowProgress.lastWatchedEpisode,
			absoluteEpisode: tvShowProgress.absoluteEpisode,
			trackingMode: tvShowProgress.trackingMode,
		})
		.from(tvShowProgress)
		.innerJoin(media, eq(tvShowProgress.mediaId, media.id))
		.where(eq(tvShowProgress.userId, targetUser.id));

	const hydratedData = (
		await Promise.all(
			progressEntries.map(async (entry) => {
				const details = await getTvDetails(entry.tmdbId, language);
				if (!details) return null;

				// Absolute tracking mode
				if (
					entry.trackingMode === "absolute" &&
					entry.absoluteEpisode !== null
				) {
					const remainingEpisodes =
						details.numberOfEpisodes - entry.absoluteEpisode;
					if (remainingEpisodes <= 0) return null;

					return {
						...details,
						mediaType: "tv" as const,
						lastWatchedEpisode: entry.absoluteEpisode,
						totalEpisodes: details.numberOfEpisodes,
						remainingEpisodes,
						trackingMode: "absolute" as const,
					};
				}

				// Season/episode tracking mode
				const lastAiredSeasonNumber = details.lastEpisodeToAir?.seasonNumber;
				if (!lastAiredSeasonNumber) return null;

				const lastAiredSeason = details.seasons.find(
					(s) => s.seasonNumber === lastAiredSeasonNumber,
				);
				if (!lastAiredSeason) return null;

				const hasPendingEpisodes =
					lastAiredSeasonNumber > entry.lastWatchedSeason ||
					(lastAiredSeasonNumber === entry.lastWatchedSeason &&
						lastAiredSeason.episodeCount > entry.lastWatchedEpisode);

				if (!hasPendingEpisodes) return null;

				// Calculate remaining episodes up to last aired season
				let remainingEpisodes = 0;

				for (const season of details.seasons) {
					if (
						season.seasonNumber === 0 ||
						season.seasonNumber > lastAiredSeasonNumber
					)
						continue;

					if (season.seasonNumber > entry.lastWatchedSeason) {
						remainingEpisodes += season.episodeCount;
					} else if (season.seasonNumber === entry.lastWatchedSeason) {
						remainingEpisodes += season.episodeCount - entry.lastWatchedEpisode;
					}
				}

				return {
					...details,
					mediaType: "tv" as const,
					lastWatchedSeason: entry.lastWatchedSeason,
					lastWatchedEpisode: entry.lastWatchedEpisode,
					lastAiredSeason: lastAiredSeasonNumber,
					lastAiredEpisode: lastAiredSeason.episodeCount,
					remainingEpisodes,
					trackingMode: "season" as const,
				};
			}),
		)
	).filter(Boolean);

	return c.json({ data: hydratedData });
});

// delete movie from history and delete rating/favorites associated to it
// user must be logged in
userHistoryRoutes.delete("/movie/:tmdbId", async (c) => {
	const user = c.get("user")!;
	const tmdbId = Number.parseInt(c.req.param("tmdbId"));

	const mediaEntry = await db.query.media.findFirst({
		where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, "movie")),
	});

	if (!mediaEntry) {
		return c.json({ error: "Media not found" }, 404);
	}

	const watchEntry = await db.query.movieWatchHistory.findFirst({
		where: and(
			eq(movieWatchHistory.userId, user.id),
			eq(movieWatchHistory.mediaId, mediaEntry.id),
		),
	});

	if (!watchEntry) {
		return c.json({ error: "Watch history entry not found" }, 404);
	}

	// delete movie watch history/rating/favorites
	await db.transaction(async (tx) => {
		await tx
			.delete(movieWatchHistory)
			.where(eq(movieWatchHistory.id, watchEntry.id));

		await tx
			.delete(favorites)
			.where(
				and(
					eq(favorites.userId, user.id),
					eq(favorites.mediaId, mediaEntry.id),
				),
			);

		await updateMediaRating(tx, mediaEntry.id);
	});

	return c.body(null, 204);
});

// delete tv show from history and the rating/favorites associated to it
// user must be logged in
userHistoryRoutes.delete("/tv/:tmdbId", async (c) => {
	const user = c.get("user")!;
	const tmdbId = Number.parseInt(c.req.param("tmdbId"));

	const mediaEntry = await db.query.media.findFirst({
		where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, "tv")),
	});

	if (!mediaEntry) {
		return c.json({ error: "Media not found" }, 404);
	}

	const watchEntry = await db.query.tvShowWatchHistory.findFirst({
		where: and(
			eq(tvShowWatchHistory.userId, user.id),
			eq(tvShowWatchHistory.mediaId, mediaEntry.id),
		),
	});

	const showProgress = await db.query.tvShowProgress.findFirst({
		where: and(
			eq(tvShowProgress.userId, user.id),
			eq(tvShowProgress.mediaId, mediaEntry.id),
		),
	});

	const entry = watchEntry ?? showProgress;

	if (!entry) {
		return c.json({ error: "Entry not found" }, 404);
	}

	// delete tv show watch history/show progress/rating/favorite
	await db.transaction(async (tx) => {
		await tx
			.delete(tvShowWatchHistory)
			.where(eq(tvShowWatchHistory.id, entry.id));

		await tx.delete(tvShowProgress).where(eq(tvShowProgress.id, entry.id));

		await tx
			.delete(favorites)
			.where(
				and(
					eq(favorites.userId, user.id),
					eq(favorites.mediaId, mediaEntry.id),
				),
			);

		await updateMediaRating(tx, mediaEntry.id);
	});

	return c.body(null, 204);
});

// update a movie entry from history
// user must be logged in
userHistoryRoutes.patch(
	"/movie/:tmdbId",
	zValidator(
		"param",
		z.object({
			tmdbId: z.coerce.number(),
		}),
	),
	zValidator(
		"json",
		z.object({
			rating: z.number().min(0.5).max(5.0).nullable(),
			review: z.string().nullable(),
			watchedAt: z.coerce.date().nullable(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { tmdbId } = c.req.valid("param");
		const data = c.req.valid("json");

		const mediaEntry = await db.query.media.findFirst({
			where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, "movie")),
		});

		if (!mediaEntry) {
			return c.json({ error: "Media not found" }, 404);
		}

		const entry = await db.query.movieWatchHistory.findFirst({
			where: and(
				eq(movieWatchHistory.userId, user.id),
				eq(movieWatchHistory.mediaId, mediaEntry.id),
			),
		});

		if (!entry) {
			return c.json(
				{ error: "Watch history entry not found or unauthorized" },
				404,
			);
		}

		const updated = await db.transaction(async (tx) => {
			const [updatedEntry] = await tx
				.update(movieWatchHistory)
				.set({
					rating: data.rating?.toString() ?? null,
					review: data.review ?? null,
					watchedAt: data.watchedAt ?? null,
				})
				.where(eq(movieWatchHistory.id, entry.id))
				.returning();

			await updateMediaRating(tx, mediaEntry.id);

			return updatedEntry;
		});

		return c.json(updated, 200);
	},
);

// update a tv entry
// user must be logged in
userHistoryRoutes.patch(
	"/tv/:tmdbId",
	zValidator(
		"param",
		z.object({
			tmdbId: z.coerce.number(),
		}),
	),
	zValidator(
		"json",
		z.object({
			rating: z.number().min(0.5).max(5.0).nullable(),
			review: z.string().nullable(),
			watchedAt: z.coerce.date().nullable(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { tmdbId } = c.req.valid("param");
		const data = c.req.valid("json");

		const mediaEntry = await db.query.media.findFirst({
			where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, "tv")),
		});

		if (!mediaEntry) {
			return c.json({ error: "Media not found" }, 404);
		}

		const entry = await db.query.tvShowWatchHistory.findFirst({
			where: and(
				eq(tvShowWatchHistory.userId, user.id),
				eq(tvShowWatchHistory.mediaId, mediaEntry.id),
			),
		});

		if (!entry) {
			return c.json(
				{ error: "Watch history entry not found or unauthorized" },
				404,
			);
		}

		const updated = await db.transaction(async (tx) => {
			const [updatedEntry] = await tx
				.update(tvShowWatchHistory)
				.set({
					rating: data.rating?.toString() ?? null,
					review: data.review ?? null,
					watchedAt: data.watchedAt ?? null,
				})
				.where(eq(tvShowWatchHistory.id, entry.id))
				.returning();

			await updateMediaRating(tx, mediaEntry.id);

			return updatedEntry;
		});

		return c.json(updated, 200);
	},
);

export default userHistoryRoutes;
