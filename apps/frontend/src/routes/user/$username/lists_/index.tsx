import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import {
	ListsContainer,
	type VisibilityFilter,
} from "@/components/lists/media/lists-container";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useLists } from "@/hooks/useLists";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/user/$username/lists_/")({
	component: ListsPage,
});

function ListsPage() {
	const { username } = Route.useParams();
	const [filter, setFilter] = useState<VisibilityFilter>("all");
	const [page, setPage] = useState(1);
	const { session } = useRouteContext({ from: "__root__" });
	const userNameFromSession = session?.user?.name;

	const { data, isLoading, isError } = useLists(username, page, filter);

	if (isLoading) {
		return <GlobalLoadingIndicator />;
	}

	if (isError) {
		return <p>{m.lists_error()}</p>;
	}

	return (
		<ListsContainer
			items={data?.data}
			filter={filter}
			onFilterChange={setFilter}
			page={page}
			totalPages={data?.total_pages ?? 1}
			onPageChange={setPage}
			username={username}
			userNameFromSession={userNameFromSession}
		/>
	);
}
