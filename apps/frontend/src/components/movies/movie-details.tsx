import { Link, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Calendar, Clock, ExternalLink, Star } from "lucide-react";
import { useId } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { TbMoneybag } from "react-icons/tb";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { formatRuntime } from "@/utils/format-runtime";
import { shortenCountryName } from "@/utils/shorten-country-name";
import { CollectionCard } from "../collections/collection-card";
import { ResourceNotFound } from "../errors/resource-not-found";
import { ToggleWatchlistButton } from "../lists/media/toggle-watchlist-button";
import { LoadingCentered } from "../loading/loading-centered";
import { MediaOverview } from "../medias/overview";
import { CastCarousel } from "../person/cast-carousel";
import { SocialLinks } from "../social-links";
import { BackButton } from "../ui/back-button";
import { Separator } from "../ui/separator";
import { WatchProvidersSection } from "../watch-providers/watch-providers-section";

interface MovieDetailViewProps {
	movie: Schemas.MovieDetails | undefined;
	crew: Array<{ name: string; roles: Set<string> }>;
	cast: Schemas.CastMember[];
	socials: Partial<Record<"facebook" | "instagram" | "twitter", string>>;
	watchProviders: Schemas.WatchProviders | undefined;
	collection: Schemas.MovieDetails["belongs_to_collection"] | undefined;
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
	const { session } = useRouteContext({ from: "__root__" });
	const id = useId();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !movie) {
		return (
			<ResourceNotFound
				title={m.error_title_not_found_movie()}
				description={m.error_desc_not_found_movie()}
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
			<BackButton onBack={onBack} />

			<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
				<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
					<img
						src={imageUrl}
						alt={movie.title}
						className="rounded-lg shadow-lg w-full aspect-2/3 max-h-90 xl:max-h-[600px]"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
					<WatchProvidersSection
						watchProviders={watchProviders}
						region={region}
						className="w-full justify-center items-center bg-transparent border-none py-0"
					/>
				</div>

				<div className="w-full flex flex-col gap-4 overflow-hidden">
					<Card className="shadow-none bg-transparent py-2 lg:p-0 border-none">
						<CardContent className="lg:p-0">
							<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-4xl font-bold leading-relaxed">
										{movie.title}
									</h1>
									{movie.tagline && (
										<p className="text-muted-foreground italic">
											{movie.tagline}
										</p>
									)}

									<div className="flex flex-wrap gap-2 mt-2">
										{movie.genres.map((genre: Schemas.Genre) => (
											<Badge key={genre.id} variant="secondary">
												{genre.name}
											</Badge>
										))}
									</div>
								</div>
								{session ? (
									<div className="lg:self-start mt-3 lg:pr-2">
										<ToggleWatchlistButton movie={movie} />
									</div>
								) : null}
							</div>
						</CardContent>
					</Card>

					<Card
						className={`relative overflow-hidden min-h-[200px] justify-center ${
							backgroundImage
								? "text-dark-card-foreground border-none"
								: "text-foreground border"
						}`}
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
						<CardHeader className="flex flex-row items-center justify-between w-full">
							<CardTitle>{m.movie_details_title()}</CardTitle>
							{Object.keys(socials).length > 0 ? (
								<div className="ml-auto">
									<SocialLinks socials={socials} />
								</div>
							) : null}
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<MediaOverview overview={movie.overview} bg={backgroundImage} />
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
								{movie.production_countries.map(
									(country: Schemas.ProductionCountry) => (
										<Badge
											key={country.iso_3166_1}
											variant="secondary"
											className="flex items-center gap-2"
										>
											<span
												className={`fi fi-${country.iso_3166_1.toLowerCase()}`}
												style={{ width: 18, height: 14 }}
											></span>
											<span className="font-medium">
												{shortenCountryName(country.name)}
											</span>
										</Badge>
									),
								)}
							</div>
						</CardFooter>
					</Card>

					<div className="grid lg:grid-cols-3 gap-2">
						{movie.vote_count ? (
							<Card>
								<CardContent className="flex items-center gap-4">
									<Star className="h-5 w-5 text-yellow-500" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											{movie.vote_average.toFixed(1)}
										</p>
										<p className="text-sm text-muted-foreground">
											{movie.vote_count} votes
										</p>
									</div>
								</CardContent>
							</Card>
						) : null}

						<Card>
							<CardContent className="flex items-center gap-4">
								<Calendar className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{movie.release_date
											? formatDate(movie.release_date, localeRegion, {
													day: "numeric",
													month: "short",
													year: "numeric",
												})
											: "N/A"}
									</p>
									<p className="text-sm text-muted-foreground">
										{m.movie_details_release_date()}
									</p>
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
									<p className="text-sm text-muted-foreground">
										{m.movie_details_runtime()}
									</p>
								</div>
							</CardContent>
						</Card>

						{movie.budget > 0 ? (
							<Card>
								<CardContent className="flex items-center gap-4">
									<TbMoneybag className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											${movie.budget.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">
											{m.movie_details_budget()}
										</p>
									</div>
								</CardContent>
							</Card>
						) : null}

						{movie.revenue > 0 ? (
							<Card>
								<CardContent className="flex items-center gap-4">
									<FaMoneyBillTrendUp className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											${movie.revenue.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">
											{m.movie_details_revenue()}
										</p>
									</div>
								</CardContent>
							</Card>
						) : null}

						{movie.homepage ? (
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
												{m.btn_visit_movie_details_homepage()}
											</a>
										</p>
										<p className="text-sm text-muted-foreground">
											{m.movie_details_homepage()}
										</p>
									</div>
								</CardContent>
							</Card>
						) : null}
					</div>

					{cast && cast.length > 0 && (
						<div className="flex flex-col gap-2">
							<CastCarousel people={cast} />
							<Link
								to="/movies/$movieId/credits"
								params={{ movieId: movie.id.toString() }}
							>
								{m.link_text_full_credits()}
							</Link>
						</div>
					)}

					{collection ? <CollectionCard collection={collection} /> : null}

					{movie.production_companies &&
						movie.production_companies.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>
										{m.movie_details_production_companies({
											count: movie.production_companies.length,
										})}
									</CardTitle>
								</CardHeader>

								<CardContent className="flex flex-wrap gap-4">
									{movie.production_companies.map(
										(company: Schemas.ProductionCompany) => (
											<Badge
												key={company.id}
												className="flex items-center gap-2"
												variant="outline"
											>
												{company.origin_country ? (
													<span
														className={`fi fi-${company.origin_country.toLocaleLowerCase()}`}
														style={{ width: 18, height: 14 }}
													/>
												) : null}
												<span className="font-medium">{company.name}</span>
											</Badge>
										),
									)}
								</CardContent>
							</Card>
						)}
				</div>
			</div>
		</div>
	);
}
