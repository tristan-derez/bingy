import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { BackButton } from "@/components/ui/back-button";
import { m } from "@/paraglide/messages";
import { SeasonCard } from "./season-card";

interface TvSeasonsDetailsViewProps {
	tv: Schemas.TvDetails | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function TvSeasonsDetailsView({
	tv,
	isLoading,
	isError,
	onBack,
}: TvSeasonsDetailsViewProps) {
	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !tv) {
		return (
			<ResourceNotFound
				title={m.seasons_details_not_found_title()}
				description={m.seasons_details_not_found_desc()}
				onBack={onBack}
			/>
		);
	}

	const regularSeasons = tv.seasons.filter(
		(season) => season.season_number > 0,
	);
	const specialSeason = tv.seasons.find((season) => season.season_number === 0);

	return (
		<div className="container">
			<BackButton onBack={onBack} />

			<div className="grid gris-cols-1 gap-4 pt-2">
				<div>
					<h1 className="text-4xl font-bold mb-2">{tv.name}</h1>
					<p className="text-muted-foreground">{m.seasons_details_seasons()}</p>
				</div>

				<div className="grid gap-4 xl:grid-cols-2">
					{regularSeasons.map((season) => (
						<SeasonCard key={season.id} season={season} tvId={tv.id} />
					))}
					{specialSeason && (
						<SeasonCard
							key={specialSeason.id}
							season={specialSeason}
							tvId={tv.id}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
