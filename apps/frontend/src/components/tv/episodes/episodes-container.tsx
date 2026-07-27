import { IconStopwatch } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { isFuture } from "date-fns";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { localeRegionAtom } from "@/lib/atoms/region";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { formatRuntime } from "@/utils/format-runtime";

interface EpisodesContainerProps {
	episodes: Schemas.TvSeasonDetails["episodes"];
}

export function EpisodesContainer({ episodes }: EpisodesContainerProps) {
	const localeRegion = useAtomValue(localeRegionAtom);

	return (
		<Card>
			<CardContent className="flex flex-col gap-4">
				{episodes.map((episode, index) => (
					<div key={episode.id}>
						{index > 0 ? <Separator className="mb-4" /> : null}
						<div className="flex flex-col gap-2">
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
											{isFuture(new Date(episode.air_date))
												? m.airs_on()
												: m.aired_on()}
											{formatDate(episode.air_date, localeRegion, {
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
											<IconStopwatch className="w-4 h-4" />
											{formatRuntime(episode.runtime)}
										</Badge>
									) : null}
								</div>
							</div>
							<p
								className={cn(
									"text-sm whitespace-pre-line max-w-5/6 text-pretty",
									!episode.overview && "italic",
								)}
							>
								{episode.overview || m.overview_none()}
							</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
