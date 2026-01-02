import { useId } from "react";
import type { Schemas } from "shared";
import { ScrollToCrewButton } from "@/components/credits/scroll-to-crew-button";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CastSectionMovie } from "@/components/person/movie/cast-section-movie";
import { CrewSectionMovie } from "@/components/person/movie/crew-section-movie";
import { BackButton } from "@/components/ui/back-button";
import { m } from "@/paraglide/messages";

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
				title={m.movie_credits_not_found_title()}
				description={m.movie_credits_not_found_desc()}
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
				<CastSectionMovie people={credits.cast} />
				<div id={crewSectionId} className="scroll-mt-26 lg:scroll-mt-30">
					<CrewSectionMovie people={credits.crew} />
				</div>
			</div>
		</div>
	);
}
