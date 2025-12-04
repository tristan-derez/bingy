import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";
import type { Schemas } from "shared";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { MediaOverview } from "@/components/medias/overview";
import { CastCarousel } from "@/components/person/cast-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { localeWithRegionAtom } from "@/lib/atoms/locale";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { formatRuntime } from "@/utils/format-runtime";

interface TvEpisodeDetailViewProps {
	episode: Schemas.TvEpisodeDetails | undefined;
	credits: Schemas.TvEpisodeCredits | undefined;
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
	const localeWithRegion = useAtomValue(localeWithRegionAtom);
	if (isLoading) {
		return <LoadingCentered />;
	}

	if (isError || !episode) {
		return (
			<ResourceNotFound
				title={m.episode_details_not_found_title()}
				description={m.episode_details_not_found_desc()}
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

	const mergedCast: Schemas.CastMember[] = credits?.cast
		? credits.cast.map((member) => ({
				...member,
				cast_id: member.id,
			}))
		: [];
	if (mergedCast.length < 10 && episode.guest_stars) {
		mergedCast.push(
			...episode.guest_stars.slice(0, 10 - mergedCast.length).map((guest) => ({
				...guest,
				cast_id: guest.id,
			})),
		);
	}

	return (
		<div className="container">
			<Button onClick={onBack} variant="outline">
				<ArrowLeft className="h-4 w-4" /> Back
			</Button>

			<div className="flex flex-col gap-4 pt-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl font-bold">{episode.name}</h1>
					{episode.name !== `Episode ${episode.episode_number}` && (
						<Badge variant="secondary" className="self-start">
							{m.badge_episode_number({
								episodeNumber: episode.episode_number,
							})}
						</Badge>
					)}
				</div>

				<Card
					className={`relative overflow-hidden min-h-[300px] justify-center ${
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
					<CardHeader>
						<CardTitle>{m.episode_details_overview_title()}</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<MediaOverview overview={episode.overview} bg={backgroundImage} />

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
					{episode.vote_count > 0 ? (
						<Card>
							<CardContent className="flex items-center gap-4">
								<Star className="h-5 w-5 text-yellow-500" />
								<div>
									<p className="text-xl xl:text-2xl font-bold">
										{episode.vote_average.toFixed(1)}
									</p>
									<p className="text-sm text-muted-foreground">
										{episode.vote_count} votes
									</p>
								</div>
							</CardContent>
						</Card>
					) : null}

					<Card>
						<CardContent className="flex items-center gap-4">
							<Clock className="h-5 w-5" />
							<div>
								<p className="text-xl xl:text-2xl font-bold">
									{formatRuntime(episode.runtime)}
								</p>
								<p className="text-sm text-muted-foreground">
									{m.episode_details_runtime_text()}
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
										? formatDate(episode.air_date, localeWithRegion, {
												year: "numeric",
												month: "short",
												day: "numeric",
											})
										: "N/A"}
								</p>
								<p className="text-sm text-muted-foreground">
									{m.episode_details_air_date()}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{mergedCast.length > 0 && (
					<div className="flex flex-col gap-2 overflow-hidden">
						<CastCarousel people={mergedCast} />
						<Link
							to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber/credits"
							params={{
								tvId: tvId.toString(),
								seasonNumber: episode.season_number.toString(),
								episodeNumber: episode.episode_number.toString(),
							}}
						>
							{m.link_text_full_credits()}
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
