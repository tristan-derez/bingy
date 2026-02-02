import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import {
	type MediaFilter,
	WatchlistContainer,
} from "@/components/lists/watchlist/watchlist-container";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useWatchlist } from "@/hooks/useLists";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/user/$username/watchlist")({
	component: WatchlistPage,
});

function WatchlistPage() {
	const { username } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const [filter, setFilter] = useState<MediaFilter>("all");
	const [page, setPage] = useState(1);

	const { data, isLoading, isError } = useWatchlist(
		username,
		page,
		localeRegion,
		filter === "all" ? undefined : filter,
	);

	if (isLoading) {
		return <GlobalLoadingIndicator />;
	}

	if (isError) {
		return <p>{m.watchlist_error()}</p>;
	}

	return (
		<WatchlistContainer
			title={m.watchlist_page_title_text()}
			items={data?.data}
			filter={filter}
			onFilterChange={setFilter}
			page={page}
			totalPages={data?.total_pages ?? 1}
			onPageChange={setPage}
		/>
	);
}
