import { IconDeviceTv, IconLayoutGrid, IconMovie } from "@tabler/icons-react";
import { FavoritesEmptyState } from "@/components/lists/favorites/favorites-empty-state";
import { FavoritesMediaCard } from "@/components/lists/favorites/favorites-media-card";
import { ListPagination } from "@/components/lists/list-pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { m } from "@/paraglide/messages";

export type MediaFilter = "all" | "movie" | "tv";

type FavoriteContainerProps = {
	items?: {
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
	}[];
	filter: MediaFilter;
	onFilterChange: (filter: MediaFilter) => void;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export function FavoriteContainer({
	items = [],
	filter,
	onFilterChange,
	page,
	totalPages,
	onPageChange,
}: FavoriteContainerProps) {
	const handleFilterChange = (value: string) => {
		if (value) {
			onFilterChange(value as MediaFilter);
			onPageChange(1);
		}
	};

	return (
		<div className="container px-4 flex flex-col gap-4">
			<h1 className="text-3xl font-bold">{m.favorites_page_title_text()}</h1>

			<ToggleGroup
				type="single"
				value={filter}
				onValueChange={handleFilterChange}
				className="justify-start"
			>
				<ToggleGroupItem
					value="all"
					aria-label={m.toggle_aria_label_all()}
					className="hover:cursor-pointer"
				>
					<IconLayoutGrid className="h-4 w-4" />
					{m.toggle_group_item_all()}
				</ToggleGroupItem>
				<ToggleGroupItem
					value="movie"
					aria-label={m.toggle_aria_label_movies()}
					className="hover:cursor-pointer"
				>
					<IconMovie className="h-4 w-4" />
					{m.toggle_group_item_movies()}
				</ToggleGroupItem>
				<ToggleGroupItem
					value="tv"
					aria-label={m.toggle_aria_label_tv()}
					className="hover:cursor-pointer"
				>
					<IconDeviceTv className="h-4 w-4" />
					{m.toggle_group_item_tv()}
				</ToggleGroupItem>
			</ToggleGroup>

			{items.length === 0 ? (
				<FavoritesEmptyState filter={filter} />
			) : (
				<>
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-8 gap-2 sm:gap-4">
						{items.map((item) => {
							const type = item.mediaType === "movie" ? "movies" : "tv";
							return (
								<FavoritesMediaCard
									key={`${item.mediaType}-${item.id}`}
									item={item}
									linkTo={`/${type}/${item.id}`}
								/>
							);
						})}
					</div>

					<ListPagination
						page={page}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
				</>
			)}
		</div>
	);
}
