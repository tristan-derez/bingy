import { ArrowDown, ArrowLeft } from "lucide-react";
import { useId } from "react";
import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CastSectionAggregated } from "@/components/person/aggregated/cast-section-aggregated";
import { CrewSectionAggregated } from "@/components/person/aggregated/crew-section-aggregated";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

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
				{credits.crew.length > 0 ? (
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
							{m.btn_jump_to_crew()}
							<ArrowDown className="h-4 w-4" />
						</a>
					</Button>
				) : null}
			</div>
			<div className="flex flex-col gap-8 mt-8 text-center md:text-left">
				<h2 className="text-2xl font-bold">
					{seasonNumber === 0
						? m.season_credits_special()
						: m.season_credits_title({ seasonNumber: seasonNumber })}
				</h2>
				{credits.cast.length > 0 ? (
					<CastSectionAggregated people={credits.cast} />
				) : null}
				{credits.crew.length > 0 ? (
					<div id={crewSectionId} className="scroll-mt-26 lg:scroll-mt-30">
						<CrewSectionAggregated people={credits.crew} />
					</div>
				) : null}
				{credits.cast.length === 0 && credits.crew.length === 0 ? (
					<p className="text-center">{m.season_credits_no_results()}</p>
				) : null}
			</div>
		</div>
	);
}
