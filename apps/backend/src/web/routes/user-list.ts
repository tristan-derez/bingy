import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
	customLists,
	listItems,
	movieWatchHistory,
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

// Add to watchlist
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
			const [item] = await tx
				.insert(watchlist)
				.values({
					userId: user.id,
					mediaTmdbId: data.tmdbId,
					mediaType: data.mediaType,
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

// Remove from watchlist
userListRoutes.delete("/watchlist/:mediaType/:tmdbId", async (c) => {
	const user = c.get("user")!;
	const tmdbId = Number(c.req.param("tmdbId"));
	const mediaType = c.req.param("mediaType");

	await db
		.delete(watchlist)
		.where(
			and(
				eq(watchlist.userId, user.id),
				eq(watchlist.mediaTmdbId, tmdbId),
				eq(watchlist.mediaType, mediaType),
			),
		);

	return serveNoContent(c);
});

// Get user's watchlist
userListRoutes.get("/watchlist", async (c) => {
	const user = c.get("user")!;
	const language = c.req.query("language") || "en-US";
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const mediaType = c.req.query("mediaType") as "movie" | "tv" | undefined;
	const limit = 24;
	const offset = (page - 1) * limit;

	const baseCondition = eq(watchlist.userId, user.id);
	const whereCondition = mediaType
		? and(baseCondition, eq(watchlist.mediaType, mediaType))
		: baseCondition;

	const [dbItems, totalCountResult] = await Promise.all([
		db.query.watchlist.findMany({
			where: whereCondition,
			orderBy: [desc(watchlist.addedAt)],
			limit,
			offset,
		}),
		db
			.select({ count: sql<number>`count(*)` })
			.from(watchlist)
			.where(whereCondition),
	]);

	const totalResults = totalCountResult[0].count;

	const hydratedData = (
		await Promise.all(
			dbItems.map(async (item) => {
				const details = await getMediaDetails(
					item.mediaTmdbId,
					item.mediaType,
					language,
				);
				if (!details) return null;

				return {
					...details,
					mediaType: item.mediaType,
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

	const exists = await db.query.watchlist.findFirst({
		where: and(
			eq(watchlist.userId, user.id),
			eq(watchlist.mediaTmdbId, tmdbId),
			eq(watchlist.mediaType, mediaType),
		),
		columns: { mediaTmdbId: true, mediaType: true },
	});

	return c.json({
		tmdb_id: tmdbId,
		media_type: mediaType,
		item_present: !!exists,
	});
});

// Create custom list
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

// Get user's custom lists
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

// Delete custom list
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

// Add item to custom list
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

		await db
			.insert(listItems)
			.values({
				listId,
				mediaTmdbId: data.tmdbId,
				mediaType: data.mediaType,
			})
			.onConflictDoNothing();

		return serveCreated(c, { success: true }, 201);
	},
);

// Remove item from custom list
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

	await db
		.delete(listItems)
		.where(
			and(
				eq(listItems.listId, listId),
				eq(listItems.mediaTmdbId, tmdbId),
				eq(listItems.mediaType, mediaType),
			),
		);

	return serveNoContent(c);
});

// Get list items
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
		orderBy: (listItems, { desc }) => [desc(listItems.addedAt)],
	});

	return serveData(c, items);
});

// Log movie watch
userListRoutes.post(
	"/history/movie",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.string().datetime().optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			const [watchEntry] = await tx
				.insert(movieWatchHistory)
				.values({
					userId: user.id,
					mediaTmdbId: data.tmdbId,
					rating: data.rating?.toString(),
					review: data.review,
					watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
				})
				.returning();

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

// Log TV show episode watch
userListRoutes.post(
	"/history/tv",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			seasonNumber: z.number().min(0),
			episodeNumber: z.number().min(1),
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.string().datetime().optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			const [watchEntry] = await tx
				.insert(tvShowWatchHistory)
				.values({
					userId: user.id,
					mediaTmdbId: data.tmdbId,
					seasonNumber: data.seasonNumber,
					episodeNumber: data.episodeNumber,
					rating: data.rating?.toString(),
					review: data.review,
					watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
				})
				.returning();

			await tx.insert(activity).values({
				userId: user.id,
				activityType: "watched_episode",
				tvShowWatchHistoryId: watchEntry.id,
			});

			return watchEntry;
		});

		return c.json(entry, 201);
	},
);

