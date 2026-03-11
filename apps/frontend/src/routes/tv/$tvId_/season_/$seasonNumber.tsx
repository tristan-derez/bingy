import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { TvSeasonDetailsView } from "@/components/tv/seasons/tv-season-details";
import { useTvSeasonResources } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/tv/$tvId_/season_/$seasonNumber")({
	component: TvSeasonDetailsPage,
});

function TvSeasonDetailsPage() {
	const { tvId, seasonNumber } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const {
		data: tvSeason,
		isLoading,
		isError,
	} = useTvSeasonResources<Schemas.TvSeasonDetails>(
		Number(tvId),
		Number(seasonNumber),
		"",
		{ language: localeRegion, region },
	);

	const { data: credits } = useTvSeasonResources<Schemas.TvCredits>(
		Number(tvId),
		Number(seasonNumber),
		"credits",
		{ language: localeRegion, region },
	);

	const { data: watchProviders } = useTvSeasonResources<Schemas.WatchProviders>(
		Number(tvId),
		Number(seasonNumber),
		"watch/providers",
		{ language: localeRegion, region },
	);

	return (
		<TvSeasonDetailsView
			tvSeason={tvSeason}
			credits={credits}
			watchProviders={watchProviders}
			tvId={Number(tvId)}
			isLoading={isLoading}
			isError={isError}
		/>
	);
}
