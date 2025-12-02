import { Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	Clapperboard,
	ExternalLink,
	Layers,
	RotateCcw,
	Sparkles,
	Star,
	Tv,
	XCircle,
} from "lucide-react";
import Flag from "react-world-flags";
import type { Schemas } from "shared";
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
import { formatDate } from "@/utils/format-date";
import { shortenCountryName } from "@/utils/shorten-country-name";
import { ResourceNotFound } from "../errors/resource-not-found";
import { LoadingCentered } from "../loading/loading-centered";
import { CastCarousel } from "../person/cast-carousel";
import { SocialLinks } from "../social-links";
import { Separator } from "../ui/separator";
import { WatchProvidersSection } from "../watch-providers/watch-providers-section";

interface TvDetailViewProps {
	tv: Schemas.TvDetails | undefined;
	watchProviders: Schemas.WatchProviders | undefined;
	socials: Partial<Record<"facebook" | "instagram" | "twitter", string>>;
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
	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !tv) {
		return (
			<ResourceNotFound
				title="TV Show Not Found"
				description="The TV show you're looking for could not be found."
				onBack={onBack}
			/>
		);
	}

	const imageUrl = tv.poster_path
		? `https://image.tmdb.org/t/p/w500/${tv.poster_path}`
		: fallbackPoster;

	const backgroundImage = tv.backdrop_path
		? `https://image.tmdb.org/t/p/original/${tv.backdrop_path}`
		: undefined;

	return (
		<div className="container">
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="grid xl:grid-cols-[auto_1fr] gap-4 justify-items-center">
				<div className="flex flex-col gap-2 items-center xl:items-start max-w-[400px]">
					<img
						src={imageUrl}
						alt={tv.name}
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

				<div className="max-w-full space-y-4 overflow-hidden">
					<Card className="shadow-none bg-transparent xl:p-0 border-none">
						<CardContent className="xl:p-0">
							<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-4xl font-bold leading-relaxed">
										{tv.name}
									</h1>
									{tv.tagline && (
										<p className="text-muted-foreground italic">{tv.tagline}</p>
									)}

									<div className="flex flex-wrap gap-2 mt-2">
										{tv.genres.map((genre) => (
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
						className="relative overflow-hidden min-h-[200px] border-none"
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
						<CardHeader className="text-dark-card-foreground">
							<CardTitle>Overview</CardTitle>
						</CardHeader>

						<CardContent className="space-y-4 text-dark-card-foreground gap-4">
							<p className="max-w-2/3">{tv.overview}</p>
							<Separator />
							{tv.created_by.length > 0 && (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{tv.created_by.slice(0, 3).map((creator) => (
										<div key={creator.id}>
											<h3 className="font-semibold text-lg whitespace-nowrap">
												{creator.name}
											</h3>
											<p className="text-muted-foreground text-sm">Creator</p>
										</div>
									))}
								</div>
							)}
						</CardContent>

						<CardFooter>
							<div className="flex flex-wrap gap-2">
								{tv.production_countries.map((country) => (
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
										{tv.vote_count > 0 ? tv.vote_average.toFixed(1) : "N/R"}
									</p>
									<p className="text-sm text-muted-foreground">
										{tv.vote_count} votes
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center gap-4">
								<Calendar className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{tv.first_air_date
											? formatDate(tv.first_air_date, "en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})
											: "N/A"}
									</p>
									<p className="text-sm text-muted-foreground">First Aired</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center gap-4">
								{tv.status === "In Production" && (
									<Clapperboard className="h-5 w-5" />
								)}
								{tv.status === "Returning Series" && (
									<RotateCcw className="h-5 w-5" />
								)}
								{tv.status === "Canceled" && <XCircle className="h-5 w-5" />}
								{tv.status === "Ended" && <CheckCircle className="h-5 w-5" />}
								{tv.status === "Pilot" && <Sparkles className="h-5 w-5" />}
								<div>
									<p className="text-xl xl:text-2xl font-bold">{tv.status}</p>
									<p className="text-sm text-muted-foreground">Status</p>
								</div>
							</CardContent>
						</Card>
						<Link to="/tv/$tvId/seasons" params={{ tvId: tv.id.toString() }}>
							<Card>
								<CardContent className="flex items-center gap-4">
									<Tv className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											{tv.number_of_seasons}
										</p>
										<p className="text-sm text-muted-foreground">
											{tv.number_of_seasons > 1 ? "Seasons" : "Season"}
										</p>
									</div>
								</CardContent>
							</Card>
						</Link>

						<Card>
							<CardContent className="flex items-center gap-4">
								<Layers className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{tv.number_of_episodes}
									</p>
									<p className="text-sm text-muted-foreground">
										Total {tv.number_of_episodes > 1 ? "Episodes" : "Episode"}
									</p>
								</div>
							</CardContent>
						</Card>

						{tv.homepage && (
							<Card>
								<CardContent className="flex items-center gap-4">
									<ExternalLink className="h-5 w-5" />
									<div>
										<p className="text-xl xl:text-2xl font-bold">
											<a
												href={tv.homepage}
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
							<Link to="/tv/$tvId/credits" params={{ tvId: tv.id.toString() }}>
								See full cast and crew
							</Link>
						</div>
					)}

					{tv.networks.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>
									{`Network${tv.networks.length > 1 ? "s" : ""}`}
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
					)}

					{tv.production_companies && tv.production_companies.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>
									{`Production Compan${tv.production_companies.length > 1 ? "ies" : "y"}`}
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
					)}
				</div>
			</div>
		</div>
	);
}
