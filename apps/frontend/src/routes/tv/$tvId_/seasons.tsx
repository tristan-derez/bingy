import { createFileRoute, useRouter } from "@tanstack/react-router";
import { TvSeasonsDetailsView } from "@/components/tv/seasons/tv-seasons-details";
import { useTv } from "@/hooks/useTv";

export const Route = createFileRoute("/tv/$tvId_/seasons")({
	component: SeasonsContainer,
});

function SeasonsContainer() {
	const router = useRouter();
	const { tvId } = Route.useParams();

	const { data: tv, isLoading, isError } = useTv(Number(tvId));

	return (
		<TvSeasonsDetailsView
			tv={tv}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
