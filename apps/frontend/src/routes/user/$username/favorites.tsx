import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { FavoriteContainer } from "@/components/lists/favorites/favorites-container";
import { type MediaFilter } from "@/components/lists/media-toggle-group";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useFavorites } from "@/hooks/useFavorites";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { isOwnProfile } from "@/utils/utils";

export const Route = createFileRoute("/user/$username/favorites")({
	component: Favorites,
});

function Favorites() {
	const { username } = Route.useParams();
	const { authData } = useRouteContext({ from: "__root__" });
	const localeRegion = useAtomValue(localeRegionAtom);
	const [filter, setFilter] = useState<MediaFilter>("all");
	const [page, setPage] = useState(1);
	const isOwnProfileFlag = isOwnProfile(authData?.user?.name, username);

	const handleFilterChange = (newFilter: MediaFilter) => {
		setFilter(newFilter);
		setPage(1);
	};

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
			username={username}
			isOwnProfile={isOwnProfileFlag}
			items={data?.data}
			filter={filter}
			onFilterChange={handleFilterChange}
			page={page}
			totalPages={data?.total_pages ?? 1}
			onPageChange={setPage}
		/>
	);
}
