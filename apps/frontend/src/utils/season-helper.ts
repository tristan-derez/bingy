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
 * Filters out Season 0 (Specials) and any seasons that haven't aired yet.
 */
export function getValidSeasons(seasons: Season[] | undefined): Season[] {
	if (!seasons) return [];

	const now = new Date();
	return seasons.filter(
		(s) => s.season_number > 0 && (!s.air_date || new Date(s.air_date) <= now),
	);
}

/**
 * Returns a unified object containing the normalized last episode
 * and the list of valid seasons.
 */
export function getTvShowProgress(tvDetails: TvDetails | undefined) {
	if (!tvDetails) return null;

	const validSeasons = getValidSeasons(tvDetails.seasons);
	const lastEp = tvDetails.last_episode_to_air;

	if (!lastEp) {
		return { validSeasons, lastAired: null };
	}

	const { season_number: lastSznNum, episode_number: lastEpNum } = lastEp;

	let episodesBefore = 0;
	let currentSeasonTotal = 0;

	(tvDetails.seasons || []).forEach((s) => {
		if (s.season_number > 0 && s.season_number < lastSznNum) {
			episodesBefore += s.episode_count;
		} else if (s.season_number === lastSznNum) {
			currentSeasonTotal = s.episode_count;
		}
	});

	/**
	 * Logic: Only consider "Continuous Numbering" if:
	 * 1. We are beyond Season 1.
	 * 2. The episode number is greater than the total episodes in the current season.
	 * 3. The episode number looks like an absolute count (greater than episodes before).
	 */
	const isContinuous =
		lastSznNum > 1 &&
		lastEpNum > currentSeasonTotal &&
		lastEpNum > episodesBefore;

	let normalizedEpisode = lastEpNum;

	if (isContinuous) {
		const calculated = lastEpNum - episodesBefore;
		// If the subtraction results in a valid episode index, use it.
		// Otherwise, fallback to the provided number or the season cap.
		normalizedEpisode = calculated > 0 ? calculated : lastEpNum;
	}

	// Final safety: never let the episode number exceed the season's episode count
	if (currentSeasonTotal > 0) {
		normalizedEpisode = Math.min(normalizedEpisode, currentSeasonTotal);
	}

	return {
		validSeasons,
		lastAired: {
			seasonNumber: lastSznNum,
			episodeNumber: normalizedEpisode,
			isContinuous,
		},
	};
}
