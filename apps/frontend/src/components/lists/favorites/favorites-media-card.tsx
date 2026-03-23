import { Link } from "@tanstack/react-router";
import { MediaPosterContainer } from "@/components/lists/media-poster-container";

interface FavoritesMediaCardProps {
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

export const FavoritesMediaCard = ({
	item,
	linkTo,
}: FavoritesMediaCardProps) => {
	return (
		<div key={`${item.mediaType}-${item.id}`} className="group">
			<Link to={linkTo}>
				<MediaPosterContainer {...item} />
			</Link>
		</div>
	);
};
