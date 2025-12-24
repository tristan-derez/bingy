import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
	customLists,
	listItems,
	media,
	movieWatchHistory,
	tvEpisodeWatchHistory,
	tvSeasonWatchHistory,
	tvShowWatchHistory,
	watchlist,
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

const userListRoutes = new Hono<{ Variables: Variables }>();

userListRoutes.use("*", sessionMiddleware);

// add item to watchlist
userListRoutes.post(
	"/watchlist",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			mediaType: z.enum(["movie", "tv"]),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const result = await db.transaction(async (tx) => {
			const [mediaEntry] = await tx
				.insert(media)
				.values({
					tmdbId: data.tmdbId,
					mediaType: data.mediaType,
				})
				.onConflictDoNothing()
				.returning();

			const mediaId =
				mediaEntry?.id ||
				(
					await tx.query.media.findFirst({
						where: and(
							eq(media.tmdbId, data.tmdbId),
							eq(media.mediaType, data.mediaType),
						),
					})
				)?.id;

			if (!mediaId) {
				throw new Error("Failed to create or find media entry");
			}

			const [item] = await tx
				.insert(watchlist)
				.values({
					userId: user.id,
					mediaId,
				})
				.onConflictDoNothing()
				.returning();

			if (item) {
				await tx.insert(activity).values({
					userId: user.id,
					activityType: "added_to_watchlist",
					watchlistId: item.id,
				});
			}

			return item;
		});

		return serveCreated(c, { item: result }, 201);
	},
);

// delete item from watchlist
userListRoutes.delete("/watchlist/:mediaType/:tmdbId", async (c) => {
	const user = c.get("user")!;
	const tmdbId = Number(c.req.param("tmdbId"));
	const mediaType = c.req.param("mediaType");

	const mediaEntry = await db.query.media.findFirst({
		where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, mediaType)),
	});

	if (!mediaEntry) {
		return serveNoContent(c);
	}

	await db
		.delete(watchlist)
		.where(
			and(eq(watchlist.userId, user.id), eq(watchlist.mediaId, mediaEntry.id)),
		);

	return serveNoContent(c);
});

// get watchlist
userListRoutes.get("/watchlist", async (c) => {
	const user = c.get("user")!;
	const language = c.req.query("language") || "en-US";
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const mediaTypeFilter = c.req.query("mediaType") as
		| "movie"
		| "tv"
		| undefined;
	const limit = 24;
	const offset = (page - 1) * limit;

	const [dbItems, totalCountResult] = await Promise.all([
		db.query.watchlist.findMany({
			where: eq(watchlist.userId, user.id),
			with: {
				media: true,
			},
			orderBy: [desc(watchlist.addedAt)],
			limit,
			offset,
		}),
		db
			.select({ count: sql<number>`count(*)` })
			.from(watchlist)
			.where(eq(watchlist.userId, user.id)),
	]);

	const filteredItems = mediaTypeFilter
		? dbItems.filter((item) => item.media.mediaType === mediaTypeFilter)
		: dbItems;

	const totalResults = totalCountResult[0].count;

	const hydratedData = (
		await Promise.all(
			filteredItems.map(async (item) => {
				const details = await getMediaDetails(
					item.media.tmdbId,
					item.media.mediaType,
					language,
				);
				if (!details) return null;

				return {
					...details,
					mediaType: item.media.mediaType,
					addedAt: item.addedAt,
				};
			}),
		)
	).filter((item): item is NormalizedMedia => item !== null);

	return c.json({
		data: hydratedData,
		page,
		total_pages: Math.ceil(totalResults / limit),
		total_results: totalResults,
	});
});

// check if an item is in watchlist
userListRoutes.get("/watchlist/check/:mediaType/:tmdbId", async (c) => {
	const user = c.get("user")!;
	const mediaType = c.req.param("mediaType");
	const tmdbId = parseInt(c.req.param("tmdbId"));

	if (mediaType !== "movie" && mediaType !== "tv") {
		return c.json({ error: "Invalid media type" }, 400);
	}

	if (isNaN(tmdbId)) {
		return c.json({ error: "Invalid TMDB ID" }, 400);
	}

	const mediaEntry = await db.query.media.findFirst({
		where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, mediaType)),
	});

	if (!mediaEntry) {
		return c.json({
			tmdb_id: tmdbId,
			media_type: mediaType,
			item_present: false,
		});
	}

	const exists = await db.query.watchlist.findFirst({
		where: and(
			eq(watchlist.userId, user.id),
			eq(watchlist.mediaId, mediaEntry.id),
		),
		columns: { id: true },
	});

	return c.json({
		tmdb_id: tmdbId,
		media_type: mediaType,
		item_present: !!exists,
	});
});

