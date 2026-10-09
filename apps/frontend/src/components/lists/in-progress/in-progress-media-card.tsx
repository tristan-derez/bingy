import { IconCheck } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { InProgressItem } from "@/api/in-progress";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl } from "@/utils/utils";

interface InProgressMediaCardProps {
	item: InProgressItem;
}

export const InProgressMediaCard = ({ item }: InProgressMediaCardProps) => {
	const nextEpisode = item.nextEpisodes[0];

	if (!nextEpisode) return null;

	const stillUrl = getTmdbImageUrl(nextEpisode.still_path, "w500");

	return (
		<Link
			key={`tv-${item.id}`}
			to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
			params={{
				tvId: item.id.toString(),
				seasonNumber: nextEpisode.season_number.toString(),
				episodeNumber: nextEpisode.episode_number.toString(),
			}}
			className="group flex w-full flex-col min-[500px]:flex-row min-[500px]:items-stretch overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
		>
			<div className="min-h-0 w-full shrink-0 min-[500px]:w-40">
				{stillUrl ? (
					<img
						src={stillUrl}
						alt={nextEpisode.name}
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
						<span className="text-xs font-medium text-muted-foreground">
							S{nextEpisode.season_number} E{nextEpisode.episode_number} ·{" "}
							{nextEpisode.name}
						</span>
						<span className="text-xs text-muted-foreground truncate"></span>
					</div>
				</div>
				<Button
					variant="outline"
					size="sm"
					aria-label="Mark as watched"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					className="mt-auto self-end"
				>
					<IconCheck className="size-4" />
					{m.cta_in_progress_card()}
				</Button>
			</div>
		</Link>
	);
};
