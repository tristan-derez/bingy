import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { PositionBadge } from "@/components/lists/custom-lists/position-badge";
import { ListDropdown } from "@/components/lists/media-actions/list-dropdown";
import { getTmdbImageUrl } from "@/utils/utils";

interface ListMediaCardProps {
	item: {
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		position?: number;
		mediaType: "movie" | "tv";
		addedAt: Date;
		note: string | null;
	};
	showPosition?: boolean;
}

export const ListMediaCard = ({ item, showPosition }: ListMediaCardProps) => {
	const imageUrl = getTmdbImageUrl(item.posterPath, "w500");

	const linkTo =
		item.mediaType === "movie" ? `/movies/${item.id}` : `/tv/${item.id}`;

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
		<div key={`${item.mediaType}-${item.id}`}>
			<Link to={linkTo}>
				<div className="relative aspect-2/3 overflow-hidden rounded-lg">
					<img
						src={imageUrl ?? fallbackPoster}
						alt={item.title}
						className="w-full h-full object-cover transition-transform"
					/>
					<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/90 to-transparent" />
					<div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-transparent to-black/90" />

					{showPosition && item.position ? (
						<div className="absolute top-2 left-2 z-10">
							<PositionBadge position={item.position} variant="overlay" />
						</div>
					) : null}

					<div className="absolute top-2 right-2 z-10">
						{item.mediaType === "movie" ? (
							<MovieBadge minWidth={8} />
						) : (
							<TvShowBadge minWidth={8} />
						)}
					</div>

					<div
						className="absolute bottom-1.5 right-1.5 z-10"
						onClick={(e) => e.stopPropagation()}
					>
						<ListDropdown {...mediaProps} imageUrl={imageUrl} />
					</div>
				</div>
			</Link>
		</div>
	);
};