// create list
userListRoutes.post(
	"/lists",
	zValidator(
		"json",
		z.object({
			name: z.string().min(1).max(256),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { name } = c.req.valid("json");

		const list = await db.transaction(async (tx) => {
			const [newList] = await tx
				.insert(customLists)
				.values({
					userId: user.id,
					name,
				})
				.returning();

			await tx.insert(activity).values({
				userId: user.id,
				activityType: "created_list",
				customListId: newList.id,
			});

			return newList;
		});

		return serveCreated(c, list, 201);
	},
);

// get lists from the user
userListRoutes.get("/lists", async (c) => {
	const user = c.get("user")!;

	const lists = await db.query.customLists.findMany({
		where: eq(customLists.userId, user.id),
		orderBy: (customLists, { desc }) => [desc(customLists.createdAt)],
	});

	if (!lists) {
		return serveNotFound(c, "Lists not found");
	}

	return serveData(c, lists);
});

userListRoutes.delete("/lists/:listId", async (c) => {
	const user = c.get("user")!;
	const listId = c.req.param("listId");

	const list = await db.query.customLists.findFirst({
		where: and(eq(customLists.id, listId), eq(customLists.userId, user.id)),
	});

	if (!list) {
		return serveNotFound(c, "List not found");
	}

	await db.delete(customLists).where(eq(customLists.id, listId));

	return serveNoContent(c);
});

//.add an item to a list
userListRoutes.post(
	"/lists/:listId/items",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			mediaType: z.enum(["movie", "tv"]),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const listId = c.req.param("listId");
		const data = c.req.valid("json");

		const list = await db.query.customLists.findFirst({
			where: and(eq(customLists.id, listId), eq(customLists.userId, user.id)),
		});

		if (!list) {
			return serveNotFound(c, "List not found");
		}

		await db.transaction(async (tx) => {
			const [mediaEntry] = await tx
				.insert(media)
				.values({
					tmdbId: data.tmdbId,
					mediaType: data.mediaType,
				})
				.onConflictDoNothing()
				.returning();

			const mediaId =
				mediaEntry?.id ||
				(
					await tx.query.media.findFirst({
						where: and(
							eq(media.tmdbId, data.tmdbId),
							eq(media.mediaType, data.mediaType),
						),
					})
				)?.id;

			if (!mediaId) {
				throw new Error("Failed to create or find media entry");
			}

			await tx
				.insert(listItems)
				.values({
					listId,
					mediaId,
				})
				.onConflictDoNothing();
		});

		return serveCreated(c, { success: true }, 201);
	},
);

// delete an item from a list
userListRoutes.delete("/lists/:listId/items/:mediaType/:tmdbId", async (c) => {
	const user = c.get("user")!;
	const listId = c.req.param("listId");
	const tmdbId = Number(c.req.param("tmdbId"));
	const mediaType = c.req.param("mediaType");

	const list = await db.query.customLists.findFirst({
		where: and(eq(customLists.id, listId), eq(customLists.userId, user.id)),
	});

	if (!list) {
		return serveNotFound(c, "List not found");
	}

	const mediaEntry = await db.query.media.findFirst({
		where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, mediaType)),
	});

	if (!mediaEntry) {
		return serveNoContent(c);
	}

	await db
		.delete(listItems)
		.where(
			and(eq(listItems.listId, listId), eq(listItems.mediaId, mediaEntry.id)),
		);

	return serveNoContent(c);
});

// get items from a list
userListRoutes.get("/lists/:listId/items", async (c) => {
	const user = c.get("user")!;
	const listId = c.req.param("listId");

	const list = await db.query.customLists.findFirst({
		where: and(eq(customLists.id, listId), eq(customLists.userId, user.id)),
	});

	if (!list) {
		return serveNotFound(c, "List not found");
	}

	const items = await db.query.listItems.findMany({
		where: eq(listItems.listId, listId),
		with: {
			media: true,
		},
		orderBy: (listItems, { desc }) => [desc(listItems.addedAt)],
	});

	return serveData(c, items);
});

