import { toast } from "sonner";
import { useTopRatedTv } from "@/hooks/useTv";
import type { Tv } from "@/types/tv";
import { LoadingSection } from "../loading/loading-section";
import { TvCarousel } from "./tv-carousel";

interface TopRatedTvProps {
	title: string;
}

export const TopRatedTv = ({ title }: TopRatedTvProps) => {
	const { data, isLoading, error } = useTopRatedTv({ region: "US" });

	if (isLoading) {
		return <LoadingSection title={title} />;
	}

	if (error) {
		toast.error(`Failed to load ${title}`);
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

	return <TvCarousel tvShows={filteredTv} title={title} />;
};
