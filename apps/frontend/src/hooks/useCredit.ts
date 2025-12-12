import { useQuery } from "@tanstack/react-query";
import { type CreditParams, fetchCredit } from "@/api/credit";

export function useCredit(id: string, params: CreditParams) {
	return useQuery({
		queryKey: ["credit", id],
		queryFn: () => fetchCredit(id, params),
		staleTime: 1000 * 60 * 50,
	});
}
