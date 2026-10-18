import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
	favorites,
	media,
	movieWatchHistory,
	tvShowProgress,
	tvShowWatchHistory,
	watchlist,
} from "../../db/schemas/list";
import type { User } from "../../db/schemas/user";
import { activity, users } from "../../db/schemas/user";
import { db } from "../../lib/database";
import { getMediaDetails } from "../../lib/tmdb/get-media-details";
import { getOrCreateMedia } from "../../web/utils/create-update-media";

type Variables = {
	user: User | null;
	session: unknown;
};

const userFavoriteRoutes = new Hono<{ Variables: Variables }>();

// add to favorites
userFavoriteRoutes.post(
	"/",
	zValidator(
		"json",
		z.object({
			tmdbId: z.number(),
			mediaType: z.enum(["movie", "tv"]),
		}),
	),
	async (c) => {
		const user = c.get("user");
		if (!user) return c.json({ error: "UNAUTHORIZED" }, 401);
		const data = c.req.valid("json");

		const entry = await db.transaction(async (tx) => {
			const mediaId = await getOrCreateMedia(tx, data.tmdbId, data.mediaType);
			const markAsSeen = data.mediaType === "movie";

			const [favorite] = await tx
				.insert(favorites)
				.values({
					userId: user.id,
					mediaId,
				})
				.onConflictDoNothing()
				.returning();

			// we consider a movie favorited as seen (TV shows are not auto-marked as watched)
			if (markAsSeen) {
				const [watchEntry] = await tx
					.insert(movieWatchHistory)
					.values({
						userId: user.id,
						mediaId,
					})
					.onConflictDoNothing()
					.returning();

				if (watchEntry) {
					await tx
						.insert(activity)
						.values({
							userId: user.id,
							activityType: "watched_movie",
							movieWatchHistoryId: watchEntry.id,
						})
						.onConflictDoNothing();
				}

				await tx
					.delete(watchlist)
					.where(
						and(eq(watchlist.userId, user.id), eq(watchlist.mediaId, mediaId)),
					);
			}

			return favorite;
		});

		return c.json(entry, 201);
	},
);

// remove from favorites
userFavoriteRoutes.delete(
	"/:tmdbId/:mediaType",
	zValidator(
		"param",
		z.object({
			tmdbId: z.coerce.number(),
			mediaType: z.enum(["movie", "tv"]),
		}),
	),

	async (c) => {
		const user = c.get("user");
		if (!user) return c.json({ error: "UNAUTHORIZED" }, 401);
		const { tmdbId, mediaType } = c.req.valid("param");

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
userFavoriteRoutes.get(
	"/:tmdbId/:mediaType",
	zValidator(
		"param",
		z.object({
			tmdbId: z.coerce.number(),
			mediaType: z.enum(["movie", "tv"]),
		}),
	),
	async (c) => {
		const user = c.get("user");
		if (!user) return c.json({ error: "UNAUTHORIZED" }, 401);
		const { tmdbId, mediaType } = c.req.valid("param");

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

// get all favorites for an user
userFavoriteRoutes.get(
	"/:username",
	zValidator(
		"query",
		z.object({
			language: z.string().default("en-US"),
			limit: z.coerce.number().int().min(1).max(100).default(24),
			page: z.coerce.number().int().min(1).default(1),
			mediaType: z.enum(["movie", "tv"]).optional(),
		}),
	),
	async (c) => {
		const { username } = c.req.param();
		const {
			language,
			limit,
			page,
			mediaType: mediaTypeFilter,
		} = c.req.valid("query");
		const offset = (page - 1) * limit;

		const targetUser = await db.query.users.findFirst({
			where: eq(users.name, username),
		});

		if (!targetUser) return c.json("USER_NOT_FOUND", 404);

		const baseSelect = {
			mediaId: media.id,
			tmdbId: media.tmdbId,
			mediaType: media.mediaType,
			addedAt: favorites.addedAt,
			movieRating: movieWatchHistory.rating,
			movieWatchedAt: movieWatchHistory.watchedAt,
			tvRating: tvShowWatchHistory.rating,
			tvWatchedAt: tvShowWatchHistory.watchedAt,
		};

		let entries;
		let totalCount;

		if (mediaTypeFilter) {
			[entries, totalCount] = await Promise.all([
				db
					.select(baseSelect)
					.from(favorites)
					.innerJoin(media, eq(favorites.mediaId, media.id))
					.leftJoin(
						movieWatchHistory,
						and(
							eq(movieWatchHistory.mediaId, media.id),
							eq(movieWatchHistory.userId, targetUser.id),
						),
					)
					.leftJoin(
						tvShowWatchHistory,
						and(
							eq(tvShowWatchHistory.mediaId, media.id),
							eq(tvShowWatchHistory.userId, targetUser.id),
						),
					)
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
					.select(baseSelect)
					.from(favorites)
					.innerJoin(media, eq(favorites.mediaId, media.id))
					.leftJoin(
						movieWatchHistory,
						and(
							eq(movieWatchHistory.mediaId, media.id),
							eq(movieWatchHistory.userId, targetUser.id),
						),
					)
					.leftJoin(
						tvShowWatchHistory,
						and(
							eq(tvShowWatchHistory.mediaId, media.id),
							eq(tvShowWatchHistory.userId, targetUser.id),
						),
					)
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

		const totalResults = Number(totalCount[0]?.count ?? 0);

		// get TV show progress if needed
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
						entry.mediaType as "movie" | "tv",
						language,
					);
					if (!details) return null;

					const rating =
						entry.mediaType === "movie" ? entry.movieRating : entry.tvRating;

					const watchedAt =
						entry.mediaType === "movie"
							? entry.movieWatchedAt
							: entry.tvWatchedAt;

					return {
						...details,
						mediaType: entry.mediaType,
						addedAt: entry.addedAt,
						rating,
						watchedAt,
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
	},
);

export default userFavoriteRoutes;
