import { useQuery } from "@tanstack/react-query";
import { type CollectionParams, fetchCollection } from "@/api/collection";

export function useCollection(id: number, params?: CollectionParams) {
	return useQuery({
		queryKey: ["collection", id, params],
		queryFn: () => fetchCollection(id, params),
		staleTime: 1000 * 60 * 50,
	});
}
