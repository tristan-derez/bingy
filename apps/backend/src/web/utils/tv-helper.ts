import type { Schemas } from "shared";
import { TmdbError, tmdbClient } from "../../lib/tmdb/tmdb-client";

interface Season {
	season_number: number;
	episode_count: number;
}

export type NextTvEpisode = Pick<
	Schemas.TvSeasonDetails["episodes"][number],
	| "id"
	| "name"
	| "overview"
	| "air_date"
	| "episode_number"
	| "runtime"
	| "season_number"
	| "still_path"
>;

/**
 *
 * @param seasons
 * @returns
 */
export function getValidSeason(seasons: Season[]): Season[] {
	return seasons
		.filter((s) => s.season_number > 0)
		.sort((a, b) => a.season_number - b.season_number);
}

export function convertAbsoluteToSeasonEpisode(
	absoluteEpisode: number,
	seasons: Season[],
): { season: number; episode: number } {
	const validSeasons = getValidSeason(seasons);

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

export function convertSeasonEpisodeToAbsolute(
	seasonNumber: number,
	episodeNumber: number,
	seasons: Season[],
): number {
	let offset = 0;

	for (const season of getValidSeason(seasons)) {
		if (season.season_number === seasonNumber) {
			if (episodeNumber < 1 || episodeNumber > season.episode_count) {
				throw new Error(
					`Episode ${episodeNumber} does not exist in season ${seasonNumber}`,
				);
			}
			return offset + episodeNumber;
		}
		offset += season.episode_count;
	}

	throw new Error(`Season ${seasonNumber} does not exist`);
}

export async function getSeasonEpisodeFromAbsolute(
	tmdbId: number,
	absoluteEpisode: number,
	language: string,
): Promise<{ season: number; episode: number }> {
	const tvDetails = await tmdbClient.get("/tv/{series_id}", {
		query: { language },
		path: { series_id: tmdbId },
	});

	return convertAbsoluteToSeasonEpisode(absoluteEpisode, tvDetails.seasons);
}

export async function getAbsoluteFromSeasonEpisode(
	tmdbId: number,
	seasonNumber: number,
	episodeNumber: number,
	language: string,
): Promise<number> {
	const tvDetails = await tmdbClient.get("/tv/{series_id}", {
		query: { language },
		path: { series_id: tmdbId },
	});

	return convertSeasonEpisodeToAbsolute(
		seasonNumber,
		episodeNumber,
		tvDetails.seasons,
	);
}

export function getSeasonsAfterEpisode(
	seasons: Season[],
	lastWatchedSeason: number,
	lastWatchedEpisode: number,
): Season[] {
	return getValidSeason(seasons).filter(
		(season) =>
			season.season_number > lastWatchedSeason ||
			(season.season_number === lastWatchedSeason &&
				lastWatchedEpisode < season.episode_count),
	);
}

export function isEpisodeAired(
	airDate: string | null,
	date = new Date(),
	graceDays = 7,
): boolean {
	if (!airDate) return false;

	const episodeAirTime = new Date(`${airDate}T00:00:00.000Z`).getTime();
	if (!Number.isFinite(episodeAirTime)) return false;

	const cutoff = date.getTime() + graceDays * 24 * 60 * 60 * 1000;
	return episodeAirTime <= cutoff;
}

export function getNextAiredEpisodesFromSeason(
	season: Schemas.TvSeasonDetails,
	lastWatchedSeason: number,
	lastWatchedEpisode: number,
	limit: number,
	date = new Date(),
	graceDays = 7,
): { episodes: NextTvEpisode[]; shouldContinue: boolean } {
	const episodes: NextTvEpisode[] = [];
	const candidates = season.episodes
		.filter(
			(episode) =>
				episode.season_number > lastWatchedSeason ||
				(episode.season_number === lastWatchedSeason &&
					episode.episode_number > lastWatchedEpisode),
		)
		.sort((a, b) => a.episode_number - b.episode_number);

	for (const episode of candidates) {
		if (episodes.length >= limit) break;

		if (!isEpisodeAired(episode.air_date, date, graceDays)) {
			return { episodes, shouldContinue: false };
		}

		episodes.push({
			id: episode.id,
			name: episode.name,
			overview: episode.overview,
			air_date: episode.air_date,
			episode_number: episode.episode_number,
			runtime: episode.runtime,
			season_number: episode.season_number,
			still_path: episode.still_path,
		});
	}

	return { episodes, shouldContinue: episodes.length < limit };
}

const NEXT_EPISODE_LIMIT = 4;
const AIR_DATE_GRACE_DAYS = 7;

export async function getNextEpisodesForProgress(
	tmdbId: number,
	tvDetails: Schemas.TvDetails,
	language: string,
	progress: { lastWatchedSeason: number; lastWatchedEpisode: number },
) {
	const nextEpisodes = [];
	const seasonsToCheck = getSeasonsAfterEpisode(
		tvDetails.seasons,
		progress.lastWatchedSeason,
		progress.lastWatchedEpisode,
	);
	const date = new Date();

	for (const season of seasonsToCheck) {
		if (nextEpisodes.length >= NEXT_EPISODE_LIMIT) break;

		let seasonDetails: Schemas.TvSeasonDetails;
		try {
			seasonDetails = await tmdbClient.get(
				"/tv/{series_id}/season/{season_number}",
				{
					query: { language },
					path: { series_id: tmdbId, season_number: season.season_number },
				},
			);
		} catch (error) {
			if (error instanceof TmdbError && error.status === 404) continue;
			throw error;
		}

		const result = getNextAiredEpisodesFromSeason(
			seasonDetails,
			progress.lastWatchedSeason,
			progress.lastWatchedEpisode,
			NEXT_EPISODE_LIMIT - nextEpisodes.length,
			date,
			AIR_DATE_GRACE_DAYS,
		);

		nextEpisodes.push(...result.episodes);
		if (!result.shouldContinue) break;
	}

	return nextEpisodes;
}
