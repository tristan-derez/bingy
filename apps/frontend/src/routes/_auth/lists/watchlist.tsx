import { useQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { fetchMovie } from "@/api/movies";
import { fetchTvResources } from "@/api/tv";
import { WatchlistContainer } from "@/components/lists/media/watchlist-container";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useWatchlist } from "@/hooks/useLists";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_auth/lists/watchlist")({
	component: WatchlistPage,
});

type WatchlistItem = {
	userId: string;
	mediaTmdbId: number;
	mediaType: string;
	addedAt: string;
};

function WatchlistPage() {
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);
	const { data, isLoading, isError } = useWatchlist();

	const items = data as WatchlistItem[] | undefined;

	const mediaQueries = useQueries({
		queries:
			items?.map((item) => ({
				queryKey: [item.mediaType, item.mediaTmdbId],
				queryFn: async () => {
					if (item.mediaType === "movie") {
						return {
							...(await fetchMovie(item.mediaTmdbId, {
								language: localeRegion,
								region,
							})),
							mediaType: "movie" as const,
						};
					}
					return {
						...(await fetchTvResources(item.mediaTmdbId, {
							params: { language: localeRegion, region },
						})),
						mediaType: "tv" as const,
					};
				},
				staleTime: 1000 * 60 * 30,
			})) ?? [],
	});

	const isLoadingMedia = mediaQueries.some((q) => q.isLoading);

	if (isLoading || isLoadingMedia) {
		return <GlobalLoadingIndicator />;
	}

	if (isError) {
		return <p>Error loading watchlist</p>;
	}

	return (
		<WatchlistContainer
			title={m.watchlist_page_title_text()}
			mediaQueries={mediaQueries}
		/>
	);
}
