import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchSearchMulti } from "@/api/search";

export function useSearchQuery<T>(query: string, language = "en-US") {
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
		enabled: debouncedQuery.length > 0,
		staleTime: 5 * 60 * 1000,
	});
}
