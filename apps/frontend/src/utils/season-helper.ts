interface Episode {
	air_date: string | null;
	episode_number: number;
	season_number: number;
	id: number;
	name: string;
}

interface Season {
	air_date: string | null;
	episode_count: number;
	season_number: number;
}

interface TvDetails {
	seasons?: Season[];
	last_episode_to_air?: Episode | null;
	number_of_episodes?: number;
}

/**
 * Detects if a TV show uses continuous/absolute episode numbering
 * (common in anime) vs per-season numbering (common in western TV shows)
 */
export function getHasContinuousEpisodeNumbering(
	tvDetails: TvDetails | undefined,
): boolean {
	if (!tvDetails?.last_episode_to_air || !tvDetails.seasons) {
		return false;
	}

	const lastEpisode = tvDetails.last_episode_to_air;
	const { season_number, episode_number } = lastEpisode;

	// Calculate total episodes before this season
	const episodesBeforeSeason = tvDetails.seasons
		.filter((s) => s.season_number > 0 && s.season_number < season_number)
		.reduce((sum, s) => sum + s.episode_count, 0);

	// If episode_number is much larger than episodes in current season,
	// it's likely using continuous numbering
	const currentSeason = tvDetails.seasons.find(
		(s) => s.season_number === season_number,
	);

	if (!currentSeason) return false;

	// If episode number exceeds current season's episode count,
	// it's definitely continuous numbering
	if (episode_number > currentSeason.episode_count) {
		return true;
	}

	// Additional check: if the episode number is close to total episodes
	// accumulated up to this season, it's continuous numbering
	const expectedContinuousEpisode = episodesBeforeSeason + episode_number;
	const totalEpisodes = tvDetails.number_of_episodes ?? 0;

	// If we're close to the total and episode number is high, likely continuous
	return (
		episode_number > 100 &&
		Math.abs(expectedContinuousEpisode - totalEpisodes) < 50
	);
}

export function getValidSeasons(seasons: Season[] | undefined): Season[] {
	if (!seasons) return [];

	const now = new Date();

	return seasons.filter((season) => {
		if (season.season_number === 0) return false;
		// Only filter by air_date if it exists
		if (season.air_date && new Date(season.air_date) > now) return false;
		return true;
	});
}

export function getLastAiredEpisodeInfo(tvDetails: TvDetails | undefined): {
	seasonNumber: number;
	episodeNumber: number;
} | null {
	if (!tvDetails?.last_episode_to_air) return null;

	const { season_number, episode_number } = tvDetails.last_episode_to_air;

	// For shows with continuous episode numbering, calculate the episode within the season
	const season = tvDetails.seasons?.find(
		(s) => s.season_number === season_number,
	);

	if (season && getHasContinuousEpisodeNumbering(tvDetails)) {
		// Calculate episodes before this season
		const episodesBeforeSeason =
			tvDetails.seasons
				?.filter((s) => s.season_number > 0 && s.season_number < season_number)
				.reduce((sum, s) => sum + s.episode_count, 0) ?? 0;

		// Episode number within current season
		const episodeInSeason = episode_number - episodesBeforeSeason;

		return {
			seasonNumber: season_number,
			episodeNumber: Math.min(episodeInSeason, season.episode_count),
		};
	}

	return {
		seasonNumber: season_number,
		episodeNumber: episode_number,
	};
}
