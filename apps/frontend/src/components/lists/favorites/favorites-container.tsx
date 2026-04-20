import { FavoritesEmptyState } from "@/components/lists/favorites/favorites-empty-state";
import { FavoritesMediaCard } from "@/components/lists/favorites/favorites-media-card";
import { ListPagination } from "@/components/lists/list-pagination";
import {
	type MediaFilter,
	MediaToggleGroup,
} from "@/components/lists/media-toggle-group";

type FavoriteContainerProps = {
	username: string;
	isOwnProfile: boolean;
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
	username,
	isOwnProfile,
	items = [],
	filter,
	onFilterChange,
	page,
	totalPages,
	onPageChange,
}: FavoriteContainerProps) {
	return (
		<div className="flex flex-col gap-4 flex-1">
			<MediaToggleGroup value={filter} onValueChange={onFilterChange} />

			{items.length === 0 ? (
				<FavoritesEmptyState
					filter={filter}
					username={username}
					isOwnProfile={isOwnProfile}
				/>
			) : (
				<>
					<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
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
