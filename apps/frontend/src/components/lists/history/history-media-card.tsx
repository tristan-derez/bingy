import { IconStarFilled } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { MediaPosterContainer } from "@/components/lists/media-poster-container";
import { formatEpisode } from "@/utils/format-season-episode";

interface HistoryMediaCardProps {
	item: {
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		mediaType: "movie" | "tv";
		watchedAt: Date | null;
		progress?: {
			lastWatchedSeason: number;
			lastWatchedEpisode: number;
			absoluteEpisode?: number;
		} | null;
		addedAt: Date;
		rating: string;
	};
	linkTo: string;
}

const RatingStars = ({ rating }: { rating: string }) => {
	const numericRating = Number.parseFloat(rating);
	const fullStars = Math.floor(numericRating);
	const hasHalfStar = numericRating % 1 !== 0;

	return (
		<div className="flex items-center gap-0.5">
			{Array.from({ length: fullStars }).map((_, i) => (
				<IconStarFilled key={i} className="h-3.5 w-3.5 text-brand" />
			))}
			{hasHalfStar ? (
				<span className="text-xs text-brand font-medium">½</span>
			) : null}
		</div>
	);
};

export const HistoryMediaCard = ({ item, linkTo }: HistoryMediaCardProps) => {
	return (
		<div key={`${item.mediaType}-${item.id}`} className="group">
			<Link to={linkTo}>
				<MediaPosterContainer {...item} />
				<div className="flex flex-row justify-between items-center mt-2">
					{item.mediaType === "tv" && item.progress ? (
						<p className="text-sm text-muted-foreground">
							{formatEpisode(
								item.progress.lastWatchedSeason,
								item.progress.lastWatchedEpisode,
								item.progress.absoluteEpisode,
							)}
						</p>
					) : (
						<span />
					)}
					{item.rating ? (
						<div>
							<RatingStars rating={item.rating} />
						</div>
					) : null}
				</div>
			</Link>
		</div>
	);
};