// Get movie watch history
userListRoutes.get("/history/movie", async (c) => {
	const user = c.get("user")!;
	const tmdbId = c.req.query("tmdbId");
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const limit = 24;
	const offset = (page - 1) * limit;

	const whereCondition = tmdbId
		? and(
				eq(movieWatchHistory.userId, user.id),
				eq(movieWatchHistory.mediaTmdbId, Number(tmdbId)),
			)
		: eq(movieWatchHistory.userId, user.id);

	const [entries, totalCountResult] = await Promise.all([
		db.query.movieWatchHistory.findMany({
			where: whereCondition,
			orderBy: [desc(movieWatchHistory.watchedAt)],
			limit,
			offset,
		}),
		db
			.select({ count: sql<number>`count(*)` })
			.from(movieWatchHistory)
			.where(whereCondition),
	]);

	return c.json({
		data: entries,
		page,
		total_pages: Math.ceil(totalCountResult[0].count / limit),
		total_results: totalCountResult[0].count,
	});
});

// Get TV show watch history
userListRoutes.get("/history/tv", async (c) => {
	const user = c.get("user")!;
	const tmdbId = c.req.query("tmdbId");
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const limit = 24;
	const offset = (page - 1) * limit;

	const whereCondition = tmdbId
		? and(
				eq(tvShowWatchHistory.userId, user.id),
				eq(tvShowWatchHistory.mediaTmdbId, Number(tmdbId)),
			)
		: eq(tvShowWatchHistory.userId, user.id);

	const [entries, totalCountResult] = await Promise.all([
		db.query.tvShowWatchHistory.findMany({
			where: whereCondition,
			orderBy: [desc(tvShowWatchHistory.watchedAt)],
			limit,
			offset,
		}),
		db
			.select({ count: sql<number>`count(*)` })
			.from(tvShowWatchHistory)
			.where(whereCondition),
	]);

	return c.json({
		data: entries,
		page,
		total_pages: Math.ceil(totalCountResult[0].count / limit),
		total_results: totalCountResult[0].count,
	});
});

// Delete movie watch history entry
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

	await db.delete(movieWatchHistory).where(eq(movieWatchHistory.id, id));

	return c.body(null, 204);
});

// Delete TV show watch history entry
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

	await db.delete(tvShowWatchHistory).where(eq(tvShowWatchHistory.id, id));

	return c.body(null, 204);
});

// Update movie watch history entry
userListRoutes.patch(
	"/history/movie/:id",
	zValidator(
		"json",
		z.object({
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.string().datetime().optional(),
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

		const [updated] = await db
			.update(movieWatchHistory)
			.set({
				rating: data.rating?.toString(),
				review: data.review,
				watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
			})
			.where(eq(movieWatchHistory.id, id))
			.returning();

		return c.json(updated, 200);
	},
);

// Update TV show watch history entry
userListRoutes.patch(
	"/history/tv/:id",
	zValidator(
		"json",
		z.object({
			rating: z.number().min(0.5).max(5.0).optional(),
			review: z.string().optional(),
			watchedAt: z.string().datetime().optional(),
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

		const [updated] = await db
			.update(tvShowWatchHistory)
			.set({
				rating: data.rating?.toString(),
				review: data.review,
				watchedAt: data.watchedAt ? new Date(data.watchedAt) : undefined,
			})
			.where(eq(tvShowWatchHistory.id, id))
			.returning();

		return c.json(updated, 200);
	},
);

export default userListRoutes;
