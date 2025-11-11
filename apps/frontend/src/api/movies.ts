import { config } from "@/lib/env";
import type { MovieEndpoint, MovieParams } from "@/types/movie";

export const fetchMovies = async (
	endpoint: MovieEndpoint,
	params?: MovieParams,
) => {
	const url = new URL(`${config.apiUrl}/api/movies/${endpoint}`);
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) url.searchParams.set(key, String(value));
		});
	}

	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch movies");
	return res.json();
};

export const fetchMovie = async (
	id: string,
	params?: { language?: string },
) => {
	const url = new URL(`${config.apiUrl}/api/movies/${id}`);
	if (params?.language) url.searchParams.set("language", params.language);

	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch movie");
	return res.json();
};

export const fetchMovieCredits = async (id: string, language?: string) => {
	const url = new URL(`${config.apiUrl}/api/movies/${id}/credits`);
	if (language) url.searchParams.set("language", language);

	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch credits");
	return res.json();
};
