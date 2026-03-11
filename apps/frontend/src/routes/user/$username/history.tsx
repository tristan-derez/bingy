import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import {
	HistoryContainer,
	type MediaFilter,
} from "@/components/lists/history/history-container";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useRatings } from "@/hooks/useRating";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/user/$username/history")({
	component: HistoryPage,
});

function HistoryPage() {
	const { username } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const [filter, setFilter] = useState<MediaFilter>("all");
	const [page, setPage] = useState(1);

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
			items={data?.data}
			filter={filter}
			onFilterChange={setFilter}
			page={page}
			totalPages={data?.total_pages ?? 1}
			onPageChange={setPage}
		/>
	);
}
