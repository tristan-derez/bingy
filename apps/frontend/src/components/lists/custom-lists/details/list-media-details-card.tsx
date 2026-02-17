import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";

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
	const imageUrl = item.posterPath
		? `https://image.tmdb.org/t/p/w500${item.posterPath}`
		: fallbackPoster;

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
					src={imageUrl}
					alt={item.title}
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="flex-1 flex flex-col gap-2">
				<div className="flex justify-between w-full">
					<div className="flex items-baseline gap-2">
						<Link to={linkTo} className="text-lg font-semibold">
							{item.title}
						</Link>
						{year ? (
							<span className="text-sm text-muted-foreground">{year}</span>
						) : null}
					</div>
					<div>
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
