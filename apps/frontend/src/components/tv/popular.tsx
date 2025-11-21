import { toast } from "sonner";
import { usePopularTv } from "@/hooks/useTv";
import type { Tv } from "@/types/tv";
import { LoadingSection } from "../loading/loading-section";
import { TvCarousel } from "./tv-carousel";

export const PopularTv = () => {
	const { data, isLoading, error } = usePopularTv({ region: "US" });

	if (isLoading) {
		return <LoadingSection title="Popular" />;
	}

	if (error) {
		toast.error("error while fetching popular tv shows");
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

	return <TvCarousel tvShows={filteredTv} title="Popular" />;
};
