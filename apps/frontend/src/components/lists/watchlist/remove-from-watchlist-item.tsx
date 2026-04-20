import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useIsInWatchlist, useRemoveFromWatchlist } from "@/hooks/useLists";
import { m } from "@/paraglide/messages";

interface RemoveFromWatchlistItemProps {
	movie?: {
		mediaType?: string;
		id: number;
		title: string;
	};
	tvShow?: {
		mediaType?: string;
		id: number;
		name: string;
	};
	username: string;
}

export function RemoveFromWatchlistItem({
	movie,
	tvShow,
	username,
}: RemoveFromWatchlistItemProps) {
	const removeFromWatchlist = useRemoveFromWatchlist(username);

	const mediaType = movie ? "movie" : "tv";
	const mediaId = movie?.id ?? tvShow?.id;
	const mediaTitle = movie?.title ?? tvShow?.name;

	const { data: isInWatchlist, isLoading } = useIsInWatchlist(
		mediaType,
		mediaId ?? 0,
	);

	if (!mediaId || !mediaTitle) {
		return null;
	}

	const handleRemoveFromWatchlist = () => {
		removeFromWatchlist.mutate({
			tmdbId: mediaId,
			mediaType,
			...(movie ? { title: movie.title } : { name: tvShow?.name }),
		});
	};

	const isPending = removeFromWatchlist.isPending || isLoading;

	if (!isInWatchlist) return null;

	return (
		<DropdownMenuItem
			onClick={handleRemoveFromWatchlist}
			disabled={isPending}
			variant="destructive"
		>
			{m.list_dropdown_item_remove_watchlist()}
		</DropdownMenuItem>
	);
}