// rate/log a movie
userListRoutes.post(
	"/history/movie",
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
userListRoutes.post(
	"/history/tv",
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

// log individual episode (no rating/review)
userListRoutes.post(
	"/history/tv/episode",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			seasonNumber: z.number().min(0),
			episodeNumber: z.number().min(1),
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
				.insert(tvEpisodeWatchHistory)
				.values({
					userId: user.id,
					mediaId,
					seasonNumber: data.seasonNumber,
					episodeNumber: data.episodeNumber,
					watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
				})
				.returning();

			await tx.insert(activity).values({
				userId: user.id,
				activityType: "watched_episode",
				tvEpisodeWatchHistoryId: watchEntry.id,
			});

			return watchEntry;
		});

		return c.json(entry, 201);
	},
);

// log entire season (no rating/review)
userListRoutes.post(
	"/history/tv/season",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			seasonNumber: z.number().min(0),
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
				.insert(tvSeasonWatchHistory)
				.values({
					userId: user.id,
					mediaId,
					seasonNumber: data.seasonNumber,
					watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
				})
				.returning();

			await tx.insert(activity).values({
				userId: user.id,
				activityType: "watched_season",
				tvSeasonWatchHistoryId: watchEntry.id,
			});

			return watchEntry;
		});

		return c.json(entry, 201);
	},
);

// get movies from history
userListRoutes.get("/history/movie", async (c) => {
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
userListRoutes.get("/history/tv", async (c) => {
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

// get episodes from history
userListRoutes.get("/history/tv/episode", async (c) => {
	const user = c.get("user")!;
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const limit = 24;
	const offset = (page - 1) * limit;

	const [entries, totalCountResult] = await Promise.all([
		db.query.tvEpisodeWatchHistory.findMany({
			where: eq(tvEpisodeWatchHistory.userId, user.id),
			with: {
				media: true,
			},
			orderBy: [desc(tvEpisodeWatchHistory.watchedAt)],
			limit,
			offset,
		}),
		db
			.select({ count: sql<number>`count(*)` })
			.from(tvEpisodeWatchHistory)
			.where(eq(tvEpisodeWatchHistory.userId, user.id)),
	]);

	return c.json({
		data: entries,
		page,
		total_pages: Math.ceil(totalCountResult[0].count / limit),
		total_results: totalCountResult[0].count,
	});
});

// get seasons from history
userListRoutes.get("/history/tv/season", async (c) => {
	const user = c.get("user")!;
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const limit = 24;
	const offset = (page - 1) * limit;

	const [entries, totalCountResult] = await Promise.all([
		db.query.tvSeasonWatchHistory.findMany({
			where: eq(tvSeasonWatchHistory.userId, user.id),
			with: {
				media: true,
			},
			orderBy: [desc(tvSeasonWatchHistory.watchedAt)],
			limit,
			offset,
		}),
		db
			.select({ count: sql<number>`count(*)` })
			.from(tvSeasonWatchHistory)
			.where(eq(tvSeasonWatchHistory.userId, user.id)),
	]);

	return c.json({
		data: entries,
		page,
		total_pages: Math.ceil(totalCountResult[0].count / limit),
		total_results: totalCountResult[0].count,
	});
});

// delete a movie from history
userListRoutes.delete("/history/movie/:id", async (c) => {
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
userListRoutes.delete("/history/tv/:id", async (c) => {
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

// delete an episode from history
userListRoutes.delete("/history/tv/episode/:id", async (c) => {
	const user = c.get("user")!;
	const id = c.req.param("id");

	const entry = await db.query.tvEpisodeWatchHistory.findFirst({
		where: and(
			eq(tvEpisodeWatchHistory.id, id),
			eq(tvEpisodeWatchHistory.userId, user.id),
		),
	});

	if (!entry) {
		return c.json({ error: "Watch history entry not found" }, 404);
	}

	await db
		.delete(tvEpisodeWatchHistory)
		.where(eq(tvEpisodeWatchHistory.id, id));

	return c.body(null, 204);
});

// delete a season from history
userListRoutes.delete("/history/tv/season/:id", async (c) => {
	const user = c.get("user")!;
	const id = c.req.param("id");

	const entry = await db.query.tvSeasonWatchHistory.findFirst({
		where: and(
			eq(tvSeasonWatchHistory.id, id),
			eq(tvSeasonWatchHistory.userId, user.id),
		),
	});

	if (!entry) {
		return c.json({ error: "Watch history entry not found" }, 404);
	}

	await db.delete(tvSeasonWatchHistory).where(eq(tvSeasonWatchHistory.id, id));

	return c.body(null, 204);
});

// patch a movie rating
userListRoutes.patch(
	"/history/movie/:id",
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
userListRoutes.patch(
	"/history/tv/:id",
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

export default userListRoutes;
