import { ArrowDown, ArrowLeft } from "lucide-react";
import { useId } from "react";
import type { MovieCredits } from "@/types/movie";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { CastSection } from "../person/cast-section";
import { CrewSection } from "../person/crew-section";
import { Button } from "../ui/button";

interface MovieCreditsViewProps {
	credits: MovieCredits | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function MovieCreditsView({
	credits,
	isLoading,
	isError,
	onBack,
}: MovieCreditsViewProps) {
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
				<CastSection people={credits.cast} />
				<div id={crewSectionId} className="scroll-mt-26 lg:scroll-mt-30">
					<CrewSection people={credits.crew} />
				</div>
			</div>
		</div>
	);
}
