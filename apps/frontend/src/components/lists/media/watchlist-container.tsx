import { FilmIcon, LayoutGridIcon, TvIcon } from "lucide-react";
import { useState } from "react";
import { WatchlistMediaCard } from "@/components/lists/media/watchlist-media-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { m } from "@/paraglide/messages";
import { WatchlistEmptyState } from "./watchlist-empty-state";

type MediaFilter = "all" | "movie" | "tv";

type WatchlistContainerProps = {
	title: string;
	items?: {
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		voteAverage: number;
		mediaType: string;
		addedAt: Date;
	}[];
};

export function WatchlistContainer({
	title,
	items = [],
}: WatchlistContainerProps) {
	const [filter, setFilter] = useState<MediaFilter>("all");

	const filteredMedia = items.filter((item) => {
		if (filter === "all") return true;
		return item.mediaType === filter;
	});

	const handleFilterChange = (value: string) => {
		if (value) setFilter(value as MediaFilter);
	};

	return (
		<div className="container p-4">
			<h1 className="text-3xl font-bold mb-6">{title}</h1>

			<ToggleGroup
				type="single"
				value={filter}
				onValueChange={handleFilterChange}
				className="justify-start mb-6"
			>
				<ToggleGroupItem
					value="all"
					aria-label={m.watchlist_toggle_aria_label_all()}
					className="hover:cursor-pointer"
				>
					<LayoutGridIcon className="h-4 w-4" />
					{m.watchlist_toggle_group_item_all()}
				</ToggleGroupItem>
				<ToggleGroupItem
					value="movie"
					aria-label={m.watchlist_toggle_aria_label_movies()}
					className="hover:cursor-pointer"
				>
					<FilmIcon className="h-4 w-4" />
					{m.watchlist_toggle_group_item_movies()}
				</ToggleGroupItem>
				<ToggleGroupItem
					value="tv"
					aria-label={m.watchlist_toggle_aria_label_tv()}
					className="hover:cursor-pointer"
				>
					<TvIcon className="h-4 w-4" />
					{m.watchlist_toggle_group_item_tv()}
				</ToggleGroupItem>
			</ToggleGroup>

			{filteredMedia.length === 0 ? (
				<WatchlistEmptyState filter={filter} />
			) : (
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-8 gap-2 sm:gap-4">
					{filteredMedia.map((item) => {
						const type = item.mediaType === "movie" ? "movies" : "tv";
						return (
							<WatchlistMediaCard
								key={`${item.mediaType}-${item.id}`}
								item={item}
								linkTo={`/${type}/${item.id}`}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
