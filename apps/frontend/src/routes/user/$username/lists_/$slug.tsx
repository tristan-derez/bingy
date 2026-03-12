import {
	createFileRoute,
	useNavigate,
	useRouteContext,
} from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { ListContainer } from "@/components/lists/custom-lists/list-container";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { useListBySlug } from "@/hooks/useLists";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/user/$username/lists_/$slug")({
	component: ListPage,
});

function ListPage() {
	const { username, slug } = Route.useParams();
	const navigate = useNavigate();
	const localeRegion = useAtomValue(localeRegionAtom);
	const { authData } = useRouteContext({ from: "__root__" });
	const userNameFromSession = authData?.user?.name;
	const isOwnProfile =
		userNameFromSession?.toLowerCase() === username.toLowerCase();

	const [page, setPage] = useState(1);
	const {
		data: list,
		isLoading,
		error,
	} = useListBySlug(username, slug, localeRegion, page);

	if (isLoading) return <LoadingCentered />;
	if (!list || error) {
		toast.error(m.toast_error_list_not_found());
		navigate({ to: "/user/$username/lists", params: { username } });
		return;
	}

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
