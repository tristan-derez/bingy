import { IconX } from "@tabler/icons-react";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ListDraftItem } from "@/lib/atoms/draft-list";
import { m } from "@/paraglide/messages";

interface ListAddedItemMediaCardProps {
	item: ListDraftItem;
	onRemove: (tmdbId: number, mediaType: string) => void;
	onUpdateNote: (tmdbId: number, mediaType: string, note: string) => void;
}

export function ListAddedItemMediaCard({
	item,
	onRemove,
	onUpdateNote,
}: ListAddedItemMediaCardProps) {
	const year = item.releaseDate
		? new Date(item.releaseDate).getFullYear()
		: null;

	return (
		<div className="flex items-start gap-3 rounded-md border p-3 w-full">
			<div className="h-22 w-15 shrink-0 rounded overflow-hidden bg-muted flex items-center justify-center">
				{item.posterPath ? (
					<img
						src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
						alt={item.title}
						className="h-full w-full object-cover"
					/>
				) : (
					<img src={fallbackPoster} className="h-full w-full object-cover" />
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
	);
}
