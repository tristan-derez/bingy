import { Link } from "@tanstack/react-router";
import { Star, Timer, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TvSeasonDetails } from "@/types/season";
import { formatDate } from "@/utils/format-date";

interface EpisodesContainerProps {
	episodes: TvSeasonDetails["episodes"];
}

export function EpisodesContainer({ episodes }: EpisodesContainerProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Episodes</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{episodes.map((episode, index) => (
					<div key={episode.id}>
						{index > 0 ? <Separator className="my-4" /> : null}
						<div className="space-y-2">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<h3 className="font-semibold text-lg">
										<Link
											to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
											params={{
												tvId: episode.show_id.toString(),
												seasonNumber: episode.season_number.toString(),
												episodeNumber: episode.episode_number.toString(),
											}}
										>
											{episode.episode_number}. {episode.name}
										</Link>
									</h3>
									{episode.air_date ? (
										<p className="text-sm text-muted-foreground">
											{formatDate(episode.air_date, "en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</p>
									) : null}
								</div>
								<div className="flex flex-row gap-2">
									{episode.runtime && episode.runtime > 0 ? (
										<Badge className="flex items-center gap-1 border-none self-center">
											<Timer className="w-3 h-3" />
											{episode.runtime > 59
												? `${Math.floor(episode.runtime / 60)}h ${episode.runtime % 60}m`
												: `${episode.runtime}m`}
										</Badge>
									) : null}
									{episode.vote_average > 0 ? (
										<Badge
											variant="secondary"
											className="flex items-center gap-1 self-center"
										>
											<Star className="h-3 w-3 text-yellow-500" />
											{episode.vote_average.toFixed(1)}
										</Badge>
									) : null}
								</div>
							</div>
							<p className="text-sm text-muted-foreground whitespace-pre-line">
								{episode.overview || "No overview available."}
							</p>
							<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
								{episode.crew?.length > 0 ? (
									<span className="flex items-center gap-1">
										<Users className="h-3 w-3" />
										{episode.crew.length} crew
									</span>
								) : null}
								{episode.guest_stars?.length > 0 ? (
									<span className="flex items-center gap-1">
										<User className="h-3 w-3" />
										{episode.guest_stars.length} guest stars
									</span>
								) : null}
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
