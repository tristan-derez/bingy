import { cacheClient } from "#lib/cache-client";
import { logger } from "#lib/logger";
import { tmdbClient } from "./tmdb.client";

export type TvDetails = {
	id: number;
	title: string;
	originalTitle: string;
	releaseDate: string;
	posterPath: string | null;
	voteAverage: number;
	numberOfEpisodes: number;
	numberOfSeasons: number;
	lastEpisodeToAir?: {
		seasonNumber: number;
		episodeNumber: number;
	};
	seasons: Array<{ seasonNumber: number; episodeCount: number }>;
};

export async function getTvDetails(
	id: number,
	language: string,
): Promise<TvDetails | null> {
	const cacheKey = `tmdb:tv:full:${id}:${language}`;

	const cached = await cacheClient.get(cacheKey);
	if (cached) {
		logger.info(`Cache hit: ${cacheKey}`);
		return JSON.parse(cached);
	}

	try {
		const tv = await tmdbClient.get("/tv/{series_id}", {
			path: { series_id: id },
			query: { language },
		});
		if (!tv) return null;

		const details: TvDetails = {
			id: tv.id,
			title: tv.name,
			originalTitle: tv.original_name,
			releaseDate: tv.first_air_date,
			posterPath: tv.poster_path,
			voteAverage: tv.vote_average,
			numberOfEpisodes: tv.number_of_episodes,
			numberOfSeasons: tv.number_of_seasons,
			lastEpisodeToAir: tv.last_episode_to_air
				? {
						seasonNumber: tv.last_episode_to_air.season_number,
						episodeNumber: tv.last_episode_to_air.episode_number,
					}
				: undefined,
			seasons: (tv.seasons ?? []).map((s) => ({
				seasonNumber: s.season_number,
				episodeCount: s.episode_count,
			})),
		};

		await cacheClient.set(cacheKey, JSON.stringify(details), 86400);
		logger.info(`Cache set: ${cacheKey}`);
		return details;
	} catch {
		return null;
	}
}
