import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	fetchSearchMovie,
	fetchSearchMulti,
	fetchSearchTv,
} from "@/api/search";

export function useSearchQuery<T>(
	query: string,
	{ language = "en-US" }: { language?: string },
	{ enabled = true }: { enabled?: boolean } = {},
) {
	const [debouncedQuery, setDebouncedQuery] = useState(query);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500);

		return () => clearTimeout(timer);
	}, [query]);

	return useQuery<T>({
		queryKey: ["search", "multi", debouncedQuery, language],
		queryFn: () => fetchSearchMulti(debouncedQuery, { language }),
		enabled: enabled && debouncedQuery.length > 0,
		staleTime: 5 * 60 * 1000,
	});
}

export function useSearchMovieQuery<T>(
	query: string,
	{ language = "en-US" }: { language?: string },
	{ enabled = true }: { enabled?: boolean } = {},
) {
	const [debouncedQuery, setDebouncedQuery] = useState(query);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500);

		return () => clearTimeout(timer);
	}, [query]);

	return useQuery<T>({
		queryKey: ["search", "movie", debouncedQuery, language],
		queryFn: () => fetchSearchMovie(debouncedQuery, { language }),
		enabled: enabled && debouncedQuery.length > 0,
		staleTime: 5 * 60 * 1000,
	});
}

export function useSearchTvQuery<T>(
	query: string,
	{ language = "en-US" }: { language?: string },
	{ enabled = true }: { enabled?: boolean } = {},
) {
	const [debouncedQuery, setDebouncedQuery] = useState(query);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500);

		return () => clearTimeout(timer);
	}, [query]);

	return useQuery<T>({
		queryKey: ["search", "tv", debouncedQuery, language],
		queryFn: () => fetchSearchTv(debouncedQuery, { language }),
		enabled: enabled && debouncedQuery.length > 0,
		staleTime: 5 * 60 * 1000,
	});
}
