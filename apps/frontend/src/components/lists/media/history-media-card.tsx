import { IconStarFilled } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { Badge } from "@/components/ui/badge";
import { formatRating } from "@/utils/format-rating";
import { formatEpisode } from "@/utils/format-season-episode";
import { ListDropdown } from "../list-dropdown";

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
		} | null;
		addedAt: Date;
		rating: string;
	};
	linkTo: string;
}

export const HistoryMediaCard = ({ item, linkTo }: HistoryMediaCardProps) => {
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
			<Link to={linkTo}>
				<div className="relative aspect-2/3 overflow-hidden rounded-lg">
					<img
						src={imageUrl}
						alt={item.title}
						className="w-full h-full object-cover transition-transform group-hover:scale-105"
					/>
					<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/90 to-transparent" />
					<div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-transparent to-black/90" />
					<div className="w-full absolute top-2 flex items-center justify-between z-10 pr-2 pl-2">
						{item.rating ? (
							<Badge variant="outline">
								<IconStarFilled className="h-3 w-3 mr-0.5" />
								{formatRating(item.rating)}
							</Badge>
						) : (
							<span />
						)}

						{item.mediaType === "movie" ? (
							<MovieBadge minWidth={8} />
						) : (
							<TvShowBadge minWidth={8} />
						)}
					</div>
					<div className="absolute bottom-2 inset-x-0 flex items-center justify-between z-10 px-2">
						{item.mediaType === "tv" && item.progress ? (
							<Badge variant="secondary">
								{formatEpisode(
									item.progress.lastWatchedSeason,
									item.progress.lastWatchedEpisode,
								)}
							</Badge>
						) : (
							<span />
						)}

						<div onClick={(e) => e.stopPropagation()}>
							<ListDropdown {...mediaProps} imageUrl={imageUrl} />
						</div>
					</div>
				</div>
				<h3
					className="mt-2 text-sm font-medium line-clamp-1 leading-relaxed hidden sm:block"
					title={item.title}
				>
					{item.title}
				</h3>
			</Link>
		</div>
	);
};
