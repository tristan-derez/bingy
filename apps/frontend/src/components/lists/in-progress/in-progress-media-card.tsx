import { Link } from "@tanstack/react-router";
import type { InProgressItem } from "@/api/in-progress";
import { InProgressMediaCardActions } from "@/components/lists/in-progress/in-progress-media-card-actions";
import { Badge } from "@/components/ui/badge";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl } from "@/utils/utils";

interface InProgressMediaCardProps {
	username: string;
	item: InProgressItem;
}

const statusBadgeClassName: Record<string, string> = {
	watching: "bg-secondary text-secondary-foreground",
	on_hold: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
	dropped: "bg-red-500/15 text-red-600 dark:text-red-400",
	completed: "bg-green-500/15 text-green-600 dark:text-green-400",
};

const getStatusLabel = (status: string) => {
	switch (status) {
		case "watching":
			return m.in_progress_status_badge_watching();
		case "on_hold":
			return m.in_progress_status_badge_on_hold();
		case "dropped":
			return m.in_progress_status_badge_dropped();
		case "completed":
			return m.in_progress_status_badge_completed();
		default:
			return null;
	}
};

export const InProgressMediaCard = ({
	username,
	item,
}: InProgressMediaCardProps) => {
	const nextEpisode = item.nextEpisodes[0] ?? null;
	const { lastWatchedSeason, lastWatchedEpisode } = item.progress;
	const lastSeen =
		lastWatchedSeason > 0 && lastWatchedEpisode > 0
			? { season: lastWatchedSeason, episode: lastWatchedEpisode }
			: null;
	const statusLabel = getStatusLabel(item.progress.status);
	const canMarkWatched = item.progress.status === "watching";

	const imageUrl = nextEpisode
		? getTmdbImageUrl(nextEpisode.still_path, "w500")
		: getTmdbImageUrl(item.poster_path, "w500");

	const content = (
		<>
			<div className="aspect-video min-h-0 w-full shrink-0 min-[500px]:w-40">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={nextEpisode?.name ?? item.name}
						className="h-full min-h-0 w-full object-cover transition-transform"
					/>
				) : (
					<div className="h-full min-h-0 w-full bg-muted" />
				)}
			</div>
			<div className="flex flex-1 flex-col gap-2 p-3 min-w-0">
				<div className="flex flex-1 flex-col gap-1 min-w-0">
					<span className="truncate pr-8 text-sm font-medium">{item.name}</span>

					<div className="flex flex-col gap-0.5 min-w-0">
						{lastSeen ? (
							<span className="truncate text-xs text-muted-foreground">
								{m.in_progress_last_seen({
									season: lastSeen.season,
									episode: lastSeen.episode,
								})}
							</span>
						) : null}
						{nextEpisode ? (
							<span className="truncate text-xs font-medium text-foreground">
								{m.in_progress_next_episode({
									season: nextEpisode.season_number,
									episode: nextEpisode.episode_number,
									name: nextEpisode.name,
								})}
							</span>
						) : (
							<span className="text-xs font-medium text-muted-foreground">
								{m.in_progress_no_next_episode()}
							</span>
						)}
					</div>
				</div>
				{statusLabel ? (
					<Badge
						variant="outline"
						className={`mt-auto self-end border-transparent ${statusBadgeClassName[item.progress.status] ?? ""}`}
					>
						{statusLabel}
					</Badge>
				) : null}
			</div>
		</>
	);

	const linkClassName =
		"flex flex-1 flex-col min-[500px]:flex-row min-[500px]:items-stretch min-w-0";

	return (
		<div className="group relative flex w-full flex-col min-[500px]:flex-row min-[500px]:items-stretch overflow-hidden rounded-lg bg-card transition-colors">
			{nextEpisode ? (
				<Link
					to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
					params={{
						tvId: item.id.toString(),
						seasonNumber: nextEpisode.season_number.toString(),
						episodeNumber: nextEpisode.episode_number.toString(),
					}}
					className={linkClassName}
				>
					{content}
				</Link>
			) : (
				<Link
					to="/tv/$tvId"
					params={{ tvId: item.id.toString() }}
					className={linkClassName}
				>
					{content}
				</Link>
			)}
			{nextEpisode && canMarkWatched ? (
				<InProgressMediaCardActions
					username={username}
					item={item}
					nextEpisode={nextEpisode}
				/>
			) : null}
		</div>
	);
};
