import type {
	NetworkDetails,
	ProductionCompany,
	ProductionCountry,
} from "./company";
import type { EpisodeWithCrewAndGuestStars } from "./episode";
import type { Pretty } from "./generic";
import type {
	CastPersonInAggregatedTvCredits,
	CrewPersonInAggregatedTvCredits,
	PersonFromCast,
	PersonFromCrew,
	PersonShort,
} from "./person";

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
	| "latest"
	| "top_rated"
	| "popular"
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

export type Tv = Pretty<{
	adult: boolean;
	backdrop_path: string | null;
	first_air_date: string;
	genre_ids: number[];
	id: number;
	name: string;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	vote_average: number;
	vote_count: number;
}>;

export type TvWithMediaType = Pretty<
	Tv & {
		media_type: "tv";
	}
>;

type Genre = Pretty<{
	id: number;
	name: string;
}>;

export type MoviesGenres = Pretty<{
	genres: Genre[];
}>;

export type TvGenres = Pretty<{
	genres: Genre[];
}>;

type SpokenLanguage = {
	english_name: string;
	iso_639_1: string;
	name: string;
};

export type TvDetails = Pretty<
	Omit<Tv, "genre_ids"> & {
		created_by: PersonShort[];
		episode_run_time: number[];
		genres: Genre[];
		in_production: string;
		homepage: string;
		languages: string[];
		last_air_date: string;
		last_episode_to_air: Pretty<Omit<Episode, "media_type"> | null>;
		next_episode_to_air: Pretty<Omit<Episode, "media_type"> | null>;
		networks: Pretty<Omit<NetworkDetails, "homepage" | "headquarters">>[];
		number_of_seasons: number;
		number_of_episodes: number;
		production_companies: ProductionCompany[];
		production_countries: ProductionCountry[];
		seasons: (Season & { vote_average: number })[];
		spoken_languages: SpokenLanguage[];
		status: string;
		tagline: string;
		type: string;
	}
>;

export type TvExternalIds = Pretty<{
	id: number;
	imdb_id: string | null;
	freebase_mid: string | null;
	freebase_id: string | null;
	tvdb_id: number | null;
	tvrage_id: number | null;
	wikidata_id: string | null;
	facebook_id: string | null;
	instagram_id: string | null;
	twitter_id: string | null;
}>;

export type Season = Pretty<{
	air_date: string | null;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	season_number: number;
	show_id: number;
}>;

export type SeasonExtended = Pretty<
	Season & {
		media_type: string;
		vote_average: string;
	}
>;

export type Episode = Pretty<{
	id: number;
	name: string;
	overview: string;
	media_type: "tv_episode";
	vote_average: number;
	vote_count: string;
	air_date: string | null;
	episode_number: number;
	episode_type: string;
	production_code: string;
	runtime: number | null;
	season_number: number;
	show_id: number;
	still_path: string | null;
}>;

export type TvCredits = Pretty<{
	cast: PersonFromCast[];
	crew: PersonFromCrew[];
	id: number;
}>;

export type TvAggregatedCredits = Pretty<{
	cast: CastPersonInAggregatedTvCredits[];
	crew: CrewPersonInAggregatedTvCredits[];
	id: number;
}>;

export type TvSeasonDetails = Pretty<{
	_id: string;
	air_date: string | null;
	episodes: EpisodeWithCrewAndGuestStars[];
	name: string;
	networks: ProductionCompany[];
	overview: string;
	id: number;
	poster_path: string | null;
	season_number: number;
	vote_average: number;
}>;
