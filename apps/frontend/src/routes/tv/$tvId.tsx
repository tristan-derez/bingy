import { createFileRoute, useRouter } from "@tanstack/react-router";
import { TvDetailsView } from "@/components/tv/tv-details";
import { useTv, useTvResources } from "@/hooks/useTv";
import type { TvAggregatedCredits, TvExternalIds } from "@/types/tv";
import type { WatchProviders } from "@/types/watch-providers";
import { getSocialUrls } from "@/utils/social-urls";

export const Route = createFileRoute("/tv/$tvId")({
	component: TvDetailsContainer,
});

function TvDetailsContainer() {
	const router = useRouter();
	const { tvId } = Route.useParams();

	const { data: tv, isLoading, isError } = useTv(Number(tvId));
	const { data: credits } = useTvResources<TvAggregatedCredits>(
		Number(tvId),
		"aggregate_credits",
	);

	const cast =
		credits?.cast.slice(0, 20).map((person) => ({
			id: person.id,
			name: person.name,
			character: person.roles[0]?.character ?? "Unknown",
			profile_path: person.profile_path,
		})) ?? [];

	const { data: socials } = useTvResources<TvExternalIds>(
		Number(tvId),
		"external_ids",
	);

	const { data: watchProviders } = useTvResources<WatchProviders>(
		Number(tvId),
		"watch/providers",
	);

	const socialUrls = socials ? getSocialUrls(socials) : {};

	return (
		<TvDetailsView
			tv={tv}
			watchProviders={watchProviders}
			socials={socialUrls}
			cast={cast}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
