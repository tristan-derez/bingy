import { createFileRoute, useRouter } from "@tanstack/react-router";
import { TvSeasonCreditsView } from "@/components/tv/seasons/tv-season-credits";
import { useTvSeasonResources } from "@/hooks/useTv";
import type { TvAggregatedCredits } from "@/types/tv";

export const Route = createFileRoute(
	"/tv/$tvId_/season_/$seasonNumber_/credits",
)({
	component: TvSeasonCreditsContainer,
});

function TvSeasonCreditsContainer() {
	const { tvId, seasonNumber } = Route.useParams();
	const router = useRouter();

	const {
		data: credits,
		isLoading,
		isError,
	} = useTvSeasonResources<TvAggregatedCredits>(
		Number(tvId),
		Number(seasonNumber),
		"aggregate_credits",
	);

	return (
		<TvSeasonCreditsView
			credits={credits}
			seasonNumber={Number(seasonNumber)}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
