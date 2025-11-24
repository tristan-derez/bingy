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

type TvMedia = Pretty<
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
