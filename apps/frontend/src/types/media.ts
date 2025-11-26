import type { Pretty } from "./generic";
import type { Episode, Season } from "./tv";

export type Media = MovieMedia | TvMedia;

type BaseMedia = Pretty<{
	adult: boolean;
	backdrop_path: string | null;
	id: number;
	original_language: string;
	overview: string;
	poster_path: string | null;
	media_type: "movie" | "tv";
	genre_ids: number[];
	popularity: number;
	vote_average: number;
	vote_count: number;
	character: string;
}>;

export type MovieMedia = Pretty<
	BaseMedia & {
		media_type: "movie";
		title: string;
		original_title: string;
		release_date: string;
		video: boolean;
	}
>;

export type TvMedia = Pretty<
	BaseMedia & {
		media_type: "tv";
		name: string;
		original_name: string;
		first_air_date: string;
		origin_country: string[];
		episodes: Episode[];
		seasons: Season[];
	}
>;

export type MovieMediaWithCastCredits = Pretty<
	MovieMedia & {
		order: number;
		character: string;
		credit_id: string;
	}
>;

export type TvMediaWithCastCredits = Pretty<
	Omit<TvMedia, "seasons" | "origin_country" | "episodes"> & {
		origin_country: string[];
		credit_id: string;
		department: string;
		character: string;
		first_credit_air_date: string;
	}
>;

export type MediaWithCastCredits =
	| MovieMediaWithCastCredits
	| TvMediaWithCastCredits;

export type MovieMediaWithCrewCredits = Pretty<
	MovieMedia & {
		department: string;
		job: string;
		credit_id: string;
	}
>;

export type TvMediaWithCrewCredits = Pretty<
	Omit<TvMedia, "seasons" | "origin_country" | "episodes"> & {
		first_credit_air_date: string;
		department: string;
		credit_id: string;
		origin_country: string[];
	}
>;

export type MediaWithCrewCredits =
	| MovieMediaWithCrewCredits
	| TvMediaWithCrewCredits;
