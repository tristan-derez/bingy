import { IconDeviceTv, IconLayoutGrid, IconMovie } from "@tabler/icons-react";
import { ListPagination } from "@/components/lists/list-pagination";
import { WatchlistEmptyState } from "@/components/lists/watchlist/watchlist-empty-state";
import { WatchlistMediaCard } from "@/components/lists/watchlist/watchlist-media-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { m } from "@/paraglide/messages";

export type MediaFilter = "all" | "movie" | "tv";

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
	filter: MediaFilter;
	onFilterChange: (filter: MediaFilter) => void;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export function WatchlistContainer({
	title,
	items = [],
	filter,
	onFilterChange,
	page,
	totalPages,
	onPageChange,
}: WatchlistContainerProps) {
	const handleFilterChange = (value: string) => {
		if (value) {
			onFilterChange(value as MediaFilter);
			onPageChange(1);
		}
	};

	return (
		<div className="container flex flex-col gap-4">
			<h1 className="text-3xl font-bold">{title}</h1>

			<ToggleGroup
				value={filter ? [filter] : []}
				onValueChange={(values) => handleFilterChange(values[0] || "")}
				className="justify-start"
				spacing={2}
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
				<WatchlistEmptyState filter={filter} />
			) : (
				<>
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-8 gap-2 sm:gap-4">
						{items.map((item) => {
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
