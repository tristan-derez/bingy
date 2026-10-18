import { IconCheck } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import type { InProgressItem } from "@/api/in-progress";
import { Button } from "@/components/ui/button";
import { useMarkEpisodeWatched } from "@/hooks/useInProgress";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl } from "@/utils/utils";

interface InProgressMediaCardProps {
	username: string;
	item: InProgressItem;
}

export const InProgressMediaCard = ({
	username,
	item,
}: InProgressMediaCardProps) => {
	const nextEpisode = item.nextEpisodes[0] ?? null;
	const markWatched = useMarkEpisodeWatched(username);

	const imageUrl = nextEpisode
		? getTmdbImageUrl(nextEpisode.still_path, "w500")
		: getTmdbImageUrl(item.poster_path, "w500");

	const handleMarkWatched = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!nextEpisode) return;
		markWatched.mutate({
			tmdbId: item.id,
			seasonNumber: nextEpisode.season_number,
			episodeNumber: nextEpisode.episode_number,
			trackingMode: item.progress.trackingMode,
		});
	};

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
					<span className="truncate text-sm font-medium">{item.name}</span>

					<div className="flex flex-col gap-0.5">
						{nextEpisode ? (
							<span className="text-xs font-medium text-muted-foreground">
								S{nextEpisode.season_number} E{nextEpisode.episode_number} ·{" "}
								{nextEpisode.name}
							</span>
						) : (
							<span className="text-xs font-medium text-muted-foreground">
								{m.in_progress_no_next_episode()}
							</span>
						)}
					</div>
				</div>
				<Button
					variant="outline"
					size="sm"
					aria-label="Mark as watched"
					aria-hidden={!nextEpisode}
					tabIndex={nextEpisode ? undefined : -1}
					disabled={!nextEpisode || markWatched.isPending}
					onClick={handleMarkWatched}
					className={`mt-auto self-end ${nextEpisode ? "" : "invisible"}`}
				>
					<IconCheck className="size-4" />
					{m.cta_in_progress_card()}
				</Button>
			</div>
		</>
	);

	const cardClassName =
		"group flex w-full flex-col min-[500px]:flex-row min-[500px]:items-stretch overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-colors";

	return nextEpisode ? (
		<Link
			to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
			params={{
				tvId: item.id.toString(),
				seasonNumber: nextEpisode.season_number.toString(),
				episodeNumber: nextEpisode.episode_number.toString(),
			}}
			className={cardClassName}
		>
			{content}
		</Link>
	) : (
		<Link
			to="/tv/$tvId"
			params={{ tvId: item.id.toString() }}
			className={cardClassName}
		>
			{content}
		</Link>
	);
};
