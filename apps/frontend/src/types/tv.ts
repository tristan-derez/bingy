import type { Pretty } from "./generic";

export type TvEndPoints = Pretty<
	| ""
	| "aggregate_credits"
	| "alternative_titles"
	| "content_ratings"
	| "credits"
	| "episode_groups"
	| "external_ids"
	| "images"
	| "keywords"
	| "lists"
	| "recommendations"
	| "reviews"
	| "screened_theatrically"
	| "similar"
	| "translations"
	| "videos"
	| "watch/providers"
>;

export type TvSeasonEndpoints = Pretty<
	| ""
	| "aggregate_credits"
	| "credits"
	| "external_ids"
	| "images"
	| "translations"
	| "videos"
	| "watch/providers"
>;

export type TvEpisodeEndpoints = Pretty<
	"" | "credits" | "external_ids" | "images" | "translations" | "videos"
>;

export type TvParams = Pretty<{
	language?: string;
	append_to_response?: string;
	page?: number;
	region?: string;
}>;
