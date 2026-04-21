interface Season {
	season_number: number;
	episode_count: number;
}

/**
 *
 * @param seasons
 * @returns seasons without the special season (season 0) and order them by season number
 */
export function getValidSeason(seasons: Season[]): Season[] {
	return seasons
		.filter((s) => s.season_number > 0)
		.sort((a, b) => a.season_number - b.season_number);
}

export function convertAbsoluteToSeasonEpisode(
	absoluteEpisode: number,
	seasons: Season[],
): Season {
	const validSeasons = getValidSeason(seasons);

	let remaining = absoluteEpisode;

	for (const season of validSeasons) {
		if (remaining <= season.episode_count) {
			return {
				season_number: season.season_number,
				episode_count: remaining,
			};
		}
		remaining -= season.episode_count;
	}

	throw new Error(`Absolute episode ${absoluteEpisode} exceeds total episodes`);
}
