import { HistoryMediaCard } from "@/components/lists/history/history-media-card";
import {
	type MediaFilter,
	MediaToggleGroup,
} from "@/components/lists/media-toggle-group";
import { ListPagination } from "../list-pagination";
import { HistoryEmptyState } from "./history-empty-state";

type HistoryContainerProps = {
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

export function HistoryContainer({
	username,
	isOwnProfile,
	items = [],
	filter,
	onFilterChange,
	page,
	totalPages,
	onPageChange,
}: HistoryContainerProps) {
	return (
		<div className="flex flex-col gap-4 flex-1">
			<MediaToggleGroup value={filter} onValueChange={onFilterChange} />

			{items.length === 0 ? (
				<HistoryEmptyState
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
								<HistoryMediaCard
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
