import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { HistoryContainer } from "@/components/lists/history/history-container";
import { type MediaFilter } from "@/components/lists/media-toggle-group";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useRatings } from "@/hooks/useRating";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { isOwnProfile } from "@/utils/utils";

export const Route = createFileRoute("/user/$username/history")({
	component: HistoryPage,
});

function HistoryPage() {
	const { username } = Route.useParams();
	const { authData } = useRouteContext({ from: "__root__" });
	const isOwnProfileFlag = isOwnProfile(authData?.user?.name, username);
	const localeRegion = useAtomValue(localeRegionAtom);
	const [filter, setFilter] = useState<MediaFilter>("all");
	const [page, setPage] = useState(1);

	const handleFilterChange = (newFilter: MediaFilter) => {
		setFilter(newFilter);
		setPage(1);
	};

	const { data, isLoading, isError } = useRatings(
		username,
		page,
		localeRegion,
		filter === "all" ? undefined : filter,
	);

	if (isLoading) {
		return <GlobalLoadingIndicator />;
	}

	if (isError) {
		return <p>{m.history_error()}</p>;
	}

	return (
		<HistoryContainer
			title={m.history_page_title_text()}
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
