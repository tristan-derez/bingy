import { createFileRoute, useRouter } from "@tanstack/react-router";
import { TvSeasonDetailsView } from "@/components/tv/seasons/tv-season-details";
import { useTvSeasonResources } from "@/hooks/useTv";
import type { TvCredits, TvSeasonDetails } from "@/types/tv";

export const Route = createFileRoute("/tv/$tvId_/season_/$seasonNumber")({
	component: TvSeasonDetailsContainer,
});

function TvSeasonDetailsContainer() {
	const router = useRouter();
	const { tvId, seasonNumber } = Route.useParams();

	const {
		data: tvSeason,
		isLoading,
		isError,
	} = useTvSeasonResources<TvSeasonDetails>(
		Number(tvId),
		Number(seasonNumber),
		"",
	);

	const { data: credits } = useTvSeasonResources<TvCredits>(
		Number(tvId),
		Number(seasonNumber),
		"credits",
	);

	return (
		<TvSeasonDetailsView
			tvSeason={tvSeason}
			credits={credits}
			tvId={Number(tvId)}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
