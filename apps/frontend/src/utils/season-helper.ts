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
 * Tries to detects if a TV show uses continuous/absolute episode numbering
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

	const currentSeason = tvDetails.seasons.find(
		(s) => s.season_number === season_number,
	);

	if (!currentSeason) return false;

	// Calculate total episodes before this season
	const episodesBeforeSeason = tvDetails.seasons
		.filter((s) => s.season_number > 0 && s.season_number < season_number)
		.reduce((sum, s) => sum + s.episode_count, 0);

	// If episode_number > all previous episodes, it's counting from episode 1 (continuous)
	// Ex: One Piece S22E1155 - there were ~1100 episodes before S22, so 1155 > 1100
	// If episode_number < all previous episodes, it restarted counting each season (per-season)
	// Ex: Plus belle la vie S18E310 - there were > 4000 episodes before S18, so 310 < 4300
	return episode_number > episodesBeforeSeason;
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

		// If calculation produces invalid result, fall back to raw episode_number
		// (happens when TMDB data is inconsistent about numbering scheme)
		if (episodeInSeason <= 0 || episodeInSeason > season.episode_count) {
			return {
				seasonNumber: season_number,
				episodeNumber: Math.min(episode_number, season.episode_count),
			};
		}

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
