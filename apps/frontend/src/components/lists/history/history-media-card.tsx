import { IconStarFilled } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { formatEpisode } from "@/utils/format-season-episode";
import { ListDropdown } from "../media-actions/list-dropdown";

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
	const imageUrl = item.posterPath
		? `https://image.tmdb.org/t/p/w500${item.posterPath}`
		: fallbackPoster;

	const mediaProps =
		item.mediaType === "movie"
			? {
					movie: {
						mediaType: item.mediaType,
						id: item.id,
						title: item.title,
						posterPath: item.posterPath,
						releaseDate: item.releaseDate,
					},
				}
			: {
					tvShow: {
						mediaType: item.mediaType,
						id: item.id,
						name: item.title,
						posterPath: item.posterPath,
						releaseDate: item.releaseDate,
					},
				};

	return (
		<div key={`${item.mediaType}-${item.id}`} className="group">
			<Link to={linkTo}>
				<div className="relative aspect-2/3 overflow-hidden rounded-lg">
					<img
						src={imageUrl}
						alt={item.title}
						className="w-full h-full object-cover transition-transform group-hover:scale-105"
					/>
					<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/90 to-transparent" />
					<div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-transparent to-black/90" />
					<div className="w-full absolute top-2 flex items-center justify-end z-10 pr-2">
						{item.mediaType === "movie" ? (
							<MovieBadge minWidth={8} />
						) : (
							<TvShowBadge minWidth={8} />
						)}
					</div>
					<div className="absolute bottom-2 inset-x-0 flex items-center justify-between z-10 px-2">
						{item.mediaType === "tv" && item.progress ? (
							<div>
								{formatEpisode(
									item.progress.lastWatchedSeason,
									item.progress.lastWatchedEpisode,
									item.progress.absoluteEpisode,
								)}
							</div>
						) : (
							<span />
						)}

						<div onClick={(e) => e.stopPropagation()}>
							<ListDropdown {...mediaProps} imageUrl={imageUrl} />
						</div>
					</div>
				</div>
				{item.rating ? (
					<div className="mt-2">
						<RatingStars rating={item.rating} />
					</div>
				) : null}
			</Link>
		</div>
	);
};
