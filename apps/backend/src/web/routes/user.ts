import { zValidator } from "@hono/zod-validator";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
	customLists,
	favorites,
	listItems,
	media,
	watchlist,
} from "../../db/schemas/list";
import type { User } from "../../db/schemas/user";
import { activity, users } from "../../db/schemas/user";
import { db } from "../../lib/database";
import { getMediaDetails } from "../../lib/tmdb/get-media-details";
import { sessionMiddleware } from "../../web/middlewares/session";

type Variables = {
	user: User | null;
	session: unknown;
};

const userProfileRoutes = new Hono<{ Variables: Variables }>();

userProfileRoutes.use("*", sessionMiddleware);

// Get basic user info
userProfileRoutes.get(
	"/:username",
	zValidator(
		"param",
		z.object({
			username: z.string(),
		}),
	),
	async (c) => {
		const { username } = c.req.valid("param");

		const user = await db.query.users.findFirst({
			where: eq(users.name, username),
			columns: {
				name: true,
				displayName: true,
				avatarUrl: true,
				emailVerified: true,
			},
		});

		if (!user) {
			return c.json({ error: "User not found" }, 404);
		}

		return c.json(user, 200);
	},
);

// Get user activity feed (hydrated, last 5)
userProfileRoutes.get("/:username/activity", async (c) => {
	const { username } = c.req.param();
	const language = c.req.query("language") || "en-US";

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) {
		return c.json({ error: "User not found" }, 404);
	}

	const activities = await db.query.activity.findMany({
		where: eq(activity.userId, targetUser.id),
		orderBy: [desc(activity.createdAt)],
		limit: 5,
		with: {
			movieWatchHistory: {
				with: {
					media: true,
				},
			},
			tvShowWatchHistory: {
				with: {
					media: true,
				},
			},
			tvShowProgress: {
				with: {
					media: true,
				},
			},
			reviewComment: true,
			customList: true,
			watchlist: {
				with: {
					media: true,
				},
			},
		},
	});

	const hydratedActivities = await Promise.all(
		activities.map(async (account) => {
			let mediaDetails = null;

			if (account.movieWatchHistory?.media) {
				mediaDetails = await getMediaDetails(
					account.movieWatchHistory.media.tmdbId,
					"movie",
					language,
				);
			} else if (account.tvShowWatchHistory?.media) {
				mediaDetails = await getMediaDetails(
					account.tvShowWatchHistory.media.tmdbId,
					"tv",
					language,
				);
			} else if (account.tvShowProgress?.media) {
				mediaDetails = await getMediaDetails(
					account.tvShowProgress.media.tmdbId,
					"tv",
					language,
				);
			} else if (account.watchlist?.media) {
				mediaDetails = await getMediaDetails(
					account.watchlist.media.tmdbId,
					account.watchlist.media.mediaType,
					language,
				);
			}

			return {
				...account,
				mediaDetails,
			};
		}),
	);

	return c.json({ data: hydratedActivities });
});

// Get user favorites (last 5 added)
userProfileRoutes.get("/:username/favorites", async (c) => {
	const { username } = c.req.param();
	const language = c.req.query("language") || "en-US";

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) {
		return c.json({ error: "User not found" }, 404);
	}

	const entries = await db
		.select({
			tmdbId: media.tmdbId,
			mediaType: media.mediaType,
			addedAt: favorites.addedAt,
		})
		.from(favorites)
		.innerJoin(media, eq(favorites.mediaId, media.id))
		.where(eq(favorites.userId, targetUser.id))
		.orderBy(desc(favorites.addedAt))
		.limit(5);

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
					addedAt: entry.addedAt,
				};
			}),
		)
	).filter(Boolean);

	return c.json({ data: hydratedData });
});

// Get user watchlist (last 5 added)
userProfileRoutes.get("/:username/watchlist", async (c) => {
	const { username } = c.req.param();
	const language = c.req.query("language") || "en-US";

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) {
		return c.json({ error: "User not found" }, 404);
	}

	const entries = await db
		.select({
			tmdbId: media.tmdbId,
			mediaType: media.mediaType,
			addedAt: watchlist.addedAt,
		})
		.from(watchlist)
		.innerJoin(media, eq(watchlist.mediaId, media.id))
		.where(eq(watchlist.userId, targetUser.id))
		.orderBy(desc(watchlist.addedAt))
		.limit(5);

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
					addedAt: entry.addedAt,
				};
			}),
		)
	).filter(Boolean);

	return c.json({ data: hydratedData });
});

// Get user custom lists with items (3 lists max, 5 first items per list)
userProfileRoutes.get("/:username/lists", async (c) => {
	const { username } = c.req.param();
	const language = c.req.query("language") || "en-US";

	const targetUser = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!targetUser) {
		return c.json({ error: "User not found" }, 404);
	}

	const lists = await db.query.customLists.findMany({
		where: eq(customLists.userId, targetUser.id),
		orderBy: [desc(customLists.createdAt)],
		limit: 3,
	});

	const listsWithItems = await Promise.all(
		lists.map(async (list) => {
			const items = await db
				.select({
					tmdbId: media.tmdbId,
					mediaType: media.mediaType,
					position: listItems.position,
					note: listItems.note,
					addedAt: listItems.addedAt,
				})
				.from(listItems)
				.innerJoin(media, eq(listItems.mediaId, media.id))
				.where(eq(listItems.listId, list.id))
				.orderBy(
					list.type === "ranked"
						? asc(listItems.position)
						: desc(listItems.addedAt),
				)
				.limit(5);

			const hydratedItems = (
				await Promise.all(
					items.map(async (item) => {
						const details = await getMediaDetails(
							item.tmdbId,
							item.mediaType,
							language,
						);
						if (!details) return null;
						return {
							...details,
							mediaType: item.mediaType,
							position: item.position,
							note: item.note,
							addedAt: item.addedAt,
						};
					}),
				)
			).filter(Boolean);

			return {
				...list,
				items: hydratedItems,
			};
		}),
	);

	return c.json({ data: listsWithItems });
});

// Update avatar URL (authenticated)
userProfileRoutes.patch(
	"/avatar",
	zValidator(
		"json",
		z.object({
			avatarUrl: z.url().nullable(),
		}),
	),
	async (c) => {
		const user = c.get("user");

		if (!user) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		const { avatarUrl } = c.req.valid("json");

		const [updated] = await db
			.update(users)
			.set({ avatarUrl })
			.where(eq(users.id, user.id))
			.returning({ avatarUrl: users.avatarUrl });

		return c.json(updated, 200);
	},
);

export default userProfileRoutes;
