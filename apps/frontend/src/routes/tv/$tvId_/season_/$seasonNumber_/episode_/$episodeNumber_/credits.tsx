import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { TvEpisodeCreditsView } from "@/components/tv/episodes/episode-credits";
import { useTvEpisodeResources } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute(
	"/tv/$tvId_/season_/$seasonNumber_/episode_/$episodeNumber_/credits",
)({
	component: TvEpisodeCreditsPage,
});

function TvEpisodeCreditsPage() {
	const { tvId, seasonNumber, episodeNumber } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const {
		data: credits,
		isLoading,
		isError,
	} = useTvEpisodeResources<Schemas.TvEpisodeCredits>(
		Number(tvId),
		Number(seasonNumber),
		Number(episodeNumber),
		"credits",
		{ language: localeRegion, region },
	);

	return (
		<TvEpisodeCreditsView
			episodeNumber={Number(episodeNumber)}
			credits={credits}
			isLoading={isLoading}
			isError={isError}
		/>
	);
}
