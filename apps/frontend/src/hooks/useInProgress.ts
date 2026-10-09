import { useQuery } from "@tanstack/react-query";
import { type GetInProgressResponse, getInProgress } from "@/api/in-progress";

export function useInProgress(
	username: string,
	page = 1,
	language = "en-US",
	limit = 24,
) {
	return useQuery({
		queryKey: ["in-progress", username, page, language, limit],
		queryFn: (): Promise<GetInProgressResponse> =>
			getInProgress(username, page, language, limit),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}