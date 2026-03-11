import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { TvCreditsView } from "@/components/tv/tv-credits";
import { useTvResources } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/tv/$tvId_/credits")({
	component: TvCreditsPage,
});

function TvCreditsPage() {
	const { tvId } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const {
		data: credits,
		isLoading,
		isError,
	} = useTvResources<Schemas.TvAggregatedCredits>(
		Number(tvId),
		"aggregate_credits",
		{ language: localeRegion, region },
	);

	return (
		<TvCreditsView credits={credits} isLoading={isLoading} isError={isError} />
	);
}
