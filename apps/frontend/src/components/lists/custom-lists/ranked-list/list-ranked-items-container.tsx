import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	restrictToParentElement,
	restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ListRankedItemCard } from "@/components/lists/custom-lists/ranked-list/list-ranked-item-card";
import type { ListDraftItem } from "@/lib/atoms/draft-list";

interface ListRankedItemsContainerProps {
	items: ListDraftItem[];
	onRemove: (tmdbId: number, mediaType: string) => void;
	onUpdateNote: (tmdbId: number, mediaType: string, note: string) => void;
	onReorder: (items: ListDraftItem[]) => void;
}

export function ListRankedItemsContainer({
	items,
	onRemove,
	onUpdateNote,
	onReorder,
}: ListRankedItemsContainerProps) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex(
				(item) => `${item.tmdbId}-${item.mediaType}` === active.id,
			);
			const newIndex = items.findIndex(
				(item) => `${item.tmdbId}-${item.mediaType}` === over.id,
			);

			onReorder(arrayMove(items, oldIndex, newIndex));
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
		>
			<SortableContext
				items={items.map((item) => `${item.tmdbId}-${item.mediaType}`)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex flex-col gap-2 pl-2 md:pl-0">
					{items.map((item, index) => (
						<ListRankedItemCard
							key={`${item.tmdbId}-${item.mediaType}`}
							item={item}
							position={index + 1}
							onRemove={onRemove}
							onUpdateNote={onUpdateNote}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
