import { zValidator } from "@hono/zod-validator";
import { asc, desc, eq } from "drizzle-orm";
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
import { logger } from "../../lib/logger";
import { getMediaDetails } from "../../lib/tmdb/get-media-details";
import { sessionMiddleware } from "../../web/middlewares/session";
import { deleteImageByUrl, uploadImage } from "../../web/utils/image";
import { processImage } from "../../web/utils/process-image";
import { validateImage } from "../../web/validators/image";

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
				bio: true,
				location: true,
			},
		});

		if (!user) {
			return c.json({ error: "USER_NOT_FOUND" }, 404);
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
		return c.json({ error: "USER_NOT_FOUND" }, 404);
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
		return c.json({ error: "USER_NOT_FOUND" }, 404);
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
		return c.json({ error: "USER_NOT_FOUND" }, 404);
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
		return c.json({ error: "USER_NOT_FOUND" }, 404);
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

// Update user avatar
userProfileRoutes.patch("/avatar", async (c) => {
	const sessionUser = c.get("user");
	if (!sessionUser) return c.json({ error: "Unauthorized" }, 401);

	try {
		const currentUser = await db.query.users.findFirst({
			where: eq(users.id, sessionUser.id),
		});

		if (!currentUser) {
			return c.json({ error: "USER_NOT_FOUND" }, 404);
		}

		const oldAvatarUrl = currentUser.avatarUrl;

		const body = await c.req.parseBody();
		const file = body.avatar;
		const buffer = await validateImage(file);
		const optimized = await processImage(buffer);

		const newKey = `avatars/${sessionUser.id}-${Date.now()}.webp`;
		const newAvatarUrl = await uploadImage(optimized, newKey);

		const [updated] = await db
			.update(users)
			.set({ avatarUrl: newAvatarUrl })
			.where(eq(users.id, sessionUser.id))
			.returning({ avatarUrl: users.avatarUrl });

		if (oldAvatarUrl) {
			deleteImageByUrl(oldAvatarUrl);
		}

		return c.json(updated, 200);
	} catch (err) {
		logger.error(
			{ err, userId: sessionUser.id },
			"Avatar upload process failed",
		);

		return c.json({ error: "UPLOAD_FAILED" }, 400);
	}
});

// Update user bio and location
userProfileRoutes.patch(
	"/",
	zValidator(
		"json",
		z.object({
			bio: z.string().max(160).optional(),
			location: z.string().max(30).optional(),
		}),
	),
	async (c) => {
		const sessionUser = c.get("user");
		if (!sessionUser) return c.json({ error: "Unauthorized" }, 401);
		const body = c.req.valid("json");

		try {
			const [updatedUser] = await db
				.update(users)
				.set({
					bio: body.bio,
					location: body.location,
					updatedAt: new Date(),
				})
				.where(eq(users.id, sessionUser.id))
				.returning();

			if (!updatedUser) {
				return c.json({ error: "USER_NOT_FOUND" }, 404);
			}

			return c.json({ user: updatedUser });
		} catch (err) {
			logger.error(err, "Error while updating user profile");
			return c.json({ error: "FAILED_PROFILE_UPDATE" }, 500);
		}
	},
);

export default userProfileRoutes;
