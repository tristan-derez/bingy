import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { TvEpisodeDetailsView } from "@/components/tv/episodes/episode-details";
import { useTvEpisodeResources } from "@/hooks/useTv";

export const Route = createFileRoute(
	"/tv/$tvId_/season_/$seasonNumber_/episode_/$episodeNumber",
)({
	component: TvEpisodeDetailsContainer,
});

function TvEpisodeDetailsContainer() {
	const { tvId, seasonNumber, episodeNumber } = Route.useParams();
	const router = useRouter();

	const { data, isLoading, isError } =
		useTvEpisodeResources<Schemas.TvEpisodeDetails>(
			Number(tvId),
			Number(seasonNumber),
			Number(episodeNumber),
			"",
		);

	const { data: credits } = useTvEpisodeResources<Schemas.TvEpisodeCredits>(
		Number(tvId),
		Number(seasonNumber),
		Number(episodeNumber),
		"credits",
	);

	return (
		<TvEpisodeDetailsView
			episode={data}
			credits={credits}
			tvId={Number(tvId)}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
