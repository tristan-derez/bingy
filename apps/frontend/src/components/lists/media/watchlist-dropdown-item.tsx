import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
	useAddMediaToWatchlist,
	useIsInWatchlist,
	useRemoveFromWatchlist,
} from "@/hooks/useLists";
import { m } from "@/paraglide/messages";

interface WatchlistDropdownItemProps {
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

export function WatchlistDropdownItem({
	movie,
	tvShow,
}: WatchlistDropdownItemProps) {
	const addToWatchlist = useAddMediaToWatchlist();
	const removeFromWatchlist = useRemoveFromWatchlist();

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

	const handleWatchlistToggle = () => {
		if (isInWatchlist) {
			removeFromWatchlist.mutate({
				tmdbId: mediaId,
				mediaType,
				...(movie ? { title: movie.title } : { name: tvShow?.name }),
			});
		} else {
			addToWatchlist.mutate({
				tmdbId: mediaId,
				mediaType,
				...(movie ? { title: movie.title } : { name: tvShow?.name }),
			});
		}
	};

	const isPending =
		addToWatchlist.isPending || removeFromWatchlist.isPending || isLoading;

	return (
		<DropdownMenuItem onSelect={handleWatchlistToggle} disabled={isPending}>
			{isInWatchlist
				? m.list_dropdown_item_remove_watchlist()
				: m.list_dropdown_item_add_watchlist()}
		</DropdownMenuItem>
	);
}
