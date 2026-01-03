import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
	media,
	movieWatchHistory,
	tvSeasons,
	tvShowProgress,
	tvShowWatchHistory,
	watchlist,
} from "#db/schemas/list";
import type { User } from "#db/schemas/user";
import { activity, users } from "#db/schemas/user";
import { db } from "#lib/database";
import { getMediaDetails } from "#lib/tmdb/get-media-details";
import { sessionMiddleware } from "#web/middlewares/session";
import { getOrCreateMedia } from "#web/utils/create-update-media";
import { updateMediaRating } from "#web/utils/media-rating";

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
			rating: z.preprocess(
				(v) => (typeof v === "string" ? Number(v) : v),
				z.number().min(0).max(5).optional(),
			),
			review: z.string().optional(),
			watchedAt: z.iso.datetime().optional(),
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
					rating: data.rating?.toString(),
					review: data.review,
					watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
				})
				.onConflictDoUpdate({
					target: [movieWatchHistory.userId, movieWatchHistory.mediaId],
					set: {
						rating: data.rating?.toString(),
						review: data.review,
						watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
						loggedAt: sql`now()`,
					},
				})
				.returning();

			if (data.rating) {
				await updateMediaRating(tx, mediaId);
			}

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
			rating: z.preprocess(
				(v) => (typeof v === "string" ? Number(v) : v),
				z.number().min(0).max(5).optional(),
			),
			review: z.string().optional(),
			lastWatchedSeason: z.number().optional(),
			lastWatchedEpisode: z.number().optional(),
			absoluteEpisode: z.number().optional(),
			watchedAt: z.iso.datetime().optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			const mediaId = await getOrCreateMedia(tx, data.tmdbId, "tv");

			const [watchEntry] = await tx
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

			if (data.lastWatchedSeason && data.lastWatchedEpisode) {
				await tx
					.insert(tvShowProgress)
					.values({
						userId: user.id,
						mediaId,
						lastWatchedSeason: data.lastWatchedSeason,
						lastWatchedEpisode: data.lastWatchedEpisode,
						absoluteEpisode: data.absoluteEpisode,
					})
					.onConflictDoUpdate({
						target: [tvShowProgress.userId, tvShowProgress.mediaId],
						set: {
							lastWatchedSeason: data.lastWatchedSeason,
							lastWatchedEpisode: data.lastWatchedEpisode,
							absoluteEpisode: data.absoluteEpisode,
							updatedAt: new Date(),
						},
					});
			}

			if (data.rating) {
				await updateMediaRating(tx, mediaId);
			}

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

