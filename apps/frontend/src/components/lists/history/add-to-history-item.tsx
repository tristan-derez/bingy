import { useAtomValue } from "jotai";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAddMovieToHistory, useAddTvToHistory } from "@/hooks/useHistory";
import { useMovieRating, useTvRating } from "@/hooks/useRating";
import { useTv } from "@/hooks/useTv";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { getLastAiredEpisodeInfo } from "@/utils/season-helper";

interface AddToHistoryItemProps {
	movie?: {
		id: number;
		title: string;
	};
	tvShow?: {
		id: number;
		name: string;
	};
	username: string;
}

export function AddToHistoryItem({
	movie,
	tvShow,
	username,
}: AddToHistoryItemProps) {
	const localeRegion = useAtomValue(localeRegionAtom);
	const addMovieToHistory = useAddMovieToHistory();
	const addTvToHistory = useAddTvToHistory();

	const { data: tvDetails } = useTv(
		tvShow?.id ?? 0,
		{ language: localeRegion },
		{ enabled: !!tvShow?.id },
	);

	const movieRating = useMovieRating(username, movie?.id ?? 0);
	const tvRating = useTvRating(username, tvShow?.id ?? 0);

	const currentData = movie ? movieRating.data : tvRating.data;
	const isWatched = !!currentData;

	if (!movie?.id && !tvShow?.id) return null;

	const handleAddToHistory = () => {
		const date = new Date();

		if (movie) {
			addMovieToHistory.mutate({
				tmdbId: movie.id,
				watchedAt: date,
				rating: null,
				review: null,
			});
		} else if (tvShow) {
			const episodeInfo = getLastAiredEpisodeInfo(tvDetails);
			if (!episodeInfo) return;

			addTvToHistory.mutate({
				tmdbId: tvShow.id,
				lastWatchedSeason: episodeInfo.seasonNumber ?? null,
				lastWatchedEpisode: episodeInfo.episodeNumber ?? null,
				absoluteEpisode: null,
				trackingMode: "season",
				rating: null,
				review: null,
				watchedAt: date,
			});
		}
	};

	const isPending = addMovieToHistory.isPending || addTvToHistory.isPending;

	if (isWatched) return null;

	return (
		<DropdownMenuItem onClick={handleAddToHistory} disabled={isPending}>
			{m.list_dropdown_item_mark_as_seen()}
		</DropdownMenuItem>
	);
}
