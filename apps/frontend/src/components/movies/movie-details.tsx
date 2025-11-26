import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, ExternalLink, Star } from "lucide-react";
import { useId } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { TbMoneybag } from "react-icons/tb";
import Flag from "react-world-flags";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Collection } from "@/types/collection";
import type { Company, Country, Genre, MovieDetails } from "@/types/movie";
import type { WatchProviders } from "@/types/watch-providers";
import { formatDate } from "@/utils/format-date";
import { formatRuntime } from "@/utils/format-runtime";
import { shortenCountryName } from "@/utils/shorten-country-name";
import { CollectionCard } from "../collections/collection-card";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { CastCarousel } from "../person/cast-carousel";
import { SocialLinks } from "../social-links";
import { Separator } from "../ui/separator";
import { WatchProvidersSection } from "../watch-providers/watch-providers-section";

interface CrewMemberInMovieDetails {
	name: string;
	roles: Set<string>;
}

interface CastMemberInMovieDetails {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}

interface MovieDetailViewProps {
	movie: MovieDetails | undefined;
	crew: CrewMemberInMovieDetails[];
	cast: CastMemberInMovieDetails[];
	socials: Partial<Record<"facebook" | "instagram" | "twitter", string>>;
	watchProviders: WatchProviders | undefined;
	collection: Collection | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function MovieDetailView({
	movie,
	cast,
	crew,
	socials,
	watchProviders,
	collection,
	isLoading,
	isError,
	onBack,
}: MovieDetailViewProps) {
	const id = useId();

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !movie) {
		return (
			<ResourceNotFound
				title="Movie Not Found"
				description="The movie you're looking for could not be found."
				onBack={onBack}
			/>
		);
	}

	const imageUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: fallbackPoster;

	const backgroundImage = movie.backdrop_path
		? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
		: undefined;

	return (
		<div className="container">
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="grid xl:grid-cols-[auto_1fr] gap-4 justify-items-center">
				<div className="flex flex-col gap-2 items-center xl:items-start max-w-[600px]">
					<img
						src={imageUrl}
						alt={movie.title}
						className="rounded-lg shadow-lg w-full xl:max-h-[600px]"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
					<WatchProvidersSection
						watchProviders={watchProviders}
						region="FR"
						className="w-full justify-center items-center bg-transparent border-none py-0"
					/>
				</div>

				<div className="space-y-2 overflow-hidden max-w-full">
					<Card className="shadow-none bg-transparent pt-0 xl:p-0 border-none">
						<CardContent className="xl:p-0">
							<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-4xl font-bold leading-tight">
										{movie.title}
									</h1>
									{movie.tagline && (
										<p className="text-muted-foreground italic">
											{movie.tagline}
										</p>
									)}

									<div className="flex flex-wrap gap-2 mt-2">
										{movie.genres.map((genre: Genre) => (
											<Badge key={genre.id} variant="secondary">
												{genre.name}
											</Badge>
										))}
									</div>
								</div>

								{Object.keys(socials).length > 0 && (
									<div className="lg:self-start mt-3 lg:pr-2">
										<SocialLinks socials={socials} />
									</div>
								)}
							</div>
						</CardContent>
					</Card>
					<Card
						className={`relative overflow-hidden min-h-[200px] justify-center ${
							backgroundImage ? "border-none" : ""
						}`}
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
						<CardHeader className="text-dark-card-foreground">
							<CardTitle>Overview</CardTitle>
						</CardHeader>

						<CardContent className="space-y-4 text-dark-card-foreground">
							<p>{movie.overview}</p>
							<Separator />
							{crew.length > 0 && (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{crew.slice(0, 3).map((person) => (
										<div key={`${id}-${person.name}`}>
											<h3 className="font-semibold text-lg whitespace-nowrap">
												{person.name}
											</h3>
											<p className="text-muted-foreground text-sm">
												{Array.from(person.roles).join(", ")}
											</p>
										</div>
									))}
								</div>
							)}
						</CardContent>

						<CardFooter>
							<div className="flex flex-wrap gap-2">
								{movie.production_countries.map((country: Country) => (
									<Badge
										key={country.iso_3166_1}
										variant="secondary"
										className="flex items-center gap-3"
									>
										<Flag
											code={country.iso_3166_1}
											style={{ width: 18, height: 14 }}
										/>
										<span>{shortenCountryName(country.name)}</span>
									</Badge>
								))}
							</div>
						</CardFooter>
					</Card>

					<div className="grid lg:grid-cols-3 gap-3">
						<Card>
							<CardContent className="flex items-center gap-4">
								<Star className="h-5 w-5 text-yellow-500" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{movie.vote_count > 0
											? movie.vote_average.toFixed(1)
											: "No rating"}
									</p>
									<p className="text-sm text-muted-foreground">
										{movie.vote_count} votes
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center gap-4">
								<Calendar className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{movie.release_date
											? formatDate(movie.release_date, "en-US")
											: "N/A"}
									</p>
									<p className="text-sm text-muted-foreground">Release Date</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center gap-4">
								<Clock className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{formatRuntime(movie.runtime)}
									</p>
									<p className="text-sm text-muted-foreground">Runtime</p>
								</div>
							</CardContent>
						</Card>

						{movie.budget > 0 && (
							<Card>
								<CardContent className="flex items-center gap-4">
									<TbMoneybag className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											${movie.budget.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">Budget</p>
									</div>
								</CardContent>
							</Card>
						)}

						{movie.revenue > 0 && (
							<Card>
								<CardContent className="flex items-center gap-4">
									<FaMoneyBillTrendUp className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											${movie.revenue.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">Revenue</p>
									</div>
								</CardContent>
							</Card>
						)}

						{movie.homepage && (
							<Card>
								<CardContent className=" flex items-center gap-4">
									<ExternalLink className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											<a
												href={movie.homepage}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline"
											>
												Visit
											</a>
										</p>
										<p className="text-sm text-muted-foreground">Homepage</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{cast.length > 0 && (
						<div className="flex flex-col gap-2">
							<CastCarousel people={cast} />
							<Link
								to="/movies/$movieId/credits"
								params={{ movieId: movie.id.toString() }}
							>
								See full cast and crew
							</Link>
						</div>
					)}

					{collection && <CollectionCard collection={collection} />}

					{movie.production_companies.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Production Companies</CardTitle>
							</CardHeader>

							<CardContent className="flex flex-wrap gap-4">
								{movie.production_companies.map((company: Company) => (
									<Badge
										key={company.id}
										className="flex items-center gap-3"
										variant="outline"
									>
										<span className="font-medium">{company.name}</span>
									</Badge>
								))}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
