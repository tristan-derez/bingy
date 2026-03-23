import { Link } from "@tanstack/react-router";
import { MediaPosterContainer } from "@/components/lists/media-poster-container";

interface WatchlistMediaCardProps {
	item: {
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		mediaType: "movie" | "tv";
		addedAt: Date;
	};
	linkTo: string;
}

export const WatchlistMediaCard = ({
	item,
	linkTo,
}: WatchlistMediaCardProps) => {
	return (
		<div key={`${item.mediaType}-${item.id}`}>
			<Link to={linkTo}>
				<MediaPosterContainer {...item} />
			</Link>
		</div>
	);
};
