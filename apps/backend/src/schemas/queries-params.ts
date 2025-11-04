import { z } from "zod";

export const idParamSchema = z.object({
	id: z.coerce.number(),
});

export const idWithSeasonNumberSchema = z.object({
	id: z.coerce.number(),
	season_number: z.coerce.number(),
});

export const idWithSeasonNumberAndEpisodeNumber = z.object({
	id: z.coerce.number(),
	season_number: z.coerce.number(),
	episode_number: z.coerce.number(),
});

export const tvEpisodeGroupId = z.object({
	tv_episode_group_id: z.string(),
});

export const languageQuerySchema = z.object({
	language: z.string().default("en-US"),
});

export const paginationQuerySchema = z.object({
	language: z.string().default("en-US"),
	page: z.coerce.number().default(1),
});

export const countryQuerySchema = z.object({
	country: z.string().default("US"),
});

export const queryParamsTrending = z.object({
	language: z.string().default("en-US"),
	page: z.coerce.number().default(1),
	region: z.string().default("US"),
});
