interface Season {
	season_number: number;
	episode_count: number;
}

export function convertAbsoluteToSeasonEpisode(
	absoluteEpisode: number,
	seasons: Season[],
): { season: number; episode: number } {
	const validSeasons = seasons
		.filter((s) => s.season_number > 0)
		.sort((a, b) => a.season_number - b.season_number);

	let remaining = absoluteEpisode;

	for (const season of validSeasons) {
		if (remaining <= season.episode_count) {
			return {
				season: season.season_number,
				episode: remaining,
			};
		}
		remaining -= season.episode_count;
	}

	throw new Error(`Absolute episode ${absoluteEpisode} exceeds total episodes`);
}
