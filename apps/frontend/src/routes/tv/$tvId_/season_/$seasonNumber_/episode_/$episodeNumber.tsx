import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { TvEpisodeDetailsView } from "@/components/tv/episodes/episode-details";
import { useTvEpisodeResources } from "@/hooks/useTv";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute(
	"/tv/$tvId_/season_/$seasonNumber_/episode_/$episodeNumber",
)({
	component: TvEpisodeDetailsPage,
});

function TvEpisodeDetailsPage() {
	const { tvId, seasonNumber, episodeNumber } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const { data, isLoading, isError } =
		useTvEpisodeResources<Schemas.TvEpisodeDetails>(
			Number(tvId),
			Number(seasonNumber),
			Number(episodeNumber),
			"",
			{ language: localeRegion, region },
		);

	const { data: credits } = useTvEpisodeResources<Schemas.TvEpisodeCredits>(
		Number(tvId),
		Number(seasonNumber),
		Number(episodeNumber),
		"credits",
		{ language: localeRegion },
	);

	return (
		<TvEpisodeDetailsView
			episode={data}
			credits={credits}
			tvId={Number(tvId)}
			isLoading={isLoading}
			isError={isError}
		/>
	);
}
