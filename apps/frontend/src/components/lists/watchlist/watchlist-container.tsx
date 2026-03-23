import { ListPagination } from "@/components/lists/list-pagination";
import { WatchlistEmptyState } from "@/components/lists/watchlist/watchlist-empty-state";
import { WatchlistMediaCard } from "@/components/lists/watchlist/watchlist-media-card";
import { MediaToggleGroup } from "../media-toggle-group";

export type MediaFilter = "all" | "movie" | "tv";

type WatchlistContainerProps = {
	username: string;
	isOwnProfile: boolean;
	title: string;
	items?: {
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		voteAverage: number;
		mediaType: "movie" | "tv";
		addedAt: Date;
	}[];
	filter: MediaFilter;
	onFilterChange: (filter: MediaFilter) => void;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export function WatchlistContainer({
	username,
	isOwnProfile,
	title,
	items = [],
	filter,
	onFilterChange,
	page,
	totalPages,
	onPageChange,
}: WatchlistContainerProps) {
	return (
		<div className="container flex flex-col gap-4">
			<h1 className="text-3xl font-bold">{title}</h1>

			<MediaToggleGroup value={filter} onValueChange={onFilterChange} />

			{items.length === 0 ? (
				<WatchlistEmptyState
					filter={filter}
					username={username}
					isOwnProfile={isOwnProfile}
				/>
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
