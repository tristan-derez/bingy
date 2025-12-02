import { ArrowLeft } from "lucide-react";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { MediaOverview } from "../medias/overview";
import { MovieCarousel } from "../movies/movie-carousel";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface CollectionDetailsViewProps {
	collectionData: Schemas.CollectionDetails | undefined;
	moviesData: Schemas.MovieDetails[] | [];
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function CollectionDetailsView({
	collectionData,
	moviesData,
	isLoading,
	isError,
	onBack,
}: CollectionDetailsViewProps) {
	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !collectionData) {
		return (
			<ResourceNotFound
				title="Collection Not Found"
				description="The collection you're looking for could not be found."
				onBack={onBack}
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

	const backgroundImage = collectionData.backdrop_path
		? `https://image.tmdb.org/t/p/original${collectionData.backdrop_path}`
		: undefined;

	const posterImage = collectionData.poster_path
		? `https://image.tmdb.org/t/p/w500${collectionData.poster_path}`
		: fallbackPoster;

	return (
		<div className="container">
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="flex flex-col gap-4">
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
					<div className="flex flex-col md:flex-row gap-6 p-6 items-start">
						<div className="flex justify-center xl:justify-start">
							<img
								src={posterImage}
								alt={`${collectionData.name} poster`}
								className="rounded-lg shadow-lg xl:w-auto xl:max-h-[600px]"
								onError={(e) => {
									const target = e.currentTarget;
									if (target.src !== fallbackPoster) {
										target.src = fallbackPoster;
									}
								}}
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
							<CardContent className="p-0 flex flex-col gap-4">
								<h2 className="text-semi-bold text-md">Overview:</h2>
								<MediaOverview overview={collectionData.overview} />
								{collectionStats.totalRevenue > 0 && (
									<div className="flex gap-2">
										<h3 className="text-semi-bold text-md">Revenue:</h3>
										<p>{formattedRevenue}</p>
									</div>
								)}
							</CardContent>
						</div>
					</div>
				</Card>

				<MovieCarousel
					title={`Movies in Collection (${collectionData.parts.length})`}
					movies={collectionData.parts}
				/>
			</div>
		</div>
	);
}
