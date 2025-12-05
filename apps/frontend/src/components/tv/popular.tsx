import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { toast } from "sonner";
import { usePopularTv } from "@/hooks/useTv";
import { localeAtom } from "@/lib/atoms/locale";
import { m } from "@/paraglide/messages";
import { LoadingSection } from "../loading/loading-section";
import { TvCarousel } from "./tv-carousel";

interface PopularTvProps {
	title: string;
}

export const PopularTv = ({ title }: PopularTvProps) => {
	const localeWithRegion = useAtomValue(localeAtom);
	const { data, isLoading, error } = usePopularTv({
		language: localeWithRegion,
		region: "US",
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
