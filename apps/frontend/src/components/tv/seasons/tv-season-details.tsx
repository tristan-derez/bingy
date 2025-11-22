import { ArrowLeft, Calendar, Layers, Star, Timer } from "lucide-react";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TvSeasonDetails } from "@/types/season";
import { EpisodesContainer } from "../episodes/episodes-container";

interface TvSeasonNumberDetailsViewProps {
	tvSeason: TvSeasonDetails | undefined;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function TvSeasonNumberDetailsView({
	tvSeason,
	isLoading,
	isError,
	onBack,
}: TvSeasonNumberDetailsViewProps) {
	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !tvSeason) {
		return (
			<ResourceNotFound
				title="Season Not Found"
				description="The season you're looking for could not be found."
				onBack={onBack}
			/>
		);
	}

	const uniqueNetworks = tvSeason.networks.filter(
		(network, index, self) =>
			index === self.findIndex((n) => n.id === network.id),
	);

	const imageUrl = tvSeason.poster_path
		? `https://image.tmdb.org/t/p/w500${tvSeason.poster_path}`
		: fallbackPoster;

	return (
		<div className="container">
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="grid xl:grid-cols-[auto_1fr] gap-4">
				<div className="flex justify-center xl:justify-start">
					<img
						src={imageUrl}
						alt={tvSeason.name}
						className="rounded-lg shadow-lg w-1/2 xl:w-auto xl:max-h-[600px]"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
				</div>

				<div className="space-y-4 overflow-hidden">
					<Card className="shadow-none bg-transparent xl:p-0 border-none">
						<CardContent className="xl:p-0">
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between gap-3">
									<h1 className="text-4xl font-bold leading-tight">
										{tvSeason.name}
									</h1>
									{tvSeason.episodes.some((ep) => ep.runtime) && (
										<Badge variant="default" className="w-fit shrink-0 gap-1">
											<Timer className="h-4 w-4" />
											<span>
												{(
													tvSeason.episodes.reduce(
														(total, ep) => total + (ep.runtime || 0),
														0,
													) / 60
												).toFixed(1)}
												h
											</span>
										</Badge>
									)}
								</div>
								{tvSeason.name.toLowerCase() !==
								`season ${tvSeason.season_number}` ? (
									<Badge variant="secondary" className="w-fit">
										Season {tvSeason.season_number}
									</Badge>
								) : null}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent>
							<p>{tvSeason.overview || "No overview available."}</p>
						</CardContent>
					</Card>

					<div className="grid lg:grid-cols-3 gap-3">
						<Card>
							<CardContent className="flex items-center gap-4">
								<Star className="h-5 w-5 text-yellow-500" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{tvSeason.vote_average > 0
											? tvSeason.vote_average.toFixed(1)
											: "N/R"}
									</p>
									<p className="text-sm text-muted-foreground">Rating</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center gap-4">
								<Calendar className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{tvSeason.air_date
											? new Date(tvSeason.air_date).toLocaleDateString(
													"en-US",
													{
														year: "numeric",
														month: "short",
														day: "numeric",
													},
												)
											: "N/A"}
									</p>
									<p className="text-sm text-muted-foreground">Air Date</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center gap-4">
								<Layers className="h-5 w-5" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{tvSeason.episodes.length}
									</p>
									<p className="text-sm text-muted-foreground">
										{tvSeason.episodes.length === 1 ? "Episode" : "Episodes"}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{tvSeason.episodes.length > 0 ? (
						<EpisodesContainer episodes={tvSeason.episodes} />
					) : null}
					{tvSeason.networks.length > 0 ? (
						<Card>
							<CardHeader>
								<CardTitle>
									{`Network${tvSeason.networks.length > 1 ? "s" : ""}`}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-wrap gap-4">
								{uniqueNetworks.map((network) => (
									<Badge
										key={network.id}
										className="flex items-center gap-3"
										variant="outline"
									>
										{network.name}
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
