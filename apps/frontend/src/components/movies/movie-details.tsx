import {
	IconCalendarWeekFilled,
	IconMovie,
	IconStopwatch,
} from "@tabler/icons-react";
import { Link, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { CollectionCard } from "@/components/collections/collection-card";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { MediaActionMenu } from "@/components/lists/media-actions/media-action-menu";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediaBackgroundImage } from "@/components/medias/media-background-image";
import { MediaCreators } from "@/components/medias/media-creators";
import { MediaGenresBadge } from "@/components/medias/media-genres-badge";
import { MediaLearnMoreCard } from "@/components/medias/media-learn-more";
import { MediaOverview } from "@/components/medias/media-overview";
import { MediaRatingDisplayCard } from "@/components/medias/media-rating-display-card";
import { MediaTitle } from "@/components/medias/media-title";
import { CastCrewTabs } from "@/components/person/cast-crew-tabs";
import { PortraitImage } from "@/components/portrait-image";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { WatchProvidersSection } from "@/components/watch-providers/watch-providers-section";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { formatRuntime } from "@/utils/format-runtime";
import { getTmdbImageUrl, normalizeTitle } from "@/utils/utils";

interface MovieDetailViewProps {
	movie: Schemas.MovieDetails | undefined;
	directors: Array<{ id: number; name: string; gender: number | null }>;
	cast: Schemas.CastMember[];
	crew: Schemas.CrewMember[];
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
	directors,
	watchProviders,
	collection,
	releaseDate,
	releaseRegion,
	isLoading,
	isError,
}: MovieDetailViewProps) {
	const { authData } = useRouteContext({ from: "__root__" });
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

	const hasDifferentTitleInVO =
		normalizeTitle(movie.original_title) !== normalizeTitle(movie.title);

	const backgroundImage = getTmdbImageUrl(movie.backdrop_path, "original");

	return (
		<>
			<MediaBackgroundImage backgroundImage={backgroundImage} />
			<div className="container pt-3 md:pt-10 lg:pt-50">
				<BackButton />

				<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
					<div className="flex flex-col gap-2 items-center lg:items-start max-w-62.5 md:max-w-75 lg:max-w-100">
						<PortraitImage
							imagePath={movie.poster_path}
							alt={movie.title}
							imageSize="w500"
							fallback={
								<IconMovie className="w-1/3 h-1/3 text-muted-foreground" />
							}
						/>

						{watchProviders ? (
							<WatchProvidersSection
								watchProviders={watchProviders}
								region={region}
								className="w-full"
							/>
						) : null}
					</div>

					<div className="w-full flex flex-col gap-4 overflow-hidden">
						<Card className="shadow-none bg-transparent border-none ring-0 lg:p-0">
							<CardContent className="p-0">
								<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 px-0.5 py-0.5">
									<div className="flex flex-col gap-2">
										<MediaTitle
											title={movie.title}
											releaseDate={movie.release_date}
											originalTitle={movie.original_title}
											hasDifferentTitle={hasDifferentTitleInVO}
										/>

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

										<MediaCreators
											creators={directors}
											getRoleLabel={(gender) =>
												m.movie_details_director({ gender })
											}
										/>
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
											/>
										</div>
									) : null}
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
								<CastCrewTabs cast={cast} crew={crew} />
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
					</div>
				</div>
			</div>
		</>
	);
}
