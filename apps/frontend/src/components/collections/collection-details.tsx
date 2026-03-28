import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediaBackgroundImage } from "@/components/medias/media-background-image";
import { MediaOverview } from "@/components/medias/media-overview";
import { MediaPortraitImage } from "@/components/medias/media-portrait-image";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { m } from "@/paraglide/messages";
import {
	getTmdbImageUrl,
	mergeCastMemberCharacters,
	mergeCrewMemberJobs,
} from "@/utils/utils";
import { CastCrewTabs } from "../person/cast-crew-tabs";

interface CollectionDetailsViewProps {
	collectionData: Schemas.CollectionDetails | undefined;
	moviesData: Schemas.MovieDetails[] | [];
	isLoading: boolean;
	isError: boolean;
}

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

	const moviesAggregate = moviesData.reduce(
		(acc, movie) => {
			if (!movie) return acc;

			if (movie.genres) {
				movie.genres.forEach((genre) => {
					const exists = acc.genres.some((g) => g.id === genre.id);
					if (!exists) {
						acc.genres.push(genre);
					}
				});
			}

			if (movie.credits?.cast) {
				const leadRoles = movie.credits.cast.slice(0, 10);
				leadRoles.forEach((castMember) =>
					mergeCastMemberCharacters(acc.cast, castMember),
				);
			}

			if (movie.credits?.crew) {
				const filteredCrew = movie.credits.crew.filter(
					(crewMember) =>
						crewMember.department === "Writing" ||
						crewMember.job === "Director",
				);
				filteredCrew.forEach((crewMember) =>
					mergeCrewMemberJobs(acc.crew, crewMember),
				);
			}

			return acc;
		},
		{
			genres: [] as Array<{ id: number; name: string }>,
			cast: [] as Array<Schemas.CastMember & { characters?: string[] }>,
			crew: [] as Array<Schemas.CrewMember & { jobs?: string[] }>,
		},
	);

	const sortedAggregate = {
		genres: moviesAggregate.genres,
		cast: moviesAggregate.cast,
		crew: moviesAggregate.crew,
	};

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
		<>
			<MediaBackgroundImage backgroundImage={backgroundImage} />
			<div className="container pt-3 md:pt-10 lg:pt-50">
				<BackButton />

				<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
					<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
						<MediaPortraitImage
							imagePath={collectionData.poster_path}
							alt={collectionData.name}
							imageSize="w500"
						/>
					</div>

					<div className="w-full flex flex-col gap-4 overflow-hidden">
						<Card className="shadow-none bg-transparent border-none ring-0 lg:p-0">
							<CardContent className="p-0">
								<div className="flex flex-col gap-2 px-0.5 py-0.5">
									<h1 className="text-2xl lg:text-4xl font-bold leading-relaxed">
										{collectionData.name}
									</h1>

									<div className="flex flex-wrap gap-2">
										{sortedAggregate.genres.map((genre) => (
											<Badge key={genre.id} variant="outline">
												{genre.name}
											</Badge>
										))}
									</div>

									<div className="flex flex-col gap-1">
										<MediaOverview overview={collectionData.overview} />
									</div>
								</div>
							</CardContent>
						</Card>

						<MovieCarousel
							title={m.collection_carousel_title({
								number: collectionData.parts.length,
							})}
							movies={sortedParts}
						/>

						<CastCrewTabs
							cast={sortedAggregate.cast}
							crew={sortedAggregate.crew}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
