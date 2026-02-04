import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
	useMovieRating,
	useRemoveMovieRating,
	useRemoveTvRating,
	useTvRating,
} from "@/hooks/useRating";
import { m } from "@/paraglide/messages";

interface RemoveRatingDropdownItemProps {
	movie?: {
		id: number;
	};
	tvShow?: {
		id: number;
	};
	username: string;
}

export function RemoveRatingDropdownItem({
	movie,
	tvShow,
	username,
}: RemoveRatingDropdownItemProps) {
	const removeMovieRating = useRemoveMovieRating();
	const removeTvRating = useRemoveTvRating();

	const mediaType = movie ? "movie" : "tv";
	const mediaId = movie?.id ?? tvShow?.id;

	const { data: movieRating, isLoading: isLoadingMovie } = useMovieRating(
		username,
		movie?.id ?? 0,
	);
	const { data: tvRating, isLoading: isLoadingTv } = useTvRating(
		username,
		tvShow?.id ?? 0,
	);

	const hasRating = movie ? !!movieRating?.rating : !!tvRating?.rating;
	const isLoading = isLoadingMovie || isLoadingTv;

	if (!mediaId || !hasRating) {
		return null;
	}

	const handleRemoveRating = () => {
		if (mediaType === "movie") {
			removeMovieRating.mutate(mediaId);
		} else {
			removeTvRating.mutate(mediaId);
		}
	};

	const isPending =
		removeMovieRating.isPending || removeTvRating.isPending || isLoading;

	return (
		<DropdownMenuItem onSelect={handleRemoveRating} disabled={isPending}>
			{m.list_dropdown_item_remove_rating()}
		</DropdownMenuItem>
	);
}
