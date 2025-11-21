import { AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { CollectionDetails } from "@/types/collection";
import type { MovieDetails } from "@/types/movie";
import { CenteredLayout } from "../layout/centered-layout";
import { LoadingCentered } from "../loading/loading-centered";
import { MovieCarousel } from "../movies/movie-carousel";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface CollectionDetailsViewProps {
	collectionData: CollectionDetails | undefined;
	moviesData: MovieDetails[] | [];
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
			<CenteredLayout>
				<Button onClick={onBack} className="mb-4" variant="outline">
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Not Found</AlertTitle>
					<AlertDescription>Movie not found</AlertDescription>
				</Alert>
			</CenteredLayout>
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

	return (
		<div className="container">
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="flex flex-col gap-4">
				<Card
					className="relative overflow-hidden min-h-[200px] justify-center"
					style={
						backgroundImage
							? {
									backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${backgroundImage})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}
							: undefined
					}
				>
					<div className="flex flex-col md:flex-row gap-6 p-6 items-center md:items-start">
						{collectionData.poster_path && (
							<div className="flex-shrink-0 md:mx-0">
								<img
									src={`https://image.tmdb.org/t/p/w400${collectionData.poster_path}`}
									alt={`${collectionData.name} poster`}
									className="w-full h-112 md:w-75 lg:h-112.5 object-cover rounded-sm shadow-lg"
								/>
							</div>
						)}

						<div className="flex-1">
							<CardHeader className="p-0 pb-4">
								<CardTitle className="text-2xl">
									{collectionData.name}
								</CardTitle>
								<CardDescription className="flex flex-wrap gap-2">
									{collectionStats.genres.map((genre) => (
										<Badge key={genre.id} variant="outline">
											{genre.name}
										</Badge>
									))}
								</CardDescription>
							</CardHeader>
							<CardContent className="p-0 w-1/2 flex flex-col gap-4">
								<div>
									<h2 className="text-semi-bold text-md text-foreground">
										Overview:
									</h2>
									{collectionData.overview && (
										<p className="text-muted-foreground mt-2">
											{collectionData.overview}
										</p>
									)}
								</div>
								{collectionStats.totalRevenue > 0 && (
									<div className="flex gap-2">
										<h3 className="text-semi-bold text-md text-foreground">
											Revenue:
										</h3>
										<p className="text-muted-foreground">{formattedRevenue}</p>
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
