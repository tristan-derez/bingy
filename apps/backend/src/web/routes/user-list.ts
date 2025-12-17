import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { customLists, listItems, watchlist } from "#db/schemas/list";
import type { User } from "#db/schemas/user";
import { db } from "#lib/database";
import { serveNotFound } from "#lib/responses/error";
import { serveCreated, serveData, serveNoContent } from "#lib/responses/resp";
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

		const [item] = await db
			.insert(watchlist)
			.values({
				userId: user.id,
				mediaTmdbId: data.tmdbId,
				mediaType: data.mediaType,
			})
			.onConflictDoNothing()
			.returning();

		return serveCreated(c, { item }, 201);
	},
);

// Remove from watchlist
userListRoutes.delete("/watchlist/:tmdbId/:mediaType", async (c) => {
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

	const items = await db.query.watchlist.findMany({
		where: eq(watchlist.userId, user.id),
		orderBy: (watchlist, { desc }) => [desc(watchlist.addedAt)],
	});

	return serveData(c, items);
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

		const [list] = await db
			.insert(customLists)
			.values({
				userId: user.id,
				name,
			})
			.returning();

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
userListRoutes.delete("/lists/:listId/items/:tmdbId/:mediaType", async (c) => {
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

export default userListRoutes;
