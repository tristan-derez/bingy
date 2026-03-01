import {
	IconCalendarWeekFilled,
	IconExternalLink,
	IconMoneybag,
	IconReceiptDollar,
	IconStarFilled,
	IconStopwatch,
} from "@tabler/icons-react";
import { Link, useRouteContext, useRouterState } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { CollectionCard } from "@/components/collections/collection-card";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { MediaActionMenu } from "@/components/lists/media-actions/media-action-menu";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediaBackgroundImage } from "@/components/medias/media-background-image";
import { MediaOverview } from "@/components/medias/media-overview";
import { CastCarousel } from "@/components/person/cast-carousel";
import { SocialLinks } from "@/components/social-links";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WatchProvidersSection } from "@/components/watch-providers/watch-providers-section";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { formatRuntime } from "@/utils/format-runtime";

interface MovieDetailViewProps {
	movie: Schemas.MovieDetails | undefined;
	crew: Array<{ id: number; name: string; roles: Set<string> }>;
	cast: Schemas.CastMember[];
	socials: Partial<Record<"instagram" | "twitter", string>>;
	watchProviders: Schemas.WatchProviders | undefined;
	collection: Schemas.MovieDetails["belongs_to_collection"] | undefined;
	releaseDate: string | undefined;
	releaseRegion: string | undefined;
	isLoading: boolean;
	isError: boolean;
}

export function MovieDetailView({
	movie,
	cast,
	crew,
	socials,
	watchProviders,
	collection,
	releaseDate,
	releaseRegion,
	isLoading,
	isError,
}: MovieDetailViewProps) {
	const routerState = useRouterState();
	const currentUrl = routerState.location.url;
	const { session } = useRouteContext({ from: "__root__" });
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
			/>
		);
	}

	const hasDifferentTitle =
		movie.original_title.toLowerCase() !== movie.title.toLowerCase();

	const imageUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: fallbackPoster;

	const backgroundImage = movie.backdrop_path
		? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
		: null;

	return (
		<>
			<MediaBackgroundImage backgroundImage={backgroundImage} />
			<div className="container pt-10 lg:pt-30">
				<BackButton />

				<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
					<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
						<div className="relative w-full">
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
								className="absolute bottom-0 bg-linear-to-t from-black via-black/60 to-transparent rounded-b-lg p-4 pt-50 w-full justify-center items-center bg-transparent border-none py-0"
							/>
						</div>

						{Object.keys(socials).length > 0 ? (
							<div className="flex flex-row items-center mx-auto">
								<SocialLinks socials={socials} />
							</div>
						) : null}
					</div>

					<div className="w-full flex flex-col gap-4 overflow-hidden">
						<Card className="shadow-none bg-transparent border-none ring-0 lg:p-0">
							<CardContent className="p-0">
								<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 px-0.5 py-0.5">
									<div className="flex flex-col gap-2">
										<div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
											<h1 className="text-4xl font-bold leading-relaxed">
												{movie.title}
											</h1>
											{hasDifferentTitle ? (
												<p className="text-foreground text-lg font-bold italic">
													— {movie.original_title}
												</p>
											) : null}
										</div>

										<div className="flex flex-wrap gap-2">
											{movie.genres.map((genre: Schemas.Genre) => (
												<Badge key={genre.id} variant="secondary">
													{genre.name}
												</Badge>
											))}
										</div>

										<div className="flex flex-col gap-1">
											{movie.tagline ? (
												<p className="font-bold italic text-lg">
													{movie.tagline}
												</p>
											) : null}
											<MediaOverview overview={movie.overview} />
										</div>

										{crew.length > 0 && (
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												{crew.slice(0, 3).map((person) => (
													<div className="flex flex-col" key={person.id}>
														<Link
															to="/person/$personId"
															params={{ personId: person.id.toString() }}
														>
															<h3 className="font-semibold text-lg whitespace-nowrap">
																{person.name}
															</h3>
														</Link>
														<p className="text-muted-foreground text-sm">
															{Array.from(person.roles).join(", ")}
														</p>
													</div>
												))}
											</div>
										)}
									</div>
									{session ? (
										<div className="lg:self-start mt-3">
											<MediaActionMenu
												username={session.user.name}
												movie={{
													id: movie.id,
													title: movie.title,
													posterPath: movie.poster_path,
													releaseDate: movie.release_date,
													mediaType: "movie",
												}}
												imageUrl={imageUrl}
												currentUrl={currentUrl}
											/>
										</div>
									) : (
										<div className="min-w-3xs"></div>
									)}
								</div>
							</CardContent>
						</Card>

						<div className="grid lg:grid-cols-3 gap-2 p-px">
							{movie.vote_count ? (
								<Card>
									<CardContent className="flex items-center gap-4">
										<IconStarFilled className="h-5 w-5 text-yellow-500" />
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
									<IconCalendarWeekFilled />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											{releaseDate
												? formatDate(releaseDate, localeRegion, {
														day: "numeric",
														month: "short",
														year: "numeric",
													})
												: "N/A"}
										</p>
										<p className="text-sm text-muted-foreground flex items-center gap-2">
											{releaseRegion ? (
												<span
													className={`fi fi-${releaseRegion.toLowerCase()}`}
													style={{ width: 18, height: 14 }}
												/>
											) : null}
											{m.movie_details_release_date()}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="flex items-center gap-4">
									<IconStopwatch />
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
										<IconReceiptDollar />
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
										<IconMoneybag />
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
										<IconExternalLink />
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
								<Card className="border ring-0">
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
		</>
	);
}
