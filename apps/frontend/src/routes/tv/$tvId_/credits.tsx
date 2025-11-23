import { createFileRoute, useRouter } from "@tanstack/react-router";
import { TvCreditsView } from "@/components/tv/tv-credits";
import { useTvResources } from "@/hooks/useTv";
import type { TvAggregatedCredits } from "@/types/tv";

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
	} = useTvResources<TvAggregatedCredits>(Number(tvId), "aggregate_credits");

	return (
		<TvCreditsView
			credits={credits}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
