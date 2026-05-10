import {
	IconCalendarWeekFilled,
	IconDeviceTv,
	IconStack2,
} from "@tabler/icons-react";
import { Link, useRouteContext, useRouterState } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { MediaActionMenu } from "@/components/lists/media-actions/media-action-menu";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediaBackgroundImage } from "@/components/medias/media-background-image";
import { MediaCreators } from "@/components/medias/media-creators";
import { MediaGenresBadge } from "@/components/medias/media-genres-badge";
import { MediaLearnMoreCard } from "@/components/medias/media-learn-more";
import { MediaOverview } from "@/components/medias/media-overview";
import { MediaPortraitImage } from "@/components/medias/media-portrait-image";
import { MediaRatingDisplayCard } from "@/components/medias/media-rating-display-card";
import { CastList } from "@/components/person/cast-list";
import { TVStatusCard } from "@/components/tv/tv-details/status-card";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WatchProvidersSection } from "@/components/watch-providers/watch-providers-section";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { getTmdbImageUrl } from "@/utils/utils";

interface TvDetailViewProps {
	tv: Schemas.TvDetails | undefined;
	watchProviders: Schemas.WatchProviders | undefined;
	cast: Schemas.CastMember[];
	isLoading: boolean;
	isError: boolean;
}

export function TvDetailsView({
	tv,
	watchProviders,
	cast,
	isLoading,
	isError,
}: TvDetailViewProps) {
	const routerState = useRouterState();
	const currentUrl = routerState.location.url;
	const { authData } = useRouteContext({ from: "__root__" });
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !tv) {
		return (
			<ResourceNotFound
				title={m.tv_details_not_found_title()}
				description={m.tv_details_not_found_desc()}
			/>
		);
	}

	const hasDifferentNameInVO =
		tv.original_name.toLowerCase() !== tv.name.toLowerCase();

	const backgroundImage = getTmdbImageUrl(tv.backdrop_path);

	return (
		<>
			<MediaBackgroundImage backgroundImage={backgroundImage} />
			<div className="container pt-3 md:pt-10 lg:pt-50">
				<BackButton />

				<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
					<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
						<MediaPortraitImage
							imagePath={tv.poster_path}
							alt={tv.name}
							imageSize="w500"
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
									<div className="flex flex-col gap-4">
										<div className="flex items-start justify-between gap-4 xl:w-6/7">
											<div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
												<h1 className="text-2xl lg:text-4xl font-bold leading-tight">
													{tv.name}
													{hasDifferentNameInVO ? (
														<span className="text-foreground text-base lg:text-xl font-bold italic">
															{" "}
															— {tv.original_name}
														</span>
													) : null}
												</h1>
											</div>
										</div>

										<MediaGenresBadge genres={tv.genres} />

										<div className="flex flex-col gap-1">
											{tv.tagline ? (
												<p className="font-bold italic text-base lg:text-lg">
													{tv.tagline}
												</p>
											) : null}
											<MediaOverview overview={tv.overview} />
										</div>

										<MediaCreators
											creators={tv.created_by}
											getRoleLabel={(gender) =>
												m.tv_details_creator({ gender })
											}
										/>
									</div>

									{authData ? (
										<div className="lg:self-start mt-3 lg:pr-0.5">
											<MediaActionMenu
												username={authData.user.name}
												tvShow={{
													id: tv.id,
													name: tv.name,
													posterPath: tv.poster_path,
													releaseDate: tv.first_air_date,
													mediaType: "tv",
												}}
												posterPath={tv.poster_path}
												currentUrl={currentUrl}
											/>
										</div>
									) : (
										<div className="min-w-3xs"></div>
									)}
								</div>
							</CardContent>
						</Card>

						<div className="grid lg:grid-cols-3 gap-3 p-px">
							<MediaRatingDisplayCard mediaType="tv" tmdbId={tv.id} />

							<Card>
								<CardContent className="flex items-center gap-4">
									<IconCalendarWeekFilled />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											{tv.first_air_date
												? formatDate(tv.first_air_date, localeRegion, {
														year: "numeric",
														month: "short",
														day: "numeric",
													})
												: "N/A"}
										</p>
										<p className="text-sm text-muted-foreground">
											{m.tv_details_first_aired()}
										</p>
									</div>
								</CardContent>
							</Card>

							<TVStatusCard status={tv.status} />

							<Link to="/tv/$tvId/seasons" params={{ tvId: tv.id.toString() }}>
								<Card>
									<CardContent className="flex items-center gap-4">
										<IconDeviceTv />
										<div>
											<p className="text-xl xl:text-2xl font-bold">
												{tv.number_of_seasons}
											</p>
											<p className="text-sm text-muted-foreground">
												{m.tv_details_seasons({ count: tv.number_of_seasons })}
											</p>
										</div>
									</CardContent>
								</Card>
							</Link>

							<Card>
								<CardContent className="flex items-center gap-4">
									<IconStack2 />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											{tv.number_of_episodes}
										</p>
										<p className="text-sm text-muted-foreground">
											{m.tv_details_episodes({ count: tv.number_of_episodes })}
										</p>
									</div>
								</CardContent>
							</Card>

							{tv.id ? <MediaLearnMoreCard id={tv.id} mediaType="tv" /> : null}
						</div>

						{cast && cast.length > 0 ? (
							<div className="flex flex-col gap-2">
								<CastList people={cast} />
								<Link
									to="/tv/$tvId/credits"
									params={{ tvId: tv.id.toString() }}
									className="text-sm"
								>
									{m.link_text_full_credits()}
								</Link>
							</div>
						) : null}

						{tv.networks.length > 0 ? (
							<Card className="border ring-0">
								<CardHeader>
									<CardTitle>
										{m.tv_details_networks({
											count: tv.networks.length,
										})}
									</CardTitle>
								</CardHeader>

								<CardContent className="flex flex-wrap gap-4">
									{tv.networks.map(
										(
											network: Omit<
												Schemas.NetworkDetails,
												"homepage" | "headquarters"
											>,
										) => (
											<Badge
												key={network.id}
												className="flex items-center gap-3"
												variant="outline"
											>
												<span className="font-medium">{network.name}</span>
											</Badge>
										),
									)}
								</CardContent>
							</Card>
						) : null}

						{tv.production_companies.length > 0 ? (
							<Card className="border ring-0">
								<CardHeader>
									<CardTitle>
										{m.tv_details_companies({
											count: tv.production_companies.length,
										})}
									</CardTitle>
								</CardHeader>

								<CardContent className="flex flex-wrap gap-4">
									{tv.production_companies.map((company) => (
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
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
