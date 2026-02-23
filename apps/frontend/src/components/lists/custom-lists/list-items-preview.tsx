import type { ListDraftItem } from "@/lib/atoms/draft-list";
import { m } from "@/paraglide/messages";
import { ClearMediasButton } from "./clear-medias-button";
import { ListRankedItemsContainer } from "./ranked-list/list-ranked-items-container";
import { ListAddedItemMediaCard } from "./unranked-list/list-added-item-card";

interface ListItemsPreviewProps {
	selectedItems: ListDraftItem[];
	listType: "ranked" | "unranked";
	clearItems: () => void;
	handleRemoveItem: (tmdbId: number, mediaType: string) => void;
	handleUpdateNote: (tmdbId: number, mediaType: string, note: string) => void;
	handleReorder: (reorderedItems: ListDraftItem[]) => void;
}

export function ListItemsPreview({
	selectedItems,
	listType,
	clearItems,
	handleRemoveItem,
	handleUpdateNote,
	handleReorder,
}: ListItemsPreviewProps) {
	if (selectedItems.length === 0) return null;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between items-center">
				<h3 className="text-sm font-medium">
					{m.list_added_items({
						count: selectedItems.length,
						total_items: selectedItems.length,
					})}
				</h3>
				<ClearMediasButton onClear={clearItems} />
			</div>

			{listType === "ranked" ? (
				<ListRankedItemsContainer
					items={selectedItems}
					onRemove={handleRemoveItem}
					onUpdateNote={handleUpdateNote}
					onReorder={handleReorder}
				/>
			) : (
				<div className="grid grid-cols-1 gap-2">
					{selectedItems.toReversed().map((item) => {
						return (
							<ListAddedItemMediaCard
								item={item}
								onRemove={handleRemoveItem}
								onUpdateNote={handleUpdateNote}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
