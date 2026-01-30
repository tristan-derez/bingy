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
	};
}

export const ListMediaDetailsCard = ({ item }: ListMediaDetailsCardProps) => {
	const imageUrl = item.posterPath
		? `https://image.tmdb.org/t/p/w500${item.posterPath}`
		: fallbackPoster;

	const year = item.releaseDate
		? new Date(item.releaseDate).getFullYear()
		: null;

	return (
		<div className="flex gap-4">
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
						<h3 className="text-lg font-semibold">{item.title}</h3>
						{year ? (
							<span className="text-sm text-muted-foreground">{year}</span>
						) : null}
					</div>
					<div>
						{item.mediaType === "movie" ? <MovieBadge /> : <TvShowBadge />}
					</div>
				</div>
				{item.note ? (
					<p className="text-sm text-muted-foreground">{item.note}</p>
				) : null}
			</div>
		</div>
	);
};
