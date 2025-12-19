import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { WatchlistToggleButton } from "./watchlist-toggle-button";

interface WatchlistMediaCardProps {
	item: {
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		voteAverage: number;
		mediaType: string;
		addedAt: Date;
	};
	linkTo: string;
}

export const WatchlistMediaCard = ({
	item,
	linkTo,
}: WatchlistMediaCardProps) => {
	const imageUrl = item.posterPath
		? `https://image.tmdb.org/t/p/w500${item.posterPath}`
		: fallbackPoster;

	const mediaProps =
		item.mediaType === "movie"
			? { movie: { mediaType: item.mediaType, id: item.id, title: item.title } }
			: {
					tvShow: { mediaType: item.mediaType, id: item.id, name: item.title },
				};

	return (
		<div key={`${item.mediaType}-${item.id}`} className="group">
			<div className="relative aspect-2/3 overflow-hidden rounded-lg">
				<Link to={linkTo} className="block w-full h-full">
					<img
						src={imageUrl}
						alt={item.title}
						className="w-full h-full object-cover transition-transform group-hover:scale-105"
					/>
					<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/90 to-transparent" />
				</Link>
				<div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
					<WatchlistToggleButton color="white" {...mediaProps} />
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
					title={item.title}
				>
					{item.title}
				</h3>
			</Link>
		</div>
	);
};
