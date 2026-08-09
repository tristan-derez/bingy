import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { InProgressContainer } from "@/components/lists/in-progress/in-progress-container";
import { GlobalLoadingIndicator } from "@/components/loading/loading-global";
import { useInProgress } from "@/hooks/useInProgress";
import { localeRegionAtom } from "@/lib/atoms/region";
import { isOwnProfile } from "@/utils/utils";

export const Route = createFileRoute("/@{$username}/in-progress")({
	component: InProgressPage,
});

function InProgressPage() {
	const { username } = Route.useParams();
	const { authData } = useRouteContext({ from: "__root__" });
	const isOwnProfileFlag = isOwnProfile(authData?.user?.name, username);
	const localeRegion = useAtomValue(localeRegionAtom);
	const [page, setPage] = useState(1);

	const { data, isLoading, isError } = useInProgress(
		username,
		page,
		localeRegion,
	);

	if (isLoading) {
		return <GlobalLoadingIndicator />;
	}

	if (isError) {
		return <p>Failed to load in-progress shows.</p>;
	}

	return (
		<InProgressContainer
			username={username}
			isOwnProfile={isOwnProfileFlag}
			items={data?.data}
			page={page}
			totalPages={data?.total_pages ?? 1}
			onPageChange={setPage}
		/>
	);
}