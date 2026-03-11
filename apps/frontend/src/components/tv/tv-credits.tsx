import { useId } from "react";
import type { Schemas } from "shared";
import { ScrollToCrewButton } from "@/components/credits/scroll-to-crew-button";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CastSectionAggregated } from "@/components/person/aggregated/cast-section-aggregated";
import { CrewSectionAggregated } from "@/components/person/aggregated/crew-section-aggregated";
import { BackButton } from "@/components/ui/back-button";
import { m } from "@/paraglide/messages";

interface TvCreditsViewProps {
	credits: Schemas.TvAggregatedCredits | undefined;
	isLoading: boolean;
	isError: boolean;
}

export function TvCreditsView({
	credits,
	isLoading,
	isError,
}: TvCreditsViewProps) {
	const crewSectionId = useId();

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !credits) {
		return (
			<ResourceNotFound
				title={m.tv_credits_not_found_title()}
				description={m.tv_credits_not_found_desc()}
			/>
		);
	}

	return (
		<div className="container scroll-smooth">
			<div className="mb-4 flex justify-between">
				<BackButton />

				{credits.crew.length > 0 && credits.cast.length > 0 ? (
					<ScrollToCrewButton crewSectionId={crewSectionId} />
				) : null}
			</div>
			<div className="flex flex-col gap-8 mt-8 text-center md:text-left">
				<CastSectionAggregated people={credits.cast} />
				<div id={crewSectionId} className="scroll-mt-26 lg:scroll-mt-30">
					<CrewSectionAggregated people={credits.crew} />
				</div>
			</div>
		</div>
	);
}
