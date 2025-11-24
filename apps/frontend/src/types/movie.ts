import type { Collection } from "./collection";
import type { Pretty } from "./generic";
import type { PersonFromCast, PersonFromCrew } from "./person";

export type Movie = Pretty<{
	id: number;
	title: string;
	original_title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	video: boolean;
	release_date: string;
	vote_average: number;
	vote_count: number;
	popularity: number;
	genre_ids: number[];
	adult: boolean;
}>;

export interface MovieDetails {
	id: number;
	title: string;
	belongs_to_collection: Pretty<Collection>;
	original_title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	tagline: string;
	status: string;
	runtime: number;
	budget: number;
	revenue: number;
	homepage: string;
	genres: Genre[];
	production_companies: Company[];
	production_countries: Country[];
}

export type MoviesEndpoint = Pretty<
	"latest" | "now_playing" | "popular" | "top_rated" | "upcoming"
>;

export type MovieEndpoint = Pretty<
	| "alternative_titles"
	| "credits"
	| "external_ids"
	| "images"
	| "keywords"
	| "lists"
	| "recommendations"
	| "release_dates"
	| "reviews"
	| "similar"
	| "translations"
	| "videos"
	| "watch/providers"
>;

export type MovieParams = Pretty<{
	language?: string;
	page?: number;
	region?: string;
}>;

export type Genre = Pretty<{
	id: number;
	name: string;
}>;

export type Country = Pretty<{
	iso_3166_1: string;
	name: string;
}>;

export type Company = Pretty<{
	id: number;
	name: string;
	logo_path?: string | null;
}>;

export type MovieCredits = Pretty<{
	id: number;
	cast: PersonFromCast[];
	crew: PersonFromCrew[];
}>;

export type MovieExternalIds = Pretty<{
	id: number;
	imdb_id: string | null;
	wikidata_id: string | null;
	facebook_id: string | null;
	instagram_id: string | null;
	twitter_id: string | null;
}>;

export type MovieInCollection = Pretty<{
	adult: boolean;
	backdrop_path: string | null;
	id: number;
	title: string;
	original_title: string;
	overview: string;
	poster_path: string | null;
	media_type: string;
	original_language: string;
	genre_ids: number[];
	popularity: number;
	release_date: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}>;
