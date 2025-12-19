import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { WatchlistContainer } from "@/components/lists/media/watchlist-container";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useWatchlist } from "@/hooks/useLists";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_auth/lists/watchlist")({
	component: WatchlistPage,
});

function WatchlistPage() {
	const localeRegion = useAtomValue(localeRegionAtom);
	const { data, isLoading, isError } = useWatchlist(1, localeRegion);

	if (isLoading) {
		return <GlobalLoadingIndicator />;
	}

	if (isError) {
		return <p>Error loading watchlist</p>;
	}

	return (
		<WatchlistContainer
			title={m.watchlist_page_title_text()}
			items={data?.data}
		/>
	);
}
