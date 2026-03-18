import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { PositionBadge } from "@/components/lists/custom-lists/position-badge";
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
			<div className="flex flex-col items-center gap-2 sm:contents">
				<div className="relative w-24 h-36 shrink-0 overflow-hidden rounded-lg">
					<img
						src={imageUrl ?? fallbackPoster}
						alt={item.title}
						className="w-full h-full object-cover"
					/>
				</div>
				{showPosition && item.position ? (
					<div className="sm:hidden">
						<PositionBadge position={item.position} variant="inline" />
					</div>
				) : null}
			</div>

			<div className="flex-1 flex flex-col gap-2">
				<div className="flex justify-between w-full">
					<div className="flex items-baseline gap-2">
						{showPosition && item.position ? (
							<div className="hidden sm:flex shrink-0 justify-center self-center">
								<PositionBadge position={item.position} variant="inline" />
							</div>
						) : null}
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
