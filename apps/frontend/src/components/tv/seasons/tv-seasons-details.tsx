import { ArrowLeft } from "lucide-react";
import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { Button } from "@/components/ui/button";
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
				title="TV Show seasons Not Found"
				description="The TV show seasons you're looking for could not be found."
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
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="grid gris-cols-1 gap-4">
				<div>
					<h1 className="text-4xl font-bold mb-2">{tv.name}</h1>
					<p className="text-muted-foreground">Seasons</p>
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
