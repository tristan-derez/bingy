import { logger } from "#lib/logger";
import { cacheClient } from "../cache-client";
import { tmdbClient } from "./tmdb.client";

export type NormalizedMedia = {
	id: number;
	title: string;
	originalTitle: string;
	releaseDate: string;
	posterPath: string | null;
	voteAverage: number;
	mediaType: string;
	addedAt: Date;
};

export async function getMediaDetails(
	id: number,
	mediaType: string,
	language: string,
): Promise<Omit<NormalizedMedia, "mediaType" | "addedAt"> | null> {
	const cacheKey = `tmdb:${mediaType}:${id}:${language}`;

	const cached = await cacheClient.get(cacheKey);
	if (cached) {
		logger.info(`Cache hit: ${cacheKey}`);
		return JSON.parse(cached);
	}

	// Fetch from TMDB
	try {
		if (mediaType === "movie") {
			const movie = await tmdbClient.get("/movie/{movie_id}", {
				query: { language },
				path: { movie_id: id },
			});
			if (!movie) return null;

			const details = {
				id: movie.id,
				title: movie.title,
				originalTitle: movie.original_title,
				releaseDate: movie.release_date,
				posterPath: movie.poster_path,
				voteAverage: movie.vote_average,
			};

			await cacheClient.set(cacheKey, JSON.stringify(details), 86400);
			logger.info(`Cache set: ${cacheKey}`);
			return details;
		}

		const tv = await tmdbClient.get("/tv/{series_id}", {
			path: { series_id: id },
			query: { language },
		});
		if (!tv) return null;

		const details = {
			id: tv.id,
			title: tv.name,
			originalTitle: tv.original_name,
			releaseDate: tv.first_air_date,
			posterPath: tv.poster_path,
			voteAverage: tv.vote_average,
		};

		await cacheClient.set(cacheKey, JSON.stringify(details), 86400);
		logger.info(`Cache set: ${cacheKey}`);
		return details;
	} catch {
		return null;
	}
}
