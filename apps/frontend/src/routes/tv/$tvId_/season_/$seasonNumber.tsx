import { createFileRoute, useRouter } from "@tanstack/react-router";
import { TvSeasonNumberDetailsView } from "@/components/tv/seasons/tv-season-details";
import { useTvSeasonResources } from "@/hooks/useTv";

export const Route = createFileRoute("/tv/$tvId_/season_/$seasonNumber")({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	const { tvId, seasonNumber } = Route.useParams();
	const {
		data: tvSeason,
		isLoading,
		isError,
	} = useTvSeasonResources(Number(tvId), Number(seasonNumber), "");

	return (
		<TvSeasonNumberDetailsView
			tvSeason={tvSeason}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
