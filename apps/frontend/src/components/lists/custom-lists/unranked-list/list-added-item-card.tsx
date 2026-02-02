import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { m } from "@/paraglide/messages";

interface ListAddedItemMediaCardProps {
	tmdbId: number;
	mediaType: string;
	posterPath: string | null;
	title: string;
	releaseDate?: string;
	note?: string | null;
	onRemove: (tmdbId: number, mediaType: string) => void;
	onUpdateNote: (tmdbId: number, mediaType: string, note: string) => void;
}

export function ListAddedItemMediaCard({
	tmdbId,
	mediaType,
	posterPath,
	title,
	releaseDate,
	note,
	onRemove,
	onUpdateNote,
}: ListAddedItemMediaCardProps) {
	const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

	return (
		<div className="flex items-start gap-3 rounded-md border p-3 w-full">
			<div className="h-22 w-15 shrink-0 rounded overflow-hidden bg-muted flex items-center justify-center">
				{posterPath ? (
					<img
						src={`https://image.tmdb.org/t/p/w92${posterPath}`}
						alt={title}
						className="h-full w-full object-cover"
					/>
				) : (
					<img
						// @todo: add a real placeholder image here
						src="https://images.unsplash.com/photo-1629208113515-4569380efcb7?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						className="h-full w-full object-cover"
					/>
				)}
			</div>

			<div className="flex-1 space-y-2 min-w-0">
				<div className="flex items-center justify-between gap-2">
					<div className="min-w-0">
						<p className="font-medium line-clamp-1" title={title}>
							{title}
						</p>
						{year ? (
							<p className="text-sm text-muted-foreground">{year}</p>
						) : null}
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onRemove(tmdbId, mediaType)}
						className="shrink-0"
					>
						<IconX className="h-4 w-4" />
					</Button>
				</div>

				<Input
					placeholder={m.added_item_note_placeholder()}
					value={note || ""}
					onChange={(e) => onUpdateNote(tmdbId, mediaType, e.target.value)}
					maxLength={500}
				/>
			</div>
		</div>
	);
}
