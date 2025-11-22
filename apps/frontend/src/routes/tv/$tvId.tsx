import { createFileRoute, useRouter } from "@tanstack/react-router";
import { TvDetailsView } from "@/components/tv/tv-details";
import { useTv, useTvResources } from "@/hooks/useTv";
import type { TvCredits, TvExternalIds } from "@/types/tv";
import { getSocialUrls } from "@/utils/social-urls";

export const Route = createFileRoute("/tv/$tvId")({
	component: TvDetailsContainer,
});

function TvDetailsContainer() {
	const router = useRouter();
	const { tvId } = Route.useParams();

	const { data: tv, isLoading, isError } = useTv(Number(tvId));
	const { data: credits } = useTvResources<TvCredits>(Number(tvId), "credits");

	const { data: socials } = useTvResources<TvExternalIds>(
		Number(tvId),
		"external_ids",
	);

	const cast =
		credits?.cast?.slice(0, 10).map((person) => ({
			id: person.id,
			name: person.name,
			character: person.character,
			profile_path: person.profile_path,
		})) || [];

	const socialUrls = socials ? getSocialUrls(socials) : {};

	return (
		<TvDetailsView
			tv={tv}
			socials={socialUrls}
			cast={cast}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
