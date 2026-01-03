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
}

export function getValidSeasons(seasons: Season[] | undefined): Season[] {
	if (!seasons) return [];

	const now = new Date();

	return seasons.filter((season) => {
		if (season.season_number === 0 || !season.air_date) return false;
		return new Date(season.air_date) <= now;
	});
}

export function getLastAiredEpisodeInfo(tvDetails: TvDetails | undefined): {
	seasonNumber: number;
	episodeNumber: number;
} | null {
	if (!tvDetails) return null;

	// Use last_episode_to_air if available
	if (tvDetails.last_episode_to_air) {
		const { season_number, episode_number } = tvDetails.last_episode_to_air;
		return {
			seasonNumber: season_number,
			episodeNumber: episode_number,
		};
	}

	// Fallback: find last aired season
	const airedSeasons = getValidSeasons(tvDetails.seasons);
	if (airedSeasons.length > 0) {
		const lastSeason = airedSeasons[airedSeasons.length - 1];
		return {
			seasonNumber: lastSeason.season_number,
			episodeNumber: lastSeason.episode_count,
		};
	}

	return null;
}
