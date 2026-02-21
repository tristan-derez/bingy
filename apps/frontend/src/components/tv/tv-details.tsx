import {
	IconCalendarWeekFilled,
	IconDeviceTv,
	IconExternalLink,
	IconStack2,
	IconStarFilled,
} from "@tabler/icons-react";
import { Link, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { MediaActionBar } from "@/components/lists/media-actions/media-action-bar";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediaOverview } from "@/components/medias/overview";
import { CastCarousel } from "@/components/person/cast-carousel";
import { SocialLinks } from "@/components/social-links";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WatchProvidersSection } from "@/components/watch-providers/watch-providers-section";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { shortenCountryName } from "@/utils/shorten-country-name";
import { Separator } from "../ui/separator";
import { TVStatusCard } from "./tv-details/status-card";

interface TvDetailViewProps {
	tv: Schemas.TvDetails | undefined;
	watchProviders: Schemas.WatchProviders | undefined;
	socials: Partial<Record<"instagram" | "twitter", string>>;
	cast: Schemas.CastMember[];
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function TvDetailsView({
	tv,
	watchProviders,
	socials,
	cast,
	isLoading,
	isError,
	onBack,
}: TvDetailViewProps) {
	const { session } = useRouteContext({ from: "__root__" });
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
				onBack={onBack}
			/>
		);
	}

	const imageUrl = tv.poster_path
		? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
		: fallbackPoster;

	const backgroundImage = tv.backdrop_path
		? `https://image.tmdb.org/t/p/original${tv.backdrop_path}`
		: undefined;

	return (
		<div className="container">
			<BackButton onBack={onBack} />

			<div className="grid lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 pt-2 justify-items-center">
				<div className="flex flex-col gap-2 items-center lg:items-start max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
					<img
						src={imageUrl}
						alt={tv.name}
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
					<Card className="shadow-none bg-transparent py-2 ring-0">
						<CardContent className="lg:p-0">
							<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-4xl font-bold leading-relaxed line-clamp-1">
										{tv.name}
									</h1>
									<Separator />
									{tv.tagline ? (
										<p className="text-muted-foreground italic">{tv.tagline}</p>
									) : null}

									<div className="flex flex-wrap gap-2 mt-2">
										{tv.genres.map((genre) => (
											<Badge key={genre.id} variant="secondary">
												{genre.name}
											</Badge>
										))}
									</div>
								</div>

								{session ? (
									<div className="lg:self-start mt-3 lg:pr-2">
										<MediaActionBar username={session.user.name} tvShow={tv} />
									</div>
								) : null}
							</div>
						</CardContent>
					</Card>

					<Card
						className="relative overflow-hidden min-h-[200px] border-none text-dark-card-foreground"
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
							<CardTitle className="">{m.tv_details_overview()}</CardTitle>
							{Object.keys(socials).length > 0 ? (
								<div className="ml-auto">
									<SocialLinks socials={socials} />
								</div>
							) : null}
						</CardHeader>

						<CardContent className="flex flex-col gap-4">
							<MediaOverview overview={tv.overview} bg={backgroundImage} />
							<Separator />

							{tv.created_by.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{tv.created_by.slice(0, 3).map((creator) => (
										<div key={creator.id}>
											<Link
												to="/person/$personId"
												params={{ personId: creator.id.toString() }}
											>
												<h3 className="font-semibold text-lg whitespace-nowrap">
													{creator.name}
												</h3>
											</Link>

											<p className="text-muted-foreground text-sm">
												{m.tv_details_creator({
													gender: creator.gender === 1 ? "female" : "male",
												})}
											</p>
										</div>
									))}
								</div>
							) : null}

							<div className="flex flex-wrap gap-2 pt-2">
								{tv.production_countries.map((country) => (
									<Badge
										key={country.iso_3166_1}
										variant="secondary"
										className="flex items-center gap-3"
									>
										<span
											className={`fi fi-${country.iso_3166_1.toLowerCase()}`}
											style={{ width: 18, height: 14 }}
										/>
										<span>{shortenCountryName(country.name)}</span>
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					<div className="grid lg:grid-cols-3 gap-3 p-px">
						{tv.vote_count > 0 ? (
							<Card>
								<CardContent className="flex items-center gap-4">
									<IconStarFilled className="h-5 w-5 text-yellow-500" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											{tv.vote_average.toFixed(1)}
										</p>
										<p className="text-sm text-muted-foreground">
											{m.tv_details_votes({
												count: tv.vote_count,
												voteCount: tv.vote_count,
											})}
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

						{tv.homepage ? (
							<Card>
								<CardContent className="flex items-center gap-4">
									<IconExternalLink />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											<a
												href={tv.homepage}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline"
											>
												{m.tv_details_btn_visit()}
											</a>
										</p>
										<p className="text-sm text-muted-foreground">
											{m.tv_details_homepage()}
										</p>
									</div>
								</CardContent>
							</Card>
						) : null}
					</div>

					{cast.length > 0 ? (
						<div className="flex flex-col gap-2">
							<CastCarousel people={cast} />
							<Link to="/tv/$tvId/credits" params={{ tvId: tv.id.toString() }}>
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
	);
}
