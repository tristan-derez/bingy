import { zValidator } from "@hono/zod-validator";
import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { favorites, media } from "#db/schemas/list";
import type { User } from "#db/schemas/user";
import { users } from "#db/schemas/user";
import { db } from "#lib/database";
import { getMediaDetails } from "#lib/tmdb/get-media-details";
import { sessionMiddleware } from "#web/middlewares/session";
import { getOrCreateMedia } from "#web/utils/create-update-media";

type Variables = {
	user: User | null;
	session: unknown;
};

const favoriteRoutes = new Hono<{ Variables: Variables }>();

favoriteRoutes.use("*", sessionMiddleware);

// add to favorites
favoriteRoutes.post(
	"/",
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

		const entry = await db.transaction(async (tx) => {
			const mediaId = await getOrCreateMedia(tx, data.tmdbId, data.mediaType);

			const [favorite] = await tx
				.insert(favorites)
				.values({
					userId: user.id,
					mediaId,
				})
				.onConflictDoNothing()
				.returning();

			return favorite;
		});

		return c.json(entry, 201);
	},
);

// remove from favorites
favoriteRoutes.delete(
	"/:tmdbId/:mediaType",
	zValidator(
		"param",
		z.object({
			tmdbId: z.coerce.number(),
			mediaType: z.enum(["movie", "tv"]),
		}),
	),

	async (c) => {
		const user = c.get("user")!;
		const { tmdbId } = c.req.valid("param");
		const { mediaType } = c.req.valid("param");

		const mediaEntry = await db.query.media.findFirst({
			where: and(eq(media.tmdbId, tmdbId), eq(media.mediaType, mediaType)),
		});

		if (!mediaEntry) {
			return c.json({ error: "Media not found" }, 404);
		}

		const favorite = await db.query.favorites.findFirst({
			where: and(
				eq(favorites.userId, user.id),
				eq(favorites.mediaId, mediaEntry.id),
			),
		});

		if (!favorite) {
			return c.json({ error: "Favorite not found" }, 404);
		}

		await db.delete(favorites).where(eq(favorites.id, favorite.id));

		return c.body(null, 204);
	},
);

// get single favorite
favoriteRoutes.get(
	"/:tmdbId/:mediaType",
	zValidator(
		"param",
		z.object({
			tmdbId: z.coerce.number(),
			mediaType: z.enum(["movie", "tv"]),
		}),
	),
	async (c) => {
		const user = c.get("user")!;
		const { tmdbId } = c.req.valid("param");
		const { mediaType } = c.req.valid("param");

		const favorite = await db
			.select({
				id: favorites.id,
				addedAt: favorites.addedAt,
			})
			.from(favorites)
			.innerJoin(media, eq(media.id, favorites.mediaId))
			.where(
				and(
					eq(favorites.userId, user.id),
					eq(media.tmdbId, tmdbId),
					eq(media.mediaType, mediaType),
				),
			)
			.limit(1);

		return c.json(favorite[0] ?? null, 200);
	},
);

// get all favorites for user
favoriteRoutes.get("/:username", async (c) => {
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

	let entries;
	let totalCount;

	if (mediaTypeFilter) {
		[entries, totalCount] = await Promise.all([
			db
				.select({
					tmdbId: media.tmdbId,
					mediaType: media.mediaType,
					addedAt: favorites.addedAt,
				})
				.from(favorites)
				.innerJoin(media, eq(favorites.mediaId, media.id))
				.where(
					and(
						eq(favorites.userId, targetUser.id),
						eq(media.mediaType, mediaTypeFilter),
					),
				)
				.orderBy(favorites.addedAt)
				.limit(limit)
				.offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(favorites)
				.innerJoin(media, eq(favorites.mediaId, media.id))
				.where(
					and(
						eq(favorites.userId, targetUser.id),
						eq(media.mediaType, mediaTypeFilter),
					),
				),
		]);
	} else {
		[entries, totalCount] = await Promise.all([
			db
				.select({
					tmdbId: media.tmdbId,
					mediaType: media.mediaType,
					addedAt: favorites.addedAt,
				})
				.from(favorites)
				.innerJoin(media, eq(favorites.mediaId, media.id))
				.where(eq(favorites.userId, targetUser.id))
				.orderBy(favorites.addedAt)
				.limit(limit)
				.offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(favorites)
				.where(eq(favorites.userId, targetUser.id)),
		]);
	}

	const totalResults = Number(totalCount[0].count);

	const hydratedData = (
		await Promise.all(
			entries.map(async (entry) => {
				const details = await getMediaDetails(
					entry.tmdbId,
					entry.mediaType as "movie" | "tv",
					language,
				);
				if (!details) return null;
				return {
					...details,
					mediaType: entry.mediaType,
					addedAt: entry.addedAt,
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

export default favoriteRoutes;
