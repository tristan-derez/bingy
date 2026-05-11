import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
	customLists,
	listItems,
	media,
	watchlist,
} from "../../db/schemas/list";
import type { User } from "../../db/schemas/user";
import { activity, users } from "../../db/schemas/user";
import { db } from "../../lib/database";
import { serveNotFound } from "../../lib/responses/error";
import {
	serveCreated,
	serveData,
	serveNoContent,
} from "../../lib/responses/resp";
import { createSlug } from "../../lib/slug";
import {
	getMediaDetails,
	NormalizedMedia,
} from "../../lib/tmdb/get-media-details";
import { sessionMiddleware } from "../../web/middlewares/session";

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
	const limitQuery = c.req.query("limit") || 24;
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) return c.json("User not found", 404);

	const mediaTypeFilter = c.req.query("mediaType") as
		| "movie"
		| "tv"
		| undefined;

	const limit = Number(limitQuery);
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

	const totalResults = totalCountResult[0]?.count ?? 0;

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
			name: z.string().min(1).max(200),
			description: z.string().max(2000).optional(),
			visibility: z.enum(["public", "limited", "private"]).default("public"),
			type: z.enum(["unranked", "ranked"]).default("unranked"),
			items: z
				.array(
					z.object({
						tmdbId: z.number(),
						mediaType: z.enum(["movie", "tv"]),
						note: z.string().max(1000).optional(),
						position: z.number().optional(),
					}),
				)
				.optional(),
		}),
	),
	async (c) => {
		try {
			const user = c.get("user")!;
			const { name, description, visibility, type, items } =
				c.req.valid("json");
			let slug = createSlug(name, "list");

			const list = await db.transaction(async (tx) => {
				// check if list name already exists for this user
				const existingName = await tx
					.select({ id: customLists.id })
					.from(customLists)
					.where(
						and(eq(customLists.name, name), eq(customLists.userId, user.id)),
					)
					.limit(1);

				if (existingName.length > 0) {
					throw new Error("LIST_NAME_EXISTS");
				}

				// check if slug exists for this user
				const existingSlug = await tx
					.select({ id: customLists.id })
					.from(customLists)
					.where(
						and(eq(customLists.slug, slug), eq(customLists.userId, user.id)),
					)
					.limit(1);

				if (existingSlug.length > 0) {
					slug = createSlug(`${name}-${nanoid(3)}`, "list");
				}

				const [newList] = await tx
					.insert(customLists)
					.values({
						userId: user.id,
						name: name.trim(),
						slug,
						description,
						visibility,
						type,
					})
					.returning();

				if (!newList) {
					throw new Error("LIST_NOT_CREATED");
				}

				if (items && items.length > 0) {
					// validate positions for ranked lists
					if (type === "ranked") {
						const positions = items
							.map((item) => item.position)
							.filter((p): p is number => p !== undefined);

						if (positions.length !== items.length) {
							throw new Error("RANKED_LIST_MISSING_POSITIONS");
						}

						const uniquePositions = new Set(positions);
						if (uniquePositions.size !== positions.length) {
							throw new Error("RANKED_LIST_DUPLICATE_POSITIONS");
						}
					}

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

							if (!mediaRecord) {
								throw new Error("FAILED_UPSERT_MEDIA");
							}

							return {
								mediaId: mediaRecord.id,
								note: item.note,
								position: item.position,
							};
						}),
					);

					await tx.insert(listItems).values(
						mediaIds.map(({ mediaId, note, position }) => ({
							listId: newList.id,
							mediaId,
							note,
							position: type === "ranked" ? position : null,
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
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "LIST_NAME_EXISTS") {
					return c.json(
						{ error: "You already have a list with this name" },
						409,
					);
				}
				if (error.message === "RANKED_LIST_MISSING_POSITIONS") {
					return c.json(
						{ error: "All items must have positions for ranked lists" },
						400,
					);
				}
				if (error.message === "RANKED_LIST_DUPLICATE_POSITIONS") {
					return c.json(
						{ error: "Positions must be unique in ranked lists" },
						400,
					);
				}
			}
			return c.json({ error: "Failed to create list" }, 500);
		}
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
			note: z.string().max(1000).optional(),
		}),
	),
	async (c) => {
		try {
			const user = c.get("user")!;
			const { tmdbId, mediaType, listId, note } = c.req.valid("json");

			await db.transaction(async (tx) => {
				// verify list belongs to user
				const list = await tx.query.customLists.findFirst({
					where: and(
						eq(customLists.id, listId),
						eq(customLists.userId, user.id),
					),
				});

				if (!list) {
					throw new Error("LIST_NOT_FOUND");
				}

				let finalPosition: number | null = null;

				if (list.type === "ranked") {
					// auto-assign next position
					const maxPosition = await tx.query.listItems.findFirst({
						where: eq(listItems.listId, listId),
						orderBy: (items, { desc }) => [desc(items.position)],
						columns: { position: true },
					});

					finalPosition = (maxPosition?.position ?? 0) + 1;
				}

				// upsert media
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

				if (!mediaRecord) {
					throw new Error("FAILED_UPSERT_MEDIA");
				}

				// add to list
				await tx
					.insert(listItems)
					.values({
						listId,
						mediaId: mediaRecord.id,
						note,
						position: finalPosition,
					})
					.onConflictDoNothing();
			});

			return c.json({ success: true }, 200);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "LIST_NOT_FOUND") {
					return c.json({ error: "List not found" }, 404);
				}
			}
			return c.json({ error: "Failed to add item to list" }, 500);
		}
	},
);

