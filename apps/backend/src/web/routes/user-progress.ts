import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { tvShowProgress, tvShowWatchHistory } from "../../db/schemas/list";
import type { User } from "../../db/schemas/user";
import { db } from "../../lib/database";
import { sessionMiddleware } from "../../web/middlewares/session";
import { getOrCreateMedia } from "../../web/utils/create-update-media";
import {
	convertAbsoluteToSeasonEpisode,
	getValidSeason,
} from "../../web/utils/tv-helper";

type Variables = {
	user: User | null;
	session: unknown;
};

const userProgressRoutes = new Hono<{ Variables: Variables }>();

userProgressRoutes.use("*", sessionMiddleware);

// get all tv shows with pending episodes for a user
userProgressRoutes.get("/:username/tv", async (c) => {});

// get a tv show progress from an user by username
// @todo: get every tv shows progress
userProgressRoutes.get("/:username/tv/:tmdbId", async (c) => {});

// create entry in progress for tv - seasonNumber and episodeNumber are the last episode the user watched
// user must be logged in
userProgressRoutes.post(
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
			absoluteEpisode: z.number().optional(),
			trackingMode: z.enum(["season", "absolute"]).optional(),
		}),
	),
	async (c) => {},
);

export default userProgressRoutes;
