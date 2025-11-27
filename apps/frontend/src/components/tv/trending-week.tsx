import type { Schemas } from "shared";
import { toast } from "sonner";
import { useTrendingWeekTv } from "@/hooks/useTv";
import { LoadingSection } from "../loading/loading-section";
import { TvCarousel } from "./tv-carousel";

interface TrendingWeekTvProps {
	title: string;
}

export const TrendingWeekTv = ({ title }: TrendingWeekTvProps) => {
	const { data, isLoading, error } = useTrendingWeekTv();

	if (isLoading) {
		return <LoadingSection title={title} />;
	}

	if (error) {
		toast.error(`Failed to load ${title}`);
		return null;
	}

	const seenIds = new Set<number>();

	const filteredTv =
		data?.results.filter((tv: Schemas.Tv) => {
			if (seenIds.has(tv.id)) {
				return false;
			}
			seenIds.add(tv.id);
			return true;
		}) ?? [];

	return <TvCarousel tvShows={filteredTv} title={title} />;
};
