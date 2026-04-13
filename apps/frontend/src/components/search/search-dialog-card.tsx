import { useAtomValue } from "jotai";
import { forwardRef } from "react";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import { localeAtom } from "@/lib/atoms/locale";
import { formatDate } from "@/utils/format-date";
import { getTmdbImageUrl } from "@/utils/utils";

interface SearchDialogCardProps {
	item: Schemas.MediaMulti;
	onSelect: () => void;
	isSelected?: boolean;
}

export const SearchDialogCard = forwardRef<
	HTMLDivElement,
	SearchDialogCardProps
>(function SearchDialogCard({ item, onSelect, isSelected = false }, ref) {
	const locale = useAtomValue(localeAtom);

	if (item.media_type === "movie") {
		const movie = item as Schemas.MovieMedia;
		const imageUrl =
			getTmdbImageUrl(movie.poster_path, "w200") ?? fallbackPoster;
		const year = movie.release_date
			? formatDate(movie.release_date, locale, { year: "numeric" })
			: null;

		return (
			<div
				ref={ref}
				onClick={onSelect}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onSelect();
					}
				}}
				tabIndex={0}
				role="button"
				className={`flex w-full items-center gap-2 md:gap-3 p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden ${
					isSelected ? "bg-accent" : "hover:bg-accent"
				}`}
			>
				<img
					src={imageUrl}
					alt={movie.title}
					className="w-10 md:w-12 h-15 md:h-18 object-cover aspect-2/3 rounded shrink-0"
				/>
				<div className="flex-1 min-w-0">
					<p className="font-medium text-xs md:text-sm truncate">
						{movie.title}
					</p>

					<p className="text-xs text-muted-foreground truncate">
						{year ? `${year} - ` : null} Movie
					</p>
				</div>
			</div>
		);
	}

	if (item.media_type === "tv") {
		const tv = item as Schemas.TvMedia;
		const imageUrl = getTmdbImageUrl(tv.poster_path, "w200") ?? fallbackPoster;
		const year = tv.first_air_date
			? formatDate(tv.first_air_date, locale, { year: "numeric" })
			: null;

		return (
			<div
				ref={ref}
				onClick={onSelect}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onSelect();
					}
				}}
				tabIndex={0}
				role="button"
				className={`flex w-full items-center gap-2 md:gap-3 p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden ${
					isSelected ? "bg-accent" : "hover:bg-accent"
				}`}
			>
				<img
					src={imageUrl}
					alt={tv.name}
					className="w-10 md:w-12 h-15 md:h-18 object-cover aspect-2/3 rounded shrink-0"
				/>
				<div className="flex-1 min-w-0">
					<p className="font-medium text-xs md:text-sm truncate">{tv.name}</p>

					<p className="text-xs text-muted-foreground truncate">
						{year ? `${year} - ` : null} TV show
					</p>
				</div>
			</div>
		);
	}

	return null;
});
