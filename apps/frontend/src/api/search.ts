import { apiFetch } from "./fetcher";

export const fetchSearchMulti = async (
	query: string,
	options?: SearchOptions,
) => {
	const { page = 1, language = "en-US" } = options ?? {};

	const res = await apiFetch(`/search/multi`, {
		method: "GET",
		query: { query, page, language },
	});

	return res.data;
};

export const fetchSearchMovie = async (
	query: string,
	options?: SearchOptions,
) => {
	const { page = 1, language = "en-US" } = options ?? {};

	const res = await apiFetch(`/search/movie`, {
		method: "GET",
		query: { query, page, language },
	});

	return res.data;
};

export const fetchSearchTv = async (query: string, options?: SearchOptions) => {
	const { page = 1, language = "en-US" } = options ?? {};

	const res = await apiFetch(`/search/tv`, {
		method: "GET",
		query: { query, page, language },
	});

	return res.data;
};

interface SearchOptions {
	page?: number;
	language?: string;
}
