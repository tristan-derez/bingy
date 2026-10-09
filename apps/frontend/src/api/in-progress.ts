import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const getInProgress = async (
	username: string,
	page = 1,
	language = "en-US",
	limit = 24,
) => {
	const res = await apiFetch<GetInProgressResponse>(
		`/progress/${username}/tv`,
		{
			method: "GET",
			query: { page, language, limit },
		},
	);
	return res;
};

export type WatchProgress = Pretty<{
	id: string;
	lastWatchedSeason: number;
	lastWatchedEpisode: number;
	absoluteEpisode: number | null;
	trackingMode: "season" | "absolute";
	status: string;
	createdAt: Date;
	updatedAt: Date;
}>;

export type NextEpisode = Pretty<{
	id: number;
	name: string;
	overview: string | null;
	air_date: string | null;
	episode_number: number;
	runtime: number | null;
	season_number: number;
	still_path: string | null;
}>;

export type InProgressItem = Pretty<{
	id: number;
	name: string;
	original_name: string;
	poster_path: string | null;
	status: string;
	tagline: string | null;
	last_episode_to_air: {
		id: number;
		season_number: number;
		episode_number: number;
	} | null;
	number_of_seasons: number;
	number_of_episodes: number;
	progress: WatchProgress;
	nextEpisodes: NextEpisode[];
}>;

export type GetInProgressResponse = Pretty<{
	data: InProgressItem[];
	page: number;
	total_pages: number;
	total_results: number;
}>;
