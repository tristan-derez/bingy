import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { CastCarousel } from "@/components/person/cast-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TvEpisodeCredits, TvEpisodeDetails } from "@/types/episode";

interface CastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}

interface TvEpisodeDetailViewProps {
	episode: TvEpisodeDetails | undefined;
	credits: TvEpisodeCredits | undefined;
	tvId: number;
	isLoading: boolean;
	isError: boolean;
	onBack: () => void;
}

export function TvEpisodeDetailsView({
	episode,
	credits,
	tvId,
	isLoading,
	isError,
	onBack,
}: TvEpisodeDetailViewProps) {
	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !episode) {
		return (
			<ResourceNotFound
				title="Episode Not Found"
				description="The episode you're looking for could not be found."
				onBack={onBack}
			/>
		);
	}

	const getRole = (person: { job: string }) => {
		if (person.job === "Director") return "Director";
		if (["Writer", "Screenplay", "Story"].includes(person.job))
			return person.job;
		return null;
	};

	const crewWithRoles =
		credits?.crew.reduce<Map<number, { name: string; roles: Set<string> }>>(
			(map, person) => {
				const role = getRole(person);
				if (!role) return map;

				const existing = map.get(person.id);
				if (existing) {
					existing.roles.add(role);
				} else {
					map.set(person.id, { name: person.name, roles: new Set([role]) });
				}
				return map;
			},
			new Map(),
		) ?? new Map();

	const crewToShow = Array.from(crewWithRoles.values());

	const backgroundImage = episode.still_path
		? `https://image.tmdb.org/t/p/original${episode.still_path}`
		: undefined;

	const mergedCast: CastMember[] = credits?.cast ? [...credits.cast] : [];
	if (mergedCast.length < 10 && episode.guest_stars) {
		const guestsToAdd = episode.guest_stars
			.slice(0, 10 - mergedCast.length)
			.map((guest) => ({
				id: guest.id,
				name: guest.name,
				character: guest.character,
				profile_path: guest.profile_path,
			}));
		mergedCast.push(...guestsToAdd);
	}

	return (
		<div className="container">
			<Button onClick={onBack} className="mb-4" variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="space-y-4">
				<div>
					<h1 className="text-4xl font-bold mb-2">{episode.name}</h1>
					{episode.name !== `Episode ${episode.episode_number}` && (
						<Badge variant="secondary">Episode {episode.episode_number}</Badge>
					)}
				</div>

				<Card
					className="relative overflow-hidden min-h-[300px] justify-center"
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
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-dark-card-foreground">
						<p className="max-w-1/2">
							{episode.overview ? episode.overview : "No overview available."}
						</p>

						{crewToShow.length > 0 && (
							<>
								<Separator />
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{crewToShow.slice(0, 3).map((person) => (
										<div key={`${person.name}`}>
											<h3 className="font-semibold text-lg whitespace-nowrap">
												{person.name}
											</h3>
											<p className="text-muted-foreground text-sm">
												{Array.from(person.roles).join(", ")}
											</p>
										</div>
									))}
								</div>
							</>
						)}
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent className="flex items-center gap-4">
							<Star className="h-5 w-5 text-yellow-500" />
							<div>
								<p className="text-xl xl:text-2xl font-bold">
									{episode.vote_count > 0
										? episode.vote_average.toFixed(1)
										: "N/R"}
								</p>
								<p className="text-sm text-muted-foreground">
									{episode.vote_count} votes
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-4">
							<Clock className="h-5 w-5" />
							<div>
								<p className="text-xl xl:text-2xl font-bold">
									{episode.runtime || "N/A"}
								</p>
								<p className="text-sm text-muted-foreground">
									{episode.runtime ? "minutes" : "Runtime"}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-4">
							<Calendar className="h-5 w-5" />
							<div>
								<p className="text-xl xl:text-2xl font-bold">
									{episode.air_date
										? new Date(episode.air_date).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})
										: "N/A"}
								</p>
								<p className="text-sm text-muted-foreground">Air Date</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{mergedCast.length > 0 && (
					<div className="flex flex-col gap-2">
						<CastCarousel people={mergedCast} />
						<Link
							to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber/credits"
							params={{
								tvId: tvId.toString(),
								seasonNumber: episode.season_number.toString(),
								episodeNumber: episode.episode_number.toString(),
							}}
						>
							See full cast and crew
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
