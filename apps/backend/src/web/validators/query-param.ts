import { z } from "zod";

export const idParamSchema = z.object({
	id: z.coerce.number(),
});

export const externalIdParamSchema = z.object({
	external_id: z.string(),
});

export const creditIdSchemas = z.object({
	credit_id: z.string(),
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

export const queryParamsDiscoverMovieSchema = z.object({
	certification: z.string().optional(),
	"certification.gte": z.string().optional(),
	"certification.lte": z.string().optional(),
	certification_country: z.string().optional(),
	include_adult: z.coerce.boolean().optional(),
	include_video: z.coerce.boolean().optional(),
	language: z.string().default("en-US"),
	page: z.coerce.number().default(1),
	primary_release_year: z.coerce.number().optional(),
	"primary_release_date.gte": z.string().optional(),
	"primary_release_date.lte": z.string().optional(),
	region: z.string().optional(),
	"release_date.gte": z.string().optional(),
	"release_date.lte": z.string().optional(),
	sort_by: z
		.enum([
			"original_title.asc",
			"original_title.desc",
			"popularity.asc",
			"popularity.desc",
			"revenue.asc",
			"revenue.desc",
			"primary_release_date.asc",
			"title.asc",
			"title.desc",
			"primary_release_date.desc",
			"vote_average.asc",
			"vote_average.desc",
			"vote_count.asc",
			"vote_count.desc",
		])
		.optional(),
	"vote_average.gte": z.coerce.number().optional(),
	"vote_average.lte": z.coerce.number().optional(),
	"vote_count.gte": z.coerce.number().optional(),
	"vote_count.lte": z.coerce.number().optional(),
	watch_region: z.string().optional(),
	with_cast: z.string().optional(),
	with_companies: z.string().optional(),
	with_crew: z.string().optional(),
	with_genres: z.string().optional(),
	with_keywords: z.string().optional(),
	with_origin_country: z.string().optional(),
	with_original_language: z.string().optional(),
	with_people: z.string().optional(),
	with_release_type: z.coerce.number().optional(),
	"with_runtime.gte": z.coerce.number().optional(),
	"with_runtime.lte": z.coerce.number().optional(),
	with_watch_monetization_types: z.string().optional(),
	with_watch_providers: z.string().optional(),
	without_companies: z.string().optional(),
	without_genres: z.string().optional(),
	without_keywords: z.string().optional(),
	without_watch_providers: z.string().optional(),
	year: z.coerce.number().optional(),
});

export const queryParamsDiscoverTvSchema = z.object({
	"air_date.gte": z.string().optional(),
	"air_date.lte": z.string().optional(),
	first_air_date_year: z.coerce.number().optional(),
	"first_air_date.gte": z.string().optional(),
	"first_air_date.lte": z.string().optional(),
	include_adult: z.coerce.boolean().optional(),
	include_null_first_air_dates: z.coerce.boolean().optional(),
	language: z.string().default("en-US"),
	page: z.coerce.number().default(1),
	screened_theatrically: z.coerce.boolean().optional(),
	sort_by: z
		.enum([
			"first_air_date.asc",
			"first_air_date.desc",
			"name.asc",
			"name.desc",
			"original_name.asc",
			"original_name.desc",
			"popularity.asc",
			"popularity.desc",
			"vote_average.asc",
			"vote_average.desc",
			"vote_count.asc",
			"vote_count.desc",
		])
		.optional(),
	timezone: z.string().optional(),
	"vote_average.gte": z.coerce.number().optional(),
	"vote_average.lte": z.coerce.number().optional(),
	"vote_count.gte": z.coerce.number().optional(),
	"vote_count.lte": z.coerce.number().optional(),
	watch_region: z.string().optional(),
	with_companies: z.string().optional(),
	with_genres: z.string().optional(),
	with_keywords: z.string().optional(),
	with_networks: z.coerce.number().optional(),
	with_origin_country: z.string().optional(),
	with_original_language: z.string().optional(),
	"with_runtime.gte": z.coerce.number().optional(),
	"with_runtime.lte": z.coerce.number().optional(),
	with_status: z.string().optional(),
	with_watch_monetization_types: z.string().optional(),
	with_watch_providers: z.string().optional(),
	without_companies: z.string().optional(),
	without_genres: z.string().optional(),
	without_keywords: z.string().optional(),
	without_watch_providers: z.string().optional(),
	with_type: z.string().optional(),
});

export const queryParamsFindByExternalId = z.object({
	external_source: z.enum([
		"imdb_id",
		"facebook_id",
		"instagram_id",
		"tvdb_id",
		"tiktok_id",
		"twitter_id",
		"wikidata_id",
		"youtube_id",
	]),
	language: z.string().default("en-US"),
});

const appendOptions = z.union([
	z.literal("combined_credits"),
	z.literal("external_ids"),
	z.literal("translations"),
	z.literal("combined_credits,external_ids"),
	z.literal("external_ids,combined_credits"),
	z.literal("combined_credits,translations"),
	z.literal("external_ids,translations"),
	z.literal("combined_credits,external_ids,translations"),
	z.literal("external_ids,combined_credits,translations"),
	z.literal("credits,external_ids,watch/providers"),
	z.literal("aggregate_credits,external_ids,watch/providers"),
]);

export const queryParamsAppendToResponse = z.object({
	language: z.string().optional(),
	append_to_response: appendOptions.optional(),
});
