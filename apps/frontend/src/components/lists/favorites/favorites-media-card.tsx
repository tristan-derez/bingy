import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { ListDropdown } from "@/components/lists/media-actions/list-dropdown";
import { formatEpisode } from "@/utils/format-season-episode";
import { getTmdbImageUrl } from "@/utils/utils";

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
	const imageUrl = getTmdbImageUrl(item.posterPath, "w500");

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
						src={imageUrl ?? fallbackPoster}
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
			</Link>
		</div>
	);
};
