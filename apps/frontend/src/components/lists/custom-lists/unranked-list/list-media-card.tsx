import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";

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
	const imageUrl = item.posterPath
		? `https://image.tmdb.org/t/p/w500${item.posterPath}`
		: fallbackPoster;

	const linkTo =
		item.mediaType === "movie" ? `/movies/${item.id}` : `/tv/${item.id}`;

	return (
		<div key={`${item.mediaType}-${item.id}`}>
			<Link to={linkTo}>
				<div className="relative aspect-2/3 overflow-hidden rounded-lg">
					<img
						src={imageUrl}
						alt={item.title}
						className="w-full h-full object-cover transition-transform"
					/>
					<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/90 to-transparent" />

					{showPosition ? (
						<div className="absolute top-2 left-2 z-10 bg-black/80 text-white px-2 py-1 rounded text-sm font-bold">
							#{item.position}
						</div>
					) : null}

					<div className="absolute top-2 right-2 z-10">
						{item.mediaType === "movie" ? (
							<MovieBadge minWidth={8} />
						) : (
							<TvShowBadge minWidth={8} />
						)}
					</div>
				</div>
			</Link>
		</div>
	);
};