// get lists from a user by username
userListRoutes.get("/:username", async (c) => {
	const { username } = c.req.param();
	const currentUser = c.get("user");
	const limitQuery = c.req.query("limit") || 24;
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
	const filter = c.req.query("filter") || "all";

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username.toLocaleLowerCase()),
	});

	if (!targetUser) return c.json("User not found", 404);

	const isOwnProfile = currentUser?.id === targetUser.id;

	const limit = Number(limitQuery);
	const offset = (page - 1) * limit;

	let filters = isOwnProfile
		? eq(customLists.userId, targetUser.id)
		: and(
				eq(customLists.userId, targetUser.id),
				eq(customLists.visibility, "public"),
			);

	// apply visibility filter if user is viewing their own profile
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

	const totalResults = totalCountResult[0]?.count ?? 0;

	return c.json({
		data: lists,
		page,
		total_pages: Math.ceil(totalResults / limit),
		total_results: totalResults,
	});
});

// update list
userListRoutes.patch(
	"/:listId",
	zValidator(
		"json",
		z.object({
			name: z.string().min(1).max(200).optional(),
			description: z.string().max(2000).nullable().optional(),
			visibility: z.enum(["public", "limited", "private"]).optional(),
			type: z.enum(["unranked", "ranked"]).optional(),
			items: z
				.array(
					z.object({
						tmdbId: z.number(),
						mediaType: z.enum(["movie", "tv"]),
						note: z.string().max(1000).optional(),
						position: z.number().optional(),
					}),
				)
				.optional(),
		}),
	),
	async (c) => {
		try {
			const user = c.get("user")!;
			const listId = c.req.param("listId");
			const { name, description, visibility, type, items } =
				c.req.valid("json");

			const updatedList = await db.transaction(async (tx) => {
				// verify list exist and belongs to user
				const existingList = await tx.query.customLists.findFirst({
					where: and(
						eq(customLists.id, listId),
						eq(customLists.userId, user.id),
					),
				});

				if (!existingList) {
					throw new Error("LIST_NOT_FOUND");
				}

				const updates: Partial<{
					name: string;
					slug: string;
					description: string | null;
					visibility: "public" | "limited" | "private";
					type: "unranked" | "ranked";
				}> = {};

				// handle name change (requires slug regeneration and uniqueness check)
				if (name !== undefined && name !== existingList.name) {
					const existingName = await tx
						.select({ id: customLists.id })
						.from(customLists)
						.where(
							and(eq(customLists.name, name), eq(customLists.userId, user.id)),
						)
						.limit(1);

					if (existingName.length > 0) {
						throw new Error("LIST_NAME_EXISTS");
					}

					let newSlug = createSlug(name, "list");
					const existingSlug = await tx
						.select({ id: customLists.id })
						.from(customLists)
						.where(
							and(
								eq(customLists.slug, newSlug),
								eq(customLists.userId, user.id),
							),
						)
						.limit(1);

					if (existingSlug.length > 0) {
						newSlug = createSlug(`${name}-${nanoid(3)}`, "list");
					}

					updates.name = name.trim();
					updates.slug = newSlug;
				}

				if (description !== undefined) updates.description = description;
				if (visibility !== undefined) updates.visibility = visibility;

				// handle type change
				if (type !== undefined && type !== existingList.type) {
					updates.type = type;
				}

				const finalType = type ?? existingList.type;

				// update list metadata if there are changes
				let updatedListData = existingList;
				if (Object.keys(updates).length > 0) {
					const result = await tx
						.update(customLists)
						.set(updates)
						.where(eq(customLists.id, listId))
						.returning();
					updatedListData = result[0] ?? existingList;
				}

				// handle items replacement if provided
				if (items !== undefined) {
					// validate positions for ranked lists
					if (finalType === "ranked") {
						const positions = items
							.map((item) => item.position)
							.filter((p): p is number => p !== undefined);

						if (positions.length !== items.length) {
							throw new Error("RANKED_LIST_MISSING_POSITIONS");
						}

						const uniquePositions = new Set(positions);
						if (uniquePositions.size !== positions.length) {
							throw new Error("RANKED_LIST_DUPLICATE_POSITIONS");
						}
					}

					// delete existing items
					await tx.delete(listItems).where(eq(listItems.listId, listId));

					// add new items
					if (items.length > 0) {
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

								if (!mediaRecord) {
									throw new Error("FAILED_UPSERT_MEDIA");
								}

								return {
									mediaId: mediaRecord.id,
									note: item.note,
									position: item.position,
								};
							}),
						);

						await tx.insert(listItems).values(
							mediaIds.map(({ mediaId, note, position }) => ({
								listId,
								mediaId,
								note,
								position: finalType === "ranked" ? position : null,
							})),
						);
					}
				}

				return updatedListData;
			});

			return c.json(updatedList);
		} catch (error) {
			// @todo: implement global error handling as AppError
			if (error instanceof Error) {
				switch (error.message) {
					case "LIST_NOT_FOUND":
						return c.json({ error: { code: "LIST_NOT_FOUND" } }, 404);
					case "LIST_NAME_EXISTS":
						return c.json({ error: { code: "LIST_NAME_EXISTS" } }, 409);
					case "RANKED_LIST_MISSING_POSITIONS":
					case "RANKED_LIST_DUPLICATE_POSITIONS":
						console.error("Client validation error:", error.message);
						return c.json({ error: { code: "INVALID_REQUEST" } }, 400);
				}
			}
			return c.json({ error: { code: "UPDATE_FAILED" } }, 500);
		}
	},
);

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
	const language = c.req.query("language") || "en-US";
	const limitQuery = c.req.query("limit") || 24;
	const page = Math.max(1, parseInt(c.req.query("page") || "1"));
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
	});

	if (!list) {
		return serveNotFound(c, "List not found");
	}

	const limit = Number(limitQuery);
	const offset = (page - 1) * limit;

	const filters = and(eq(listItems.listId, list.id));

	const [dbItems, totalCountResult] = await Promise.all([
		db
			.select({
				listItem: listItems,
				media: media,
			})
			.from(listItems)
			.innerJoin(media, eq(listItems.mediaId, media.id))
			.where(filters)
			.orderBy(desc(listItems.addedAt))
			.limit(limit)
			.offset(offset),

		db.select({ count: sql<number>`count(*)` }).from(listItems).where(filters),
	]);

	const totalResults = totalCountResult[0]?.count ?? 0;

	const hydratedItems = (
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
					addedAt: item.listItem.addedAt,
					note: item.listItem.note,
					position: item.listItem.position,
				};
			}),
		)
	).filter(
		(
			item,
		): item is NormalizedMedia & {
			note: string | null;
			position: number | null;
			addedAt: Date;
			mediaType: string;
		} => item !== null,
	);

	return c.json({
		...list,
		items: hydratedItems,
		page,
		total_pages: Math.ceil(totalResults / limit),
		total_results: totalResults,
	});
});

export default userListRoutes;
