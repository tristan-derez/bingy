import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRemoveMovieHistory, useRemoveTvHistory } from "@/hooks/useHistory";
import { useMovieRating, useTvRating } from "@/hooks/useRating";
import { m } from "@/paraglide/messages";

interface RemoveFromHistoryItemProps {
	movie?: {
		id: number;
		title: string;
	};
	tvShow?: {
		id: number;
		name: string;
	};
	username: string;
	onRequestRemove: () => void;
}

export function RemoveFromHistoryItem({
	movie,
	tvShow,
	username,
	onRequestRemove,
}: RemoveFromHistoryItemProps) {
	const removeMovieHistory = useRemoveMovieHistory();
	const removeTvHistory = useRemoveTvHistory();

	const movieRating = useMovieRating(username, movie?.id ?? 0);
	const tvRating = useTvRating(username, tvShow?.id ?? 0);

	const currentData = movie ? movieRating.data : tvRating.data;
	const hasRating = movie
		? !!movieRating.data?.rating
		: !!tvRating.data?.rating;
	const isWatched = !!currentData;

	if (!movie?.id && !tvShow?.id) return null;

	const handleRemoveFromHistory = (e: React.SyntheticEvent) => {
		if (hasRating) {
			e.preventDefault();
			onRequestRemove();
		} else {
			if (movie) {
				removeMovieHistory.mutate(movie.id);
			} else if (tvShow) {
				removeTvHistory.mutate(tvShow.id);
			}
		}
	};

	const isPending = removeMovieHistory.isPending || removeTvHistory.isPending;

	if (!isWatched) return null;

	return (
		<DropdownMenuItem
			onClick={handleRemoveFromHistory}
			disabled={isPending}
			variant="destructive"
		>
			{m.list_dropdown_item_remove_history()}
		</DropdownMenuItem>
	);
}
