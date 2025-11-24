import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Layers, Star, Timer } from "lucide-react";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CastCarousel } from "@/components/person/cast-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CastMember } from "@/types/person";
import type { TvSeasonDetails } from "@/types/season";
import type { TvCredits } from "@/types/tv";
import { EpisodesContainer } from "../episodes/episodes-container";

interface TvSeasonDetailsViewProps {
	tvSeason: TvSeasonDetails | undefined;
	credits: TvCredits | undefined;
	tvId: number;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

type MinimalCast = {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
};

export function TvSeasonDetailsView({
	tvSeason,
	credits,
	tvId,
	isLoading,
	isError,
	onBack,
}: TvSeasonDetailsViewProps) {
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

	const guestStars = Array.from(
		new Map(
			tvSeason.episodes
				.flatMap((ep) =>
					(ep.guest_stars ?? []).map((g) => ({
						id: g.id,
						name: g.name,
						character: g.character,
						profile_path: g.profile_path,
					})),
				)
				.map((p) => [p.id, p]),
		).values(),
	);

	const seasonCastMinimal: MinimalCast[] =
		(credits?.cast ?? []).map((p: CastMember) => ({
			id: p.id,
			name: p.name,
			character: p.character,
			profile_path: p.profile_path ?? null,
			order: typeof p.order === "number" ? p.order : 9999,
		})) ?? [];

	const guestStarsMinimal: MinimalCast[] = guestStars.map((g) => ({
		id: g.id,
		name: g.name,
		character: g.character,
		profile_path: g.profile_path ?? null,
		order: typeof (g as any).order === "number" ? (g as any).order : 9999,
	}));

	let mergedCast: MinimalCast[] = [];

	if (seasonCastMinimal.length >= 10) {
		mergedCast = seasonCastMinimal
			.slice()
			.sort((a, b) => a.order - b.order)
			.slice(0, 10);
	} else if (seasonCastMinimal.length > 0) {
		const all = [...seasonCastMinimal, ...guestStarsMinimal];

		const byId = new Map<number, MinimalCast>();

		for (const p of all) {
			const existing = byId.get(p.id);
			if (!existing) {
				byId.set(p.id, p);
			} else if (p.order < existing.order) {
				byId.set(p.id, p);
			}
		}

		mergedCast = Array.from(byId.values())
			.sort((a, b) => a.order - b.order)
			.slice(0, 10);
	} else {
		mergedCast = guestStarsMinimal
			.slice()
			.sort((a, b) => a.order - b.order)
			.slice(0, 10);
	}

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

					{mergedCast.length > 0 && (
						<div className="flex flex-col gap-2">
							<CastCarousel people={mergedCast} />
							<Link
								to="/tv/$tvId/season/$seasonNumber/credits"
								params={{
									tvId: tvId.toString(),
									seasonNumber: tvSeason.season_number.toString(),
								}}
							>
								See full cast and crew
							</Link>
						</div>
					)}

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
