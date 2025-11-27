import { useQuery } from "@tanstack/react-query";
import { fetchPerson } from "@/api/person";
import type { PersonParams } from "@/types/person";

export function usePersonDetails<T>(id: number, params?: PersonParams) {
	return useQuery<T>({
		queryKey: ["person", id, params],
		queryFn: () => fetchPerson(id, params),
		staleTime: 1000 * 60 * 10,
	});
}
