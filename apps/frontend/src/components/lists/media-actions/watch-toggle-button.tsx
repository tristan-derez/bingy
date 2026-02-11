import { IconEye, IconEyeFilled, IconEyeOff } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface WatchToggleButtonProps {
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
	color?: string;
}

export function WatchToggleButton({
	movie,
	tvShow,
	username,
	color = "foreground",
}: WatchToggleButtonProps) {
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

	const handleToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

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
		<Tooltip>
			<TooltipTrigger
				render={
					<button
						type="button"
						onClick={handleToggle}
						disabled={isPending}
						className={`group flex flex-col items-center gap-1 transition-colors hover:cursor-pointer ${
							isWatched ? "text-green-500" : `text-${color}`
						}`}
					>
						{isWatched ? (
							<>
								<IconEyeFilled className="size-8 group-hover:hidden" />
								<IconEyeOff className="size-8 hidden group-hover:block" />
							</>
						) : (
							<IconEye className="size-8" />
						)}
					</button>
				}
			></TooltipTrigger>
			<TooltipContent>
				{isWatched ? m.watch_toggle_remove() : m.watch_toggle_add()}
			</TooltipContent>
		</Tooltip>
	);
}
