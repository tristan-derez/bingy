import { useId } from "react";
import type { Schemas } from "shared";
import { ScrollToCrewButton } from "../credits/scroll-to-crew-button";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { CastSectionAggregated } from "../person/aggregated/cast-section-aggregated";
import { CrewSectionAggregated } from "../person/aggregated/crew-section-aggregated";
import { BackButton } from "../ui/back-button";

interface TvCreditsViewProps {
	credits: Schemas.TvAggregatedCredits | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function TvCreditsView({
	credits,
	isLoading,
	isError,
	onBack,
}: TvCreditsViewProps) {
	const crewSectionId = useId();
	if (isLoading) {
		return <LoadingCentered />;
	}
	if (isError || !credits) {
		return (
			<ResourceNotFound
				title="Oops!"
				description="Credits are not available at the moment"
				onBack={onBack}
			/>
		);
	}
	return (
		<div className="container scroll-smooth">
			<div className="mb-4 flex justify-between">
				<BackButton onBack={onBack} />

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
