import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { FavoriteContainer } from "@/components/lists/favorites/favorites-container";
import { type MediaFilter } from "@/components/lists/history/history-container";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useFavorites } from "@/hooks/useFavorites";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/user/$username/favorites")({
	component: Favorites,
});

function Favorites() {
	const { username } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const [filter, setFilter] = useState<MediaFilter>("all");
	const [page, setPage] = useState(1);

	const { data, isLoading, isError } = useFavorites(
		username,
		page,
		localeRegion,
		filter === "all" ? undefined : filter,
	);

	if (isLoading) {
		return <GlobalLoadingIndicator />;
	}

	if (isError) {
		return <p>{m.favorites_error()}</p>;
	}

	return (
		<FavoriteContainer
			items={data?.data}
			filter={filter}
			onFilterChange={setFilter}
			page={page}
			totalPages={data?.total_pages ?? 1}
			onPageChange={setPage}
		/>
	);
}
