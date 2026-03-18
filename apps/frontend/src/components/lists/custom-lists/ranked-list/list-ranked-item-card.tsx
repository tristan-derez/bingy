import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ListDraftItem } from "@/lib/atoms/draft-list";
import { m } from "@/paraglide/messages";

interface ListRankedItemCardProps {
	item: ListDraftItem;
	position: number;
	onRemove: (tmdbId: number, mediaType: string) => void;
	onUpdateNote: (tmdbId: number, mediaType: string, note: string) => void;
}

export function ListRankedItemCard({
	item,
	position,
	onRemove,
	onUpdateNote,
}: ListRankedItemCardProps) {
	const id = `${item.tmdbId}-${item.mediaType}`;
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const year = item.releaseDate
		? new Date(item.releaseDate).getFullYear()
		: null;

	return (
		<div className="relative border rounded-md" ref={setNodeRef} style={style}>
			<Badge className="absolute top-2 left-2 z-10" variant="secondary">
				{position}
			</Badge>
			<div className="flex items-stretch gap-3 p-2">
				<div className="flex items-start gap-3 p-3 flex-1">
					<div className="h-22 w-15 shrink-0 rounded overflow-hidden bg-muted flex items-center justify-center">
						{item.posterPath ? (
							<img
								src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
								alt={item.title}
								className="h-full w-full object-cover"
							/>
						) : (
							<img
								src="https://images.unsplash.com/photo-1629208113515-4569380efcb7?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
								alt={item.title}
								className="h-full w-full object-cover"
							/>
						)}
					</div>

					<div className="flex-1 space-y-2 min-w-0">
						<div className="flex items-center justify-between gap-2">
							<div className="min-w-0">
								<p className="font-medium line-clamp-1" title={item.title}>
									{item.title}
								</p>
								{year ? (
									<p className="text-sm text-muted-foreground">{year}</p>
								) : null}
							</div>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onRemove(item.tmdbId, item.mediaType)}
								className="shrink-0"
							>
								<IconX className="h-4 w-4" />
							</Button>
						</div>

						<Input
							placeholder={m.added_item_note_placeholder()}
							value={item.note || ""}
							onChange={(e) =>
								onUpdateNote(item.tmdbId, item.mediaType, e.target.value)
							}
							maxLength={500}
						/>
					</div>
				</div>

				<button
					type="button"
					className="flex items-center justify-center px-3 border-l cursor-grab active:cursor-grabbing"
					{...attributes}
					{...listeners}
				>
					<IconGripVertical className="h-5 w-5 text-muted-foreground" />
				</button>
			</div>
		</div>
	);
}
