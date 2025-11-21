import { toast } from "sonner";
import { useTrendingTodayTv } from "@/hooks/useTv";
import type { Tv } from "@/types/tv";
import { LoadingSection } from "../loading/loading-section";
import { TvCarousel } from "./tv-carousel";

export const TrendingTodayTv = () => {
	const { data, isLoading, error } = useTrendingTodayTv();

	if (isLoading) {
		return <LoadingSection title="Trending Today" />;
	}

	if (error) {
		toast.error("error while fetching trending tv shows");
		return null;
	}

	const seenIds = new Set<number>();

	const filteredTv =
		data?.results.filter((tv: Tv) => {
			if (seenIds.has(tv.id)) {
				return false;
			}
			seenIds.add(tv.id);
			return true;
		}) ?? [];

	return <TvCarousel tvShows={filteredTv} title="Trending Today" />;
};
