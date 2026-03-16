import { IconDots } from "@tabler/icons-react";
import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
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
import { getLastAiredEpisodeInfo } from "@/utils/season-helper";
import { AddToHistoryItem } from "../history/add-to-history-item";
import { RemoveFromHistoryItem } from "../history/remove-from-history-item";
import { AddToWatchlistItem } from "../watchlist/add-to-watchlist-item";
import { RemoveFromWatchlistItem } from "../watchlist/remove-from-watchlist-item";
import { AddToListDialog } from "./add-to-list-dialog";
import { LogReviewDialog } from "./log-review-dialog";
import { RemoveHistoryAlertDialog } from "./remove-history-alert-dialog";
import { RemoveRatingDropdownItem } from "./remove-rating-dropdown-item";
import { StarRating } from "./star-rating";

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
	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);

	const { data: tvDetails } = useTv(
		tmdbId,
		{},
		{
			enabled: isTvShow,
		},
	);

	const { data: movieRating } = useMovieRating(
		authData?.user.name ?? "",
		tmdbId,
	);
	const { data: tvRating } = useTvRating(authData?.user.name ?? "", tmdbId);

	const rateMovieMutation = useRateMovie();
	const rateTvMutation = useRateTvShow();
	const removeMovieHistory = useRemoveMovieHistory();
	const removeTvHistory = useRemoveTvHistory();

	const [showLogReviewDialog, setShowLogReviewDialog] = useState(false);
	const [showAddToListDialog, setShowAddToListDialog] = useState(false);
	const [showRemoveHistoryDialog, setShowRemoveHistoryDialog] = useState(false);

	if (!authData) return null;

	const username = authData.user.name;
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

		const episodeInfo = getLastAiredEpisodeInfo(tvDetails);
		if (!episodeInfo) return;

		rateTvMutation.mutate({
			tmdbId,
			rating: newRating,
			review: null,
			lastWatchedSeason: episodeInfo.seasonNumber,
			lastWatchedEpisode: episodeInfo.episodeNumber,
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
					<DropdownMenuItem
						onClick={() => {
							setShowAddToListDialog(true);
						}}
					>
						{m.list_dropdown_item_add_to_list()}
					</DropdownMenuItem>
					<AddToWatchlistItem movie={movie} tvShow={tvShow} />
					<AddToHistoryItem movie={movie} tvShow={tvShow} username={username} />

					{/* items below will only be shown if item is in their category
						eg: if a tv show is in watchlist, remove from watchlist will be shown
					*/}
					<DropdownMenuSeparator />
					<RemoveFromWatchlistItem movie={movie} tvShow={tvShow} />
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
