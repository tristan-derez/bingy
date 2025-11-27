import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { TvEpisodeCreditsView } from "@/components/tv/episodes/episode-credits";
import { useTvEpisodeResources } from "@/hooks/useTv";

export const Route = createFileRoute(
	"/tv/$tvId_/season_/$seasonNumber_/episode_/$episodeNumber_/credits",
)({
	component: TvEpisodeCreditsContainer,
});

function TvEpisodeCreditsContainer() {
	const { tvId, seasonNumber, episodeNumber } = Route.useParams();
	const router = useRouter();

	const {
		data: credits,
		isLoading,
		isError,
	} = useTvEpisodeResources<Schemas.TvEpisodeCredits>(
		Number(tvId),
		Number(seasonNumber),
		Number(episodeNumber),
		"credits",
	);

	return (
		<TvEpisodeCreditsView
			episodeNumber={Number(episodeNumber)}
			credits={credits}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
