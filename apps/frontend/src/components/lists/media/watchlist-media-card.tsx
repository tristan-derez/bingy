import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import type { MediaItem } from "@/utils/media-info";
import { getMediaInfo } from "@/utils/media-info";
import { ToggleWatchlistButton } from "./toggle-watchlist-button";

interface WatchlistMediaCardProps {
	item: MediaItem;
}

export const WatchlistMediaCard = ({ item }: WatchlistMediaCardProps) => {
	const { title, imageUrl, linkTo } = getMediaInfo(item, fallbackPoster);

	return (
		<div key={`${item.mediaType}-${item.id}`} className="group">
			<div className="relative aspect-2/3 overflow-hidden rounded-lg">
				<Link to={linkTo} className="block w-full h-full">
					<img
						src={imageUrl}
						alt={title}
						className="w-full h-full object-cover transition-transform group-hover:scale-105"
					/>
					<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/90 to-transparent" />
				</Link>
				<div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
					<ToggleWatchlistButton
						{...(item.mediaType === "movie"
							? { movie: item as Schemas.MovieDetails }
							: { tvShow: item as Schemas.TvDetails })}
					/>
					{item.mediaType === "movie" ? (
						<MovieBadge minWidth={8} />
					) : (
						<TvShowBadge minWidth={8} />
					)}
				</div>
			</div>
			<Link to={linkTo} className="hidden sm:block">
				<h3
					className="mt-2 text-sm font-medium line-clamp-1 leading-relaxed"
					title={title}
				>
					{title}
				</h3>
			</Link>
		</div>
	);
};
