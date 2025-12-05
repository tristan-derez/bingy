import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { toast } from "sonner";
import { useTrendingTodayTv } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { LoadingSection } from "../loading/loading-section";
import { TvCarousel } from "./tv-carousel";

interface TrendingTodayTvProps {
	title: string;
}

export const TrendingTodayTv = ({ title }: TrendingTodayTvProps) => {
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const { data, isLoading, error } = useTrendingTodayTv({
		region,
		language: localeRegion,
	});

	if (isLoading) {
		return <LoadingSection title={title} />;
	}

	if (error) {
		toast.error(m.toast_error_not_found_generic({ title }));
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
