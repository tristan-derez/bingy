import { IconEye, IconEyeFilled, IconEyeOff } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
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
import { getTvShowProgress } from "@/utils/season-helper";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { RemoveHistoryAlertDialog } from "./remove-history-alert-dialog";

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
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const localeRegion = useAtomValue(localeRegionAtom);
	const addMovieToHistory = useAddMovieToHistory(username);
	const addTvToHistory = useAddTvToHistory(username);
	const removeMovieHistory = useRemoveMovieHistory();
	const removeTvHistory = useRemoveTvHistory();

	const { data: tvDetails } = useTv(
		tvShow?.id ?? 0,
		{ language: localeRegion },
		{ enabled: !!tvShow?.id },
	);

	const tvProgress = useMemo(() => getTvShowProgress(tvDetails), [tvDetails]);

	const movieRating = useMovieRating(username, movie?.id ?? 0);
	const tvRating = useTvRating(username, tvShow?.id ?? 0);

	const currentData = movie ? movieRating.data : tvRating.data;
	const hasRating = movie
		? !!movieRating.data?.rating
		: !!tvRating.data?.rating;
	const isWatched = !!currentData;

	if (!movie?.id && !tvShow?.id) return null;

	const handleToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		if (isWatched && hasRating) {
			setIsDialogOpen(true);
		} else if (isWatched) {
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
					rating: null,
					review: null,
					watchedAt: date,
				});
			} else if (tvShow && tvProgress?.lastAired) {
				const { lastAired } = tvProgress;
				addTvToHistory.mutate({
					tmdbId: tvShow.id,
					rating: null,
					review: null,
					lastWatchedSeason: lastAired.seasonNumber,
					lastWatchedEpisode: lastAired.episodeNumber,
					absoluteEpisode: null,
					trackingMode: "season",
					watchedAt: date,
				});
			}
		}
	};

	const handleConfirmRemove = () => {
		if (movie) {
			removeMovieHistory.mutate(movie.id);
		} else if (tvShow) {
			removeTvHistory.mutate(tvShow.id);
		}
		setIsDialogOpen(false);
	};

	const isPending =
		addMovieToHistory.isPending ||
		addTvToHistory.isPending ||
		removeMovieHistory.isPending ||
		removeTvHistory.isPending;

	const title = movie?.title ?? tvShow?.name ?? "";

	return (
		<>
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
				/>
				<TooltipContent>
					{isWatched ? m.watch_toggle_remove() : m.watch_toggle_add()}
				</TooltipContent>
			</Tooltip>

			<RemoveHistoryAlertDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				mediaName={title}
				onConfirm={handleConfirmRemove}
			/>
		</>
	);
}
