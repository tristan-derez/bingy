import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { ListContainer } from "@/components/lists/media/list-container";
import { useListBySlug } from "@/hooks/useLists";
import { localeRegionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/user/$username/lists_/$slug")({
	component: ListPage,
});

function ListPage() {
	const { username, slug } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const { session } = useRouteContext({ from: "__root__" });
	const userNameFromSession = session?.user?.name;
	const isOwnProfile =
		userNameFromSession?.toLowerCase() === username.toLowerCase();

	const [page, setPage] = useState(1);
	const {
		data: list,
		isLoading,
		error,
	} = useListBySlug(username, slug, localeRegion, page);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading list</div>;
	if (!list) return <div>List not found</div>;

	return (
		<ListContainer
			username={username}
			list={list}
			page={page}
			totalPages={list.total_pages}
			onPageChange={setPage}
			isOwnList={isOwnProfile}
		/>
	);
}
