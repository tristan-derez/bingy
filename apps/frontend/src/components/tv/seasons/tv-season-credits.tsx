import { ArrowDown, ArrowLeft } from "lucide-react";
import { useId } from "react";
import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CastSectionAggregated } from "@/components/person/aggregated/cast-section-aggregated";
import { CrewSectionAggregated } from "@/components/person/aggregated/crew-section-aggregated";
import { Button } from "@/components/ui/button";

interface TvSeasonCreditsViewProps {
	seasonNumber: number;
	credits: Schemas.TvAggregatedCredits | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function TvSeasonCreditsView({
	credits,
	seasonNumber,
	isLoading,
	isError,
	onBack,
}: TvSeasonCreditsViewProps) {
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
				<h2 className="text-2xl font-bold">Season {seasonNumber}</h2>
				<CastSectionAggregated people={credits.cast} />
				<div id={crewSectionId} className="scroll-mt-26 lg:scroll-mt-30">
					<CrewSectionAggregated people={credits.crew} />
				</div>
			</div>
		</div>
	);
}
