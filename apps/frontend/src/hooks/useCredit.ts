import { useQuery } from "@tanstack/react-query";
import { fetchCredit } from "@/api/credit";

export function useCredit(id: string) {
	return useQuery({
		queryKey: ["credit", id],
		queryFn: () => fetchCredit(id),
		staleTime: 1000 * 60 * 50,
	});
}
