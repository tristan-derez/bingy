import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediaOverview } from "@/components/medias/media-overview";
import { MediaPosterImage } from "@/components/medias/media-poster-image";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl } from "@/utils/utils";

interface CollectionDetailsViewProps {
	collectionData: Schemas.CollectionDetails | undefined;
	moviesData: Schemas.MovieDetails[] | [];
	isLoading: boolean;
	isError: boolean;
}

// @todo: rework this page (move the background_path to the top etc etc)
// probably get rid of the budget and earning as this is not very relevant / not always accurate data
export function CollectionDetailsView({
	collectionData,
	moviesData,
	isLoading,
	isError,
}: CollectionDetailsViewProps) {
	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !collectionData) {
		return (
			<ResourceNotFound
				title={m.error_title_not_found_collection()}
				description={m.error_desc_not_found_collection()}
			/>
		);
	}

	const collectionStats = moviesData.reduce(
		(acc, movie) => {
			if (movie?.revenue) {
				acc.totalRevenue += movie.revenue;
			}

			if (movie?.genres) {
				movie.genres.forEach((genre) => {
					if (!acc.genres.some((g) => g.id === genre.id)) {
						acc.genres.push(genre);
					}
				});
			}

			return acc;
		},
		{
			totalRevenue: 0,
			genres: [] as Array<{ id: number; name: string }>,
		},
	);

	const formattedRevenue = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(collectionStats.totalRevenue);

	const totalBudget = moviesData.reduce((sum, movie) => {
		return sum + (movie?.budget ?? 0);
	}, 0);

	const formattedBudget = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(totalBudget);

	const sortedParts = [...collectionData.parts].sort((a, b) => {
		const dateA = a.release_date
			? new Date(a.release_date).getTime()
			: Infinity;
		const dateB = b.release_date
			? new Date(b.release_date).getTime()
			: Infinity;
		return dateA - dateB;
	});

	const backgroundImage = getTmdbImageUrl(
		collectionData.backdrop_path,
		"original",
	);

	return (
		<div className="container">
			<BackButton />

			<div className="flex flex-col gap-4 pt-2">
				<Card
					className="relative overflow-hidden min-h-[200px] justify-center text-dark-card-foreground"
					style={
						backgroundImage
							? {
									backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}
							: undefined
					}
				>
					<div className="flex flex-col md:flex-row gap-6 p-6 items-center md:items-start">
						<div className="flex justify-center md:justify-start">
							<MediaPosterImage
								posterPath={collectionData.poster_path}
								imageSize="w500"
								mediaName={collectionData.name}
							/>
						</div>

						<div className="flex-1">
							<CardHeader className="p-0 pb-4">
								<CardTitle className="text-2xl">
									{collectionData.name}
								</CardTitle>
								<CardDescription className="flex flex-wrap gap-2">
									{collectionStats.genres.map((genre) => (
										<Badge
											key={genre.id}
											variant="outline"
											className="text-dark-card-foreground"
										>
											{genre.name}
										</Badge>
									))}
								</CardDescription>
							</CardHeader>
							<CardContent className="p-0 flex flex-col gap-2">
								<MediaOverview overview={collectionData.overview} />

								{totalBudget > 0 ? (
									<div className="flex gap-2">
										<h3 className="text-semi-bold text-md">
											{m.collection_details_budget()}
										</h3>
										<p>{formattedBudget}</p>
									</div>
								) : null}

								{collectionStats.totalRevenue > 0 ? (
									<div className="flex gap-2">
										<h3 className="text-semi-bold text-md">
											{m.collection_details_revenue()}
										</h3>
										<p>{formattedRevenue}</p>
									</div>
								) : null}
							</CardContent>
						</div>
					</div>
				</Card>

				<MovieCarousel
					title={m.collection_carousel_title({
						number: collectionData.parts.length,
					})}
					movies={sortedParts}
				/>
			</div>
		</div>
	);
}
