import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "@/api/collections";
import type { CollectionParams } from "@/types/collection";

export function useCollection(id: number, params?: CollectionParams) {
	return useQuery({
		queryKey: ["collection", id],
		queryFn: () => fetchCollection(id, params),
		staleTime: 1000 * 60 * 50,
	});
}
