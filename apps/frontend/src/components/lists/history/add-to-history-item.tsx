import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAddMovieToHistory, useAddTvToHistory } from "@/hooks/useHistory";
import { useMovieRating, useTvRating } from "@/hooks/useRating";
import { useTv } from "@/hooks/useTv";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { getTvShowProgress } from "@/utils/season-helper";

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

	const tvProgress = useMemo(() => getTvShowProgress(tvDetails), [tvDetails]);

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
		} else if (tvShow && tvProgress?.lastAired) {
			const { lastAired } = tvProgress;
			addTvToHistory.mutate({
				tmdbId: tvShow.id,
				lastWatchedSeason: lastAired.seasonNumber,
				lastWatchedEpisode: lastAired.episodeNumber,
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
