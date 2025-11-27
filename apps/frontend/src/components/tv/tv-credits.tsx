import { ArrowDown, ArrowLeft } from "lucide-react";
import { useId } from "react";
import type { Schemas } from "shared";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { CastSectionAggregated } from "../person/aggregated/cast-section-aggregated";
import { CrewSectionAggregated } from "../person/aggregated/crew-section-aggregated";
import { Button } from "../ui/button";

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
				<Button onClick={onBack} variant="outline">
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
				<Button asChild variant="outline">
					<a
						href={`#${crewSectionId}`}
						onClick={(e) => {
							e.preventDefault();
							document.getElementById(crewSectionId)?.scrollIntoView({
								behavior: "smooth",
								block: "start",
							});
						}}
					>
						Jump to Crew
						<ArrowDown className="h-4 w-4" />
					</a>
				</Button>
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
