import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAddMediaToWatchlist, useIsInWatchlist } from "@/hooks/useLists";
import { m } from "@/paraglide/messages";

interface AddToWatchlistItemProps {
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
}

export function AddToWatchlistItem({ movie, tvShow }: AddToWatchlistItemProps) {
	const addToWatchlist = useAddMediaToWatchlist();

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

	const handleAddToWatchlist = () => {
		addToWatchlist.mutate({
			tmdbId: mediaId,
			mediaType,
			...(movie ? { title: movie.title } : { name: tvShow?.name }),
		});
	};

	const isPending = addToWatchlist.isPending || isLoading;

	if (isInWatchlist) return null;

	return (
		<DropdownMenuItem onClick={handleAddToWatchlist} disabled={isPending}>
			{m.list_dropdown_item_add_watchlist()}
		</DropdownMenuItem>
	);
}
