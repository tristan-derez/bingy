import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { customLists, listItems, media, watchlist } from "#db/schemas/list";
import type { User } from "#db/schemas/user";
import { activity, users } from "#db/schemas/user";
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

// get watchlist by username
userListRoutes.get("/:username/watchlist", async (c) => {
	const { username } = c.req.param();
	const language = c.req.query("language") || "en-US";
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) return c.json("User not found", 404);

	const mediaTypeFilter = c.req.query("mediaType") as
		| "movie"
		| "tv"
		| undefined;

	const limit = 24;
	const offset = (page - 1) * limit;

	const filters = and(
		eq(watchlist.userId, targetUser.id),
		mediaTypeFilter ? eq(media.mediaType, mediaTypeFilter) : undefined,
	);

	const [dbItems, totalCountResult] = await Promise.all([
		db
			.select({
				watchlist: watchlist,
				media: media,
			})
			.from(watchlist)
			.innerJoin(media, eq(watchlist.mediaId, media.id))
			.where(filters)
			.orderBy(desc(watchlist.addedAt))
			.limit(limit)
			.offset(offset),

		db
			.select({ count: sql<number>`count(*)` })
			.from(watchlist)
			.innerJoin(media, eq(watchlist.mediaId, media.id))
			.where(filters),
	]);

	const totalResults = totalCountResult[0].count;

	const hydratedData = (
		await Promise.all(
			dbItems.map(async (item) => {
				const details = await getMediaDetails(
					item.media.tmdbId,
					item.media.mediaType,
					language,
				);

				if (!details) return null;

				return {
					...details,
					mediaType: item.media.mediaType,
					addedAt: item.watchlist.addedAt,
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

// check if an item is in watchlist (authenticated user only)
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
	"/",
	zValidator(
		"json",
		z.object({
			name: z.string().min(1).max(50),
			description: z.string().min(1).max(1000).optional(),
			visibility: z.enum(["public", "limited", "private"]),
			items: z
				.array(
					z.object({
						tmdbId: z.number(),
						mediaType: z.enum(["movie", "tv"]),
						note: z.string().max(500).optional(),
					}),
				)
				.optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { name, description, visibility, items } = c.req.valid("json");
		const slug = name.toLowerCase().replace(/\s+/g, "-");

		const list = await db.transaction(async (tx) => {
			const [newList] = await tx
				.insert(customLists)
				.values({
					userId: user.id,
					name,
					slug,
					description,
					visibility,
				})
				.returning();

			if (items && items.length > 0) {
				// Upsert media records and get their IDs
				const mediaIds = await Promise.all(
					items.map(async (item) => {
						const [mediaRecord] = await tx
							.insert(media)
							.values({
								tmdbId: item.tmdbId,
								mediaType: item.mediaType,
							})
							.onConflictDoUpdate({
								target: [media.tmdbId, media.mediaType],
								set: { updatedAt: sql`now()` },
							})
							.returning({ id: media.id });

						return { mediaId: mediaRecord.id, note: item.note };
					}),
				);

				await tx.insert(listItems).values(
					mediaIds.map(({ mediaId, note }) => ({
						listId: newList.id,
						mediaId,
						note,
					})),
				);
			}

			await tx.insert(activity).values({
				userId: user.id,
				activityType: "created_list",
				customListId: newList.id,
			});

			return newList;
		});

		return c.json(list, 201);
	},
);

// add an item to a list
userListRoutes.post(
	"/items",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			mediaType: z.enum(["movie", "tv"]),
			listId: z.uuidv7(),
			note: z.string().max(500).optional(),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { tmdbId, mediaType, listId, note } = c.req.valid("json");

		await db.transaction(async (tx) => {
			// Verify list belongs to user
			const list = await tx.query.customLists.findFirst({
				where: and(eq(customLists.id, listId), eq(customLists.userId, user.id)),
			});

			if (!list) {
				throw new Error("List not found");
			}

			// Upsert media
			const [mediaRecord] = await tx
				.insert(media)
				.values({
					tmdbId,
					mediaType,
				})
				.onConflictDoUpdate({
					target: [media.tmdbId, media.mediaType],
					set: { updatedAt: sql`now()` },
				})
				.returning({ id: media.id });

			// Add to list
			await tx
				.insert(listItems)
				.values({
					listId,
					mediaId: mediaRecord.id,
					note,
				})
				.onConflictDoNothing();
		});

		return serveCreated(c, { success: true }, 201);
	},
);

// get lists from a user by username
userListRoutes.get("/:username", async (c) => {
	const { username } = c.req.param();
	const currentUser = c.get("user");
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const filter = c.req.query("filter") || "all";

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username.toLocaleLowerCase()),
	});

	if (!targetUser) return c.json("User not found", 404);

	const isOwnProfile = currentUser?.id === targetUser.id;

	const limit = 24;
	const offset = (page - 1) * limit;

	let filters = isOwnProfile
		? eq(customLists.userId, targetUser.id)
		: and(
				eq(customLists.userId, targetUser.id),
				eq(customLists.visibility, "public"),
			);

	// Apply visibility filter if user is viewing their own profile
	if (isOwnProfile && filter !== "all") {
		filters = and(
			eq(customLists.userId, targetUser.id),
			eq(customLists.visibility, filter as "public" | "private" | "limited"),
		);
	}

	const [lists, totalCountResult] = await Promise.all([
		db
			.select()
			.from(customLists)
			.where(filters)
			.orderBy(desc(customLists.createdAt))
			.limit(limit)
			.offset(offset),

		db
			.select({ count: sql<number>`count(*)` })
			.from(customLists)
			.where(filters),
	]);

	const totalResults = totalCountResult[0].count;

	return c.json({
		data: lists,
		page,
		total_pages: Math.ceil(totalResults / limit),
		total_results: totalResults,
	});
});

// delete list
userListRoutes.delete("/:listId", async (c) => {
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

// delete an item from a list
userListRoutes.delete("/:listId/items/:mediaType/:tmdbId", async (c) => {
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

// get list with items by username and slug
userListRoutes.get("/:username/lists/:slug", async (c) => {
	const { username, slug } = c.req.param();
	const currentUser = c.get("user");

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) return c.json("User not found", 404);

	const isOwner = currentUser?.id === targetUser.id;

	const list = await db.query.customLists.findFirst({
		where: and(
			eq(customLists.slug, slug),
			eq(customLists.userId, targetUser.id),
			isOwner ? undefined : sql`${customLists.visibility} != 'private'`,
		),
		with: {
			items: {
				with: {
					media: true,
				},
				orderBy: (listItems, { desc }) => [desc(listItems.addedAt)],
			},
		},
	});

	if (!list) {
		return serveNotFound(c, "List not found");
	}

	return c.json(list);
});

export default userListRoutes;
