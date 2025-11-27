import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { TvCreditsView } from "@/components/tv/tv-credits";
import { useTvResources } from "@/hooks/useTv";

export const Route = createFileRoute("/tv/$tvId_/credits")({
	component: TvCreditsContainer,
});

function TvCreditsContainer() {
	const { tvId } = Route.useParams();
	const router = useRouter();

	const {
		data: credits,
		isLoading,
		isError,
	} = useTvResources<Schemas.TvAggregatedCredits>(
		Number(tvId),
		"aggregate_credits",
	);

	return (
		<TvCreditsView
			credits={credits}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
