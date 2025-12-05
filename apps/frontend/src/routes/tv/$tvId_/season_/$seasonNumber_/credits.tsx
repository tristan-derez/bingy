import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { TvSeasonCreditsView } from "@/components/tv/seasons/tv-season-credits";
import { useTvSeasonResources } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute(
	"/tv/$tvId_/season_/$seasonNumber_/credits",
)({
	component: TvSeasonCreditsPage,
});

function TvSeasonCreditsPage() {
	const { tvId, seasonNumber } = Route.useParams();
	const router = useRouter();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const {
		data: credits,
		isLoading,
		isError,
	} = useTvSeasonResources<Schemas.TvAggregatedCredits>(
		Number(tvId),
		Number(seasonNumber),
		"aggregate_credits",
		{ language: localeRegion, region },
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
