import { useAtomValue } from "jotai";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
	useAddMovieToHistory,
	useAddTvToHistory,
	useRemoveMovieHistory,
	useRemoveTvHistory,
} from "@/hooks/useHistory";
import { useMovieRating, useTvRating } from "@/hooks/useRating";
import { useTv } from "@/hooks/useTv";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { getLastAiredEpisodeInfo } from "@/utils/season-helper";

interface HistoryToggleDropdownItemProps {
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

export function HistoryToggleDropdownItem({
	movie,
	tvShow,
	username,
}: HistoryToggleDropdownItemProps) {
	const localeRegion = useAtomValue(localeRegionAtom);
	const addMovieToHistory = useAddMovieToHistory();
	const addTvToHistory = useAddTvToHistory();
	const removeMovieHistory = useRemoveMovieHistory();
	const removeTvHistory = useRemoveTvHistory();

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

	const handleHistoryToggle = () => {
		if (isWatched) {
			if (movie) {
				removeMovieHistory.mutate(movie.id);
			} else if (tvShow) {
				removeTvHistory.mutate(tvShow.id);
			}
		} else {
			const date = new Date();

			if (movie) {
				addMovieToHistory.mutate({
					tmdbId: movie.id,
					watchedAt: date,
				});
			} else if (tvShow) {
				const episodeInfo = getLastAiredEpisodeInfo(tvDetails);
				addTvToHistory.mutate({
					tmdbId: tvShow.id,
					lastWatchedSeason: episodeInfo?.seasonNumber,
					lastWatchedEpisode: episodeInfo?.episodeNumber,
					trackingMode: "season",
					watchedAt: date,
				});
			}
		}
	};

	const isPending =
		addMovieToHistory.isPending ||
		addTvToHistory.isPending ||
		removeMovieHistory.isPending ||
		removeTvHistory.isPending;

	return (
		<DropdownMenuItem onSelect={handleHistoryToggle} disabled={isPending}>
			{isWatched
				? m.list_dropdown_item_remove_history()
				: m.list_dropdown_item_mark_as_seen()}
		</DropdownMenuItem>
	);
}
