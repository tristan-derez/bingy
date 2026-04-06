import { Link } from "@tanstack/react-router";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { TopGradient } from "@/components/lists/top-gradient";
import { getTmdbImageUrl } from "@/utils/utils";

type ProfileFavoriteCardProps = {
	item: {
		id: number;
		title?: string;
		name?: string;
		posterPath: string | null;
		mediaType: "movie" | "tv";
		releaseDate?: string;
		firstAirDate?: string;
	};
	linkTo: string;
};

export function ProfileFavoriteCard({
	item,
	linkTo,
}: ProfileFavoriteCardProps) {
	const imageUrl = getTmdbImageUrl(item.posterPath, "w500");
	const title = item.title || item.name || "";

	return (
		<Link to={linkTo}>
			<div className="relative aspect-2/3 overflow-hidden rounded-lg">
				<TopGradient />
				<img
					src={imageUrl ?? undefined}
					alt={title}
					className="w-full h-full object-cover"
				/>
				<div className="w-full absolute top-2 flex items-center justify-end z-10 pr-2">
					{item.mediaType === "movie" ? (
						<MovieBadge minWidth={8} />
					) : (
						<TvShowBadge minWidth={8} />
					)}
				</div>
			</div>
		</Link>
	);
}
