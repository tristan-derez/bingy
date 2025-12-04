import { ArrowDown, ArrowLeft } from "lucide-react";
import { useId } from "react";
import type { Schemas } from "shared";
import { m } from "@/paraglide/messages";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { CastSectionMovie } from "../person/movie/cast-section-movie";
import { CrewSectionMovie } from "../person/movie/crew-section-movie";
import { Button } from "../ui/button";

interface MovieCreditsViewProps {
	credits: Schemas.MovieCredits | undefined;
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
						{m.btn_jump_to_crew()}
						<ArrowDown className="h-4 w-4" />
					</a>
				</Button>
			</div>
			<div className="flex flex-col gap-8 mt-8 text-center md:text-left">
				<CastSectionMovie people={credits.cast} />
				<div id={crewSectionId} className="scroll-mt-26 lg:scroll-mt-30">
					<CrewSectionMovie people={credits.crew} />
				</div>
			</div>
		</div>
	);
}