// create entry in progress for tv seasonNumber and episodeNumber are the last episode the user watched
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
					})
					.onConflictDoUpdate({
						target: [tvShowProgress.userId, tvShowProgress.mediaId],
						set: {
							lastWatchedSeason: data.seasonNumber,
							lastWatchedEpisode: data.episodeNumber,
							absoluteEpisode: data.absoluteEpisode,
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
			})
			.from(tvShowWatchHistory)
			.innerJoin(media, eq(media.id, tvShowWatchHistory.mediaId))
			.where(
				and(
					eq(tvShowWatchHistory.userId, targetUser.id),
					eq(media.tmdbId, tmdbId),
					eq(media.mediaType, "tv"),
				),
			);

		return c.json(entry ?? null, 200);
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
	const page = Math.max(1, Number(c.req.query("page") || 1));
	const mediaTypeFilter = c.req.query("mediaType") as
		| "movie"
		| "tv"
		| undefined;

	const limit = 24;
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

// delete movie from history
// user must be logged in
userHistoryRoutes.delete("/movie/:id", async (c) => {
	const user = c.get("user")!;
	const { id } = c.req.param();

	const entry = await db.query.movieWatchHistory.findFirst({
		where: and(
			eq(movieWatchHistory.id, id),
			eq(movieWatchHistory.userId, user.id),
		),
	});

	if (!entry) {
		return c.json(
			{ error: "Watch history entry not found or unauthorized" },
			404,
		);
	}

	await db.transaction(async (tx) => {
		await tx.delete(movieWatchHistory).where(eq(movieWatchHistory.id, id));

		const allRatings = await tx.query.movieWatchHistory.findMany({
			where: eq(movieWatchHistory.mediaId, entry.mediaId),
			columns: { rating: true },
		});

		const ratings = allRatings
			.map((r) => (r.rating ? parseFloat(r.rating) : null))
			.filter((r): r is number => r !== null);

		const avgRating =
			ratings.length > 0
				? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
				: null;

		await tx
			.update(media)
			.set({
				averageRating: avgRating,
				ratingCount: ratings.length,
			})
			.where(eq(media.id, entry.mediaId));
	});

	return c.body(null, 204);
});

// delete tv show from history
// user must be logged in
userHistoryRoutes.delete("/tv/:id", async (c) => {
	const user = c.get("user")!;
	const { id } = c.req.param();

	const entry = await db.query.tvShowWatchHistory.findFirst({
		where: and(
			eq(tvShowWatchHistory.id, id),
			eq(tvShowWatchHistory.userId, user.id),
		),
	});

	if (!entry) {
		return c.json(
			{ error: "Watch history entry not found or unauthorized" },
			404,
		);
	}

	await db.transaction(async (tx) => {
		await tx.delete(tvShowWatchHistory).where(eq(tvShowWatchHistory.id, id));

		const allRatings = await tx.query.tvShowWatchHistory.findMany({
			where: eq(tvShowWatchHistory.mediaId, entry.mediaId),
			columns: { rating: true },
		});

		const ratings = allRatings
			.map((r) => (r.rating ? parseFloat(r.rating) : null))
			.filter((r): r is number => r !== null);

		const avgRating =
			ratings.length > 0
				? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
				: null;

		await tx
			.update(media)
			.set({
				averageRating: avgRating,
				ratingCount: ratings.length,
			})
			.where(eq(media.id, entry.mediaId));
	});

	return c.body(null, 204);
});

// update a movie entry from history
// user must be logged in
userHistoryRoutes.patch(
	"/movie/:id",
	zValidator(
		"json",
		z.object({
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.iso.datetime().optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { id } = c.req.param();
		const data = c.req.valid("json");

		const entry = await db.query.movieWatchHistory.findFirst({
			where: and(
				eq(movieWatchHistory.id, id),
				eq(movieWatchHistory.userId, user.id),
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
					rating: data.rating?.toString(),
					review: data.review,
					watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
				})
				.where(eq(movieWatchHistory.id, id))
				.returning();

			if (data.rating !== undefined) {
				const allRatings = await tx.query.movieWatchHistory.findMany({
					where: eq(movieWatchHistory.mediaId, entry.mediaId),
					columns: { rating: true },
				});

				const ratings = allRatings
					.map((r) => (r.rating ? parseFloat(r.rating) : null))
					.filter((r): r is number => r !== null);

				const avgRating =
					ratings.length > 0
						? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(
								1,
							)
						: null;

				await tx
					.update(media)
					.set({
						averageRating: avgRating,
						ratingCount: ratings.length,
					})
					.where(eq(media.id, entry.mediaId));
			}

			return updatedEntry;
		});

		return c.json(updated, 200);
	},
);

// update a tv entry
// user must be logged in
userHistoryRoutes.patch(
	"/tv/:id",
	zValidator(
		"json",
		z.object({
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.iso.datetime().optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { id } = c.req.param();
		const data = c.req.valid("json");

		const entry = await db.query.tvShowWatchHistory.findFirst({
			where: and(
				eq(tvShowWatchHistory.id, id),
				eq(tvShowWatchHistory.userId, user.id),
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
					rating: data.rating?.toString(),
					review: data.review,
					watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
				})
				.where(eq(tvShowWatchHistory.id, id))
				.returning();

			if (data.rating !== undefined) {
				const allRatings = await tx.query.tvShowWatchHistory.findMany({
					where: eq(tvShowWatchHistory.mediaId, entry.mediaId),
					columns: { rating: true },
				});

				const ratings = allRatings
					.map((r) => (r.rating ? parseFloat(r.rating) : null))
					.filter((r): r is number => r !== null);

				const avgRating =
					ratings.length > 0
						? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(
								1,
							)
						: null;

				await tx
					.update(media)
					.set({
						averageRating: avgRating,
						ratingCount: ratings.length,
					})
					.where(eq(media.id, entry.mediaId));
			}

			return updatedEntry;
		});

		return c.json(updated, 200);
	},
);

export default userHistoryRoutes;
