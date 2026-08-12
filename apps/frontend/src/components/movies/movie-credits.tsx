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
}

export function MovieCreditsView({
	credits,
	isLoading,
	isError,
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
			/>
		);
	}
	return (
		<div className="scroll-smooth w-full">
			<div className="flex justify-between w-full">
				<BackButton />
				{credits.crew.length > 0 && credits.cast.length > 0 ? (
					<ScrollToCrewButton crewSectionId={crewSectionId} />
				) : null}
			</div>
			<div className="flex flex-col gap-2 mt-4 text-center md:text-left">
				<CastSectionMovie people={credits.cast} />
				<div id={crewSectionId} className="scroll-mt-26 lg:scroll-mt-30">
					<CrewSectionMovie people={credits.crew} />
				</div>
			</div>
		</div>
	);
}
