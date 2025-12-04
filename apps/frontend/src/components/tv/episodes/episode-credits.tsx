import { useId } from "react";
import type { Schemas } from "shared";
import { ScrollToCrewButton } from "@/components/credits/scroll-to-crew-button";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CastSectionTv } from "@/components/person/tv/cast-section-tv";
import { CrewSectionTv } from "@/components/person/tv/crew-section-tv";
import { BackButton } from "@/components/ui/back-button";

import { m } from "@/paraglide/messages";

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
				title={m.episode_credits_not_found_title()}
				description={m.episode_credits_not_found_desc()}
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
				<h2 className="text-2xl font-bold">
					{m.episode_credits_title({ episodeNumber: episodeNumber })}
				</h2>
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
