import { IconCalendarWeekFilled, IconStopwatch } from "@tabler/icons-react";
import { Link, useRouteContext, useRouterState } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { CollectionCard } from "@/components/collections/collection-card";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { MediaActionMenu } from "@/components/lists/media-actions/media-action-menu";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediaBackgroundImage } from "@/components/medias/media-background-image";
import { MediaGenresBadge } from "@/components/medias/media-genres-badge";
import { MediaLearnMoreCard } from "@/components/medias/media-learn-more";
import { MediaOverview } from "@/components/medias/media-overview";
import { MediaPortraitImage } from "@/components/medias/media-portrait-image";
import { MediaRatingDisplayCard } from "@/components/medias/media-rating-display-card";
import { CastList } from "@/components/person/cast-list";
import { SocialLinks } from "@/components/social-links";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { formatRuntime } from "@/utils/format-runtime";
import { getTmdbImageUrl } from "@/utils/utils";

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
	const { authData } = useRouteContext({ from: "__root__" });
	const localeRegion = useAtomValue(localeRegionAtom);

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

	const backgroundImage = getTmdbImageUrl(movie.backdrop_path, "original");

	return (
		<>
			<MediaBackgroundImage backgroundImage={backgroundImage} />
			<div className="container pt-3 md:pt-10 lg:pt-50">
				<BackButton />

				<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
					<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
						<MediaPortraitImage
							imagePath={movie.poster_path}
							alt={movie.title}
							imageSize="w500"
							watchProviders={watchProviders}
						/>

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
											<h1 className="text-2xl lg:text-4xl font-bold leading-relaxed">
												{movie.title}
											</h1>
											{hasDifferentTitle ? (
												<p className="text-foreground text-base lg:text-xl font-bold italic">
													— {movie.original_title}
												</p>
											) : null}
										</div>

										<div className="flex flex-wrap gap-2">
											<div className="flex gap-0.5 items-center font-bold">
												<IconStopwatch width={16} height={16} />
												<p className="text-sm">
													{formatRuntime(movie.runtime)}
												</p>
											</div>

											<MediaGenresBadge genres={movie.genres} />
										</div>

										<div className="flex flex-col gap-1">
											{movie.tagline ? (
												<p className="font-bold italic text-base lg:text-lg">
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
															<h3 className="font-semibold text-base lg:text-lg whitespace-nowrap">
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
									{authData ? (
										<div className="lg:self-start mt-3">
											<MediaActionMenu
												username={authData.user.name}
												movie={{
													id: movie.id,
													title: movie.title,
													posterPath: movie.poster_path,
													releaseDate: movie.release_date,
													mediaType: "movie",
												}}
												posterPath={movie.poster_path}
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
							<MediaRatingDisplayCard mediaType="movie" tmdbId={movie.id} />

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

							{movie.id ? (
								<MediaLearnMoreCard id={movie.id} mediaType="movie" />
							) : null}
						</div>

						{cast && cast.length > 0 ? (
							<div className="flex flex-col gap-2">
								<CastList people={cast} />
								<Link
									to="/movies/$movieId/credits"
									params={{ movieId: movie.id.toString() }}
									className="text-sm"
								>
									{m.link_text_full_credits()}
								</Link>
							</div>
						) : null}

						{collection ? <CollectionCard collection={collection} /> : null}

						{movie.production_companies &&
						movie.production_companies.length > 0 ? (
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
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
