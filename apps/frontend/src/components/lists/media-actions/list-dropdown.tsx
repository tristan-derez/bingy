import { IconDots } from "@tabler/icons-react";
import { useRouteContext } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AddToHistoryItem } from "@/components/lists/history/add-to-history-item";
import { RemoveFromHistoryItem } from "@/components/lists/history/remove-from-history-item";
import { AddToListDialog } from "@/components/lists/media-actions/add-to-list-dialog";
import { LogReviewDialog } from "@/components/lists/media-actions/log-review-dialog";
import { RemoveHistoryAlertDialog } from "@/components/lists/media-actions/remove-history-alert-dialog";
import { RemoveRatingDropdownItem } from "@/components/lists/media-actions/remove-rating-dropdown-item";
import { StarRating } from "@/components/lists/media-actions/star-rating";
import { AddToWatchlistItem } from "@/components/lists/watchlist/add-to-watchlist-item";
import { RemoveFromWatchlistItem } from "@/components/lists/watchlist/remove-from-watchlist-item";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveMovieHistory, useRemoveTvHistory } from "@/hooks/useHistory";
import {
	useMovieRating,
	useRateMovie,
	useRateTvShow,
	useTvRating,
} from "@/hooks/useRating";
import { useTv } from "@/hooks/useTv";
import { m } from "@/paraglide/messages";
import { getTvShowProgress } from "@/utils/season-helper";

interface ListDropdownProps {
	movie?: {
		mediaType?: string;
		id: number;
		title: string;
		posterPath: string | null;
		releaseDate: string;
	};
	tvShow?: {
		mediaType?: string;
		id: number;
		name: string;
		posterPath: string | null;
		releaseDate: string;
	};
	imageUrl: string | null;
}

export function ListDropdown({ movie, tvShow, imageUrl }: ListDropdownProps) {
	const { authData } = useRouteContext({ from: "__root__" });
	if (!authData) return null;
	const username = authData.user.name;
	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);

	const { data: tvDetails } = useTv(tmdbId, {}, { enabled: isTvShow });

	const tvProgress = useMemo(() => getTvShowProgress(tvDetails), [tvDetails]);

	const { data: movieRating } = useMovieRating(username, tmdbId);
	const { data: tvRating } = useTvRating(username, tmdbId);

	const rateMovieMutation = useRateMovie(username);
	const rateTvMutation = useRateTvShow(username);
	const removeMovieHistory = useRemoveMovieHistory();
	const removeTvHistory = useRemoveTvHistory();

	const [showLogReviewDialog, setShowLogReviewDialog] = useState(false);
	const [showAddToListDialog, setShowAddToListDialog] = useState(false);
	const [showRemoveHistoryDialog, setShowRemoveHistoryDialog] = useState(false);

	if (!authData) return null;

	const existingRating = isTvShow ? tvRating : movieRating;

	const handleRatingChange = (newRating: number) => {
		if (!isTvShow) {
			return rateMovieMutation.mutate({
				tmdbId,
				rating: newRating,
				review: null,
				watchedAt: new Date(),
			});
		}

		if (!tvProgress?.lastAired) return;

		rateTvMutation.mutate({
			tmdbId,
			rating: newRating,
			review: null,
			lastWatchedSeason: tvProgress.lastAired.seasonNumber,
			lastWatchedEpisode: tvProgress.lastAired.episodeNumber,
			absoluteEpisode: null,
			trackingMode: "season",
			watchedAt: new Date(),
		});
	};

	const handleConfirmRemoveHistory = () => {
		if (movie) {
			removeMovieHistory.mutate(movie.id);
		} else if (tvShow) {
			removeTvHistory.mutate(tvShow.id);
		}
		setShowRemoveHistoryDialog(false);
	};

	const title = movie?.title ?? tvShow?.name ?? "";

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					className="p-1 hover:bg-white/10 rounded"
					onClick={(e) => e.preventDefault()}
				>
					<IconDots className="w-5 h-5 text-white" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-50">
					<div className="px-2 flex justify-center">
						<StarRating
							movie={movie}
							tvShow={tvShow}
							fetchRating={true}
							onRatingChange={handleRatingChange}
							username={username}
							gapSize={3}
						/>
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setShowLogReviewDialog(true)}>
						{existingRating
							? m.list_dropdown_editreview()
							: m.list_dropdown_logreview()}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setShowAddToListDialog(true)}>
						{m.list_dropdown_item_add_to_list()}
					</DropdownMenuItem>
					<AddToWatchlistItem
						movie={movie}
						tvShow={tvShow}
						username={username}
					/>
					<AddToHistoryItem movie={movie} tvShow={tvShow} username={username} />

					<DropdownMenuSeparator />
					<RemoveFromWatchlistItem
						movie={movie}
						tvShow={tvShow}
						username={username}
					/>
					<RemoveRatingDropdownItem
						movie={movie}
						tvShow={tvShow}
						username={username}
					/>
					<RemoveFromHistoryItem
						movie={movie}
						tvShow={tvShow}
						username={username}
						onRequestRemove={() => setShowRemoveHistoryDialog(true)}
					/>
				</DropdownMenuContent>
			</DropdownMenu>

			<LogReviewDialog
				username={username}
				open={showLogReviewDialog}
				onOpenChange={setShowLogReviewDialog}
				movie={movie}
				tvShow={tvShow}
				imageUrl={imageUrl}
				existingData={existingRating}
			/>
			<AddToListDialog
				open={showAddToListDialog}
				onOpenChange={setShowAddToListDialog}
				movie={movie}
				tvShow={tvShow}
				username={username}
			/>
			<RemoveHistoryAlertDialog
				open={showRemoveHistoryDialog}
				onOpenChange={setShowRemoveHistoryDialog}
				mediaName={title}
				onConfirm={handleConfirmRemoveHistory}
			/>
		</>
	);
}
