import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { TvSeasonDetailsView } from "@/components/tv/seasons/tv-season-details";
import { useTvSeasonResources } from "@/hooks/useTv";

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
	} = useTvSeasonResources<Schemas.TvSeasonDetails>(
		Number(tvId),
		Number(seasonNumber),
		"",
	);

	const { data: credits } = useTvSeasonResources<Schemas.TvCredits>(
		Number(tvId),
		Number(seasonNumber),
		"credits",
	);

	const { data: watchProviders } = useTvSeasonResources<Schemas.WatchProviders>(
		Number(tvId),
		Number(seasonNumber),
		"watch/providers",
	);

	return (
		<TvSeasonDetailsView
			tvSeason={tvSeason}
			credits={credits}
			watchProviders={watchProviders}
			tvId={Number(tvId)}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
