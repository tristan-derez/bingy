import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
	media,
	movieWatchHistory,
	tvSeasons,
	tvShowProgress,
	tvShowWatchHistory,
} from "#db/schemas/list";
import type { User } from "#db/schemas/user";
import { activity } from "#db/schemas/user";
import { db } from "#lib/database";
import { serveNotFound } from "#lib/responses/error";
import { serveCreated, serveData, serveNoContent } from "#lib/responses/resp";
import { getMediaDetails, NormalizedMedia } from "#lib/tmdb/get-media-details";
import { sessionMiddleware } from "#web/middlewares/session";

type Variables = {
	user: User | null;
	session: unknown;
};

const userHistoryRoutes = new Hono<{ Variables: Variables }>();

userHistoryRoutes.use("*", sessionMiddleware);

// rate/log a movie
userHistoryRoutes.post(
	"/movie",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.iso.datetime().optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			const [mediaEntry] = await tx
				.insert(media)
				.values({
					tmdbId: data.tmdbId,
					mediaType: "movie",
				})
				.onConflictDoNothing()
				.returning();

			const mediaId =
				mediaEntry?.id ||
				(
					await tx.query.media.findFirst({
						where: and(
							eq(media.tmdbId, data.tmdbId),
							eq(media.mediaType, "movie"),
						),
					})
				)?.id;

			if (!mediaId) {
				throw new Error("Failed to create or find media entry");
			}

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
				const allRatings = await tx.query.movieWatchHistory.findMany({
					where: eq(movieWatchHistory.mediaId, mediaId),
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
					.where(eq(media.id, mediaId));
			}

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

// rate/review a tv show (show-level only)
userHistoryRoutes.post(
	"/tv",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.iso.datetime().optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			const [mediaEntry] = await tx
				.insert(media)
				.values({
					tmdbId: data.tmdbId,
					mediaType: "tv",
				})
				.onConflictDoNothing()
				.returning();

			const mediaId =
				mediaEntry?.id ||
				(
					await tx.query.media.findFirst({
						where: and(
							eq(media.tmdbId, data.tmdbId),
							eq(media.mediaType, "tv"),
						),
					})
				)?.id;

			if (!mediaId) {
				throw new Error("Failed to create or find media entry");
			}

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

			if (data.rating) {
				const allRatings = await tx.query.tvShowWatchHistory.findMany({
					where: eq(tvShowWatchHistory.mediaId, mediaId),
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
					.where(eq(media.id, mediaId));
			}

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

// mark episode as watched (updates progress)
// we consider every previous episode as watched
userHistoryRoutes.post(
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
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			// 1. Ensure media exists
			const [mediaEntry] = await tx
				.insert(media)
				.values({
					tmdbId: data.tmdbId,
					mediaType: "tv",
				})
				.onConflictDoNothing()
				.returning();

			const mediaId =
				mediaEntry?.id ||
				(
					await tx.query.media.findFirst({
						where: and(
							eq(media.tmdbId, data.tmdbId),
							eq(media.mediaType, "tv"),
						),
					})
				)?.id;

			if (!mediaId) {
				throw new Error("Failed to create or find media entry");
			}

			// 2. Handle rating/review
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
					const allRatings = await tx.query.tvShowWatchHistory.findMany({
						where: eq(tvShowWatchHistory.mediaId, mediaId),
						columns: { rating: true },
					});

					const ratings = allRatings
						.map((r) => (r.rating ? parseFloat(r.rating) : null))
						.filter((r): r is number => r !== null);

					const avgRating =
						ratings.length > 0
							? (
									ratings.reduce((sum, r) => sum + r, 0) / ratings.length
								).toFixed(1)
							: null;

					await tx
						.update(media)
						.set({
							averageRating: avgRating,
							ratingCount: ratings.length,
						})
						.where(eq(media.id, mediaId));
				}
			}

			// 3. Handle progress tracking
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
					})
					.onConflictDoUpdate({
						target: [tvShowProgress.userId, tvShowProgress.mediaId],
						set: {
							lastWatchedSeason: data.seasonNumber,
							lastWatchedEpisode: data.episodeNumber,
							updatedAt: sql`NOW()`,
						},
					})
					.returning();
			}

			// 4. Add activity for rating (if applicable)
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

// get movie rating
userHistoryRoutes.get(
	"/movie/:tmdbId",
	zValidator(
		"param",
		z.object({
			tmdbId: z.coerce.number(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { tmdbId } = c.req.valid("param");

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
					eq(movieWatchHistory.userId, user.id),
					eq(media.tmdbId, tmdbId),
					eq(media.mediaType, "movie"),
				),
			)
			.orderBy(desc(movieWatchHistory.loggedAt))
			.limit(1);

		return c.json(entry ?? null, 200);
	},
);

// get tv rating
userHistoryRoutes.get(
	"/tv/:tmdbId",
	zValidator(
		"param",
		z.object({
			tmdbId: z.coerce.number(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { tmdbId } = c.req.valid("param");

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
					eq(tvShowWatchHistory.userId, user.id),
					eq(media.tmdbId, tmdbId),
					eq(media.mediaType, "tv"),
				),
			);

		return c.json(entry ?? null, 200);
	},
);

// get tv show progress
userHistoryRoutes.get("/tv/progress/:tmdbId", async (c) => {
	const user = c.get("user")!;
	const tmdbId = Number(c.req.param("tmdbId"));

	const mediaEntry = await db.query.media.findFirst({
		where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, "tv")),
	});

	if (!mediaEntry) {
		return c.json({ progress: null, seasons: [] });
	}

	const [progress, seasons] = await Promise.all([
		db.query.tvShowProgress.findFirst({
			where: and(
				eq(tvShowProgress.userId, user.id),
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

// get movies from history
userHistoryRoutes.get("/movies", async (c) => {
	const user = c.get("user")!;
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const limit = 24;
	const offset = (page - 1) * limit;

	const [entries, totalCountResult] = await Promise.all([
		db.query.movieWatchHistory.findMany({
			where: eq(movieWatchHistory.userId, user.id),
			with: {
				media: true,
			},
			orderBy: [desc(movieWatchHistory.watchedAt)],
			limit,
			offset,
		}),
		db
			.select({ count: sql<number>`count(*)` })
			.from(movieWatchHistory)
			.where(eq(movieWatchHistory.userId, user.id)),
	]);

	return c.json({
		data: entries,
		page,
		total_pages: Math.ceil(totalCountResult[0].count / limit),
		total_results: totalCountResult[0].count,
	});
});

// get tv shows from history
userHistoryRoutes.get("/tvShows", async (c) => {
	const user = c.get("user")!;
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const limit = 24;
	const offset = (page - 1) * limit;

	const [entries, totalCountResult] = await Promise.all([
		db.query.tvShowWatchHistory.findMany({
			where: eq(tvShowWatchHistory.userId, user.id),
			with: {
				media: true,
			},
			orderBy: [desc(tvShowWatchHistory.watchedAt)],
			limit,
			offset,
		}),
		db
			.select({ count: sql<number>`count(*)` })
			.from(tvShowWatchHistory)
			.where(eq(tvShowWatchHistory.userId, user.id)),
	]);

	return c.json({
		data: entries,
		page,
		total_pages: Math.ceil(totalCountResult[0].count / limit),
		total_results: totalCountResult[0].count,
	});
});

// delete a movie from history
userHistoryRoutes.delete("/movie/:id", async (c) => {
	const user = c.get("user")!;
	const id = c.req.param("id");

	const entry = await db.query.movieWatchHistory.findFirst({
		where: and(
			eq(movieWatchHistory.id, id),
			eq(movieWatchHistory.userId, user.id),
		),
	});

	if (!entry) {
		return c.json({ error: "Watch history entry not found" }, 404);
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

// delete a tv show from history
userHistoryRoutes.delete("/tv/:id", async (c) => {
	const user = c.get("user")!;
	const id = c.req.param("id");

	const entry = await db.query.tvShowWatchHistory.findFirst({
		where: and(
			eq(tvShowWatchHistory.id, id),
			eq(tvShowWatchHistory.userId, user.id),
		),
	});

	if (!entry) {
		return c.json({ error: "Watch history entry not found" }, 404);
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

// patch a movie rating
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
		const id = c.req.param("id");
		const data = c.req.valid("json");

		const entry = await db.query.movieWatchHistory.findFirst({
			where: and(
				eq(movieWatchHistory.id, id),
				eq(movieWatchHistory.userId, user.id),
			),
		});

		if (!entry) {
			return c.json({ error: "Watch history entry not found" }, 404);
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

// patch a tv show rating
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
		const id = c.req.param("id");
		const data = c.req.valid("json");

		const entry = await db.query.tvShowWatchHistory.findFirst({
			where: and(
				eq(tvShowWatchHistory.id, id),
				eq(tvShowWatchHistory.userId, user.id),
			),
		});

		if (!entry) {
			return c.json({ error: "Watch history entry not found" }, 404);
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
