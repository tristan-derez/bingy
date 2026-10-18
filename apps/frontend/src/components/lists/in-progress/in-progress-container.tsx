import type { InProgressFilter, InProgressItem } from "@/api/in-progress";
import { InProgressEmptyState } from "@/components/lists/in-progress/in-progress-empty-state";
import { InProgressMediaCard } from "@/components/lists/in-progress/in-progress-media-card";
import { InProgressToggleGroup } from "@/components/lists/in-progress/in-progress-toggle-group";
import { ListPagination } from "@/components/lists/list-pagination";

type InProgressContainerProps = {
	username: string;
	isOwnProfile: boolean;
	items?: InProgressItem[];
	filter: InProgressFilter;
	onFilterChange: (filter: InProgressFilter) => void;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export function InProgressContainer({
	username,
	isOwnProfile,
	items = [],
	filter,
	onFilterChange,
	page,
	totalPages,
	onPageChange,
}: InProgressContainerProps) {
	return (
		<div className="flex flex-col gap-4 flex-1">
			<InProgressToggleGroup value={filter} onValueChange={onFilterChange} />

			{items.length === 0 ? (
				<InProgressEmptyState
					filter={filter}
					username={username}
					isOwnProfile={isOwnProfile}
				/>
			) : (
				<>
					<div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-2">
						{items.map((item) => (
							<InProgressMediaCard
								key={`tv-${item.id}`}
								username={username}
								item={item}
							/>
						))}
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
