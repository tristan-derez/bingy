export type Movie = {
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
};

export type MoviesEndpoint =
	| "latest"
	| "now_playing"
	| "popular"
	| "top_rated"
	| "upcoming";

export type MovieEndpoint =
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
	| "watch/providers";

export type MovieParams = {
	language?: string;
	page?: number;
	region?: string;
};
