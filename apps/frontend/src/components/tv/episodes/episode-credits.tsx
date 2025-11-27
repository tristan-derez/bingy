import { ArrowDown, ArrowLeft } from "lucide-react";
import { useId } from "react";
import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CastSectionTv } from "@/components/person/tv/cast-section-tv";
import { CrewSectionTv } from "@/components/person/tv/crew-section-tv";
import { Button } from "@/components/ui/button";

interface TvEpisodeCreditsViewProps {
	episodeNumber: number;
	credits: Schemas.TvEpisodeCredits | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function TvEpisodeCreditsView({
	credits,
	episodeNumber,
	isLoading,
	isError,
	onBack,
}: TvEpisodeCreditsViewProps) {
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
				{credits.crew.length > 0 && credits.cast.length > 0 ? (
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
				) : null}
			</div>
			<div className="flex flex-col gap-8 mt-8 text-center md:text-left">
				<h2 className="text-2xl font-bold">Episode {episodeNumber}</h2>
				{credits.cast ? (
					<CastSectionTv
						people={credits.cast}
						guestStars={credits.guest_stars}
					/>
				) : null}
				{credits.crew ? (
					<div id={crewSectionId} className="scroll-mt-26 lg:scroll-mt-30">
						<CrewSectionTv people={credits.crew} />
					</div>
				) : null}
			</div>
		</div>
	);
}
