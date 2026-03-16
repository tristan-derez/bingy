import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { getTmdbImageUrl } from "@/utils/utils";

interface ListMediaDetailsCardProps {
	item: {
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		mediaType: "movie" | "tv";
		addedAt: Date;
		note: string | null;
		position?: number;
	};
	showPosition?: boolean;
}

export const ListMediaDetailsCard = ({
	item,
	showPosition,
}: ListMediaDetailsCardProps) => {
	const imageUrl = getTmdbImageUrl(item.posterPath, "w500");

	const year = item.releaseDate
		? new Date(item.releaseDate).getFullYear()
		: null;

	const linkTo =
		item.mediaType === "movie" ? `/movies/${item.id}` : `/tv/${item.id}`;

	return (
		<div className="flex gap-4">
			{showPosition && item.position !== undefined && (
				<div className="flex items-center justify-center w-8 shrink-0">
					<span className="text-lg font-bold text-muted-foreground">
						{item.position}
					</span>
				</div>
			)}

			<div className="relative w-24 h-36 shrink-0 overflow-hidden rounded-lg">
				<img
					src={imageUrl ?? fallbackPoster}
					alt={item.title}
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="flex-1 flex flex-col gap-2">
				<div className="flex justify-between w-full">
					<div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
						<Link to={linkTo} className="text-base md:text-lg font-semibold">
							{item.title}
						</Link>
						{year ? (
							<span className="text-sm text-muted-foreground">{year}</span>
						) : null}
					</div>
					<div className="hidden sm:block">
						{item.mediaType === "movie" ? <MovieBadge /> : <TvShowBadge />}
					</div>
				</div>
				{item.note ? (
					<p className="text-sm text-muted-foreground whitespace-pre-wrap">
						{item.note}
					</p>
				) : null}
			</div>
		</div>
	);
};
