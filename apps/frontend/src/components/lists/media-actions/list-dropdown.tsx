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
import {
	useMovieRating,
	useRateMovie,
	useRateTvShow,
	useTvRating,
} from "@/hooks/useRating";
import { useTv } from "@/hooks/useTv";
import { m } from "@/paraglide/messages";
import { getLastAiredEpisodeInfo } from "@/utils/season-helper";
import { WatchlistDropdownItem } from "../watchlist/watchlist-dropdown-item";
import { AddToListDialog } from "./add-to-list-dialog";
import { HistoryToggleDropdownItem } from "./history-toggle-dropdown-item";
import { LogReviewDialog } from "./log-review-dialog";
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
	imageUrl?: string | null;
}

export function ListDropdown({ movie, tvShow, imageUrl }: ListDropdownProps) {
	const { session } = useRouteContext({ from: "__root__" });

	if (!session) {
		return null;
	}

	const username = session.user.name;
	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);

	const { data: tvDetails } = useTv(
		tmdbId,
		{},
		{
			enabled: isTvShow,
		},
	);

	const { data: movieRating } = useMovieRating(username, tmdbId);
	const { data: tvRating } = useTvRating(username, tmdbId);

	const rateMovieMutation = useRateMovie();
	const rateTvMutation = useRateTvShow();

	const [showLogReviewDialog, setShowLogReviewDialog] = useState(false);
	const [showAddToListDialog, setShowAddToListDialog] = useState(false);

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

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger
					className="p-1 hover:bg-white/10 rounded"
					onClick={(e) => e.preventDefault()}
				>
					<IconDots className="w-5 h-5 text-white" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
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
					<DropdownMenuItem onSelect={() => setShowLogReviewDialog(true)}>
						{existingRating
							? m.list_dropdown_editreview()
							: m.list_dropdown_logreview()}
					</DropdownMenuItem>
					<WatchlistDropdownItem movie={movie} tvShow={tvShow} />
					<DropdownMenuItem
						onSelect={(e) => {
							e.preventDefault();
							setShowAddToListDialog(true);
						}}
					>
						{m.list_dropdown_item_add_to_list()}
					</DropdownMenuItem>
					<RemoveRatingDropdownItem
						movie={movie}
						tvShow={tvShow}
						username={username}
					/>
					{/* will only be shown if media is is history */}
					<HistoryToggleDropdownItem
						movie={movie}
						tvShow={tvShow}
						username={username}
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
		</>
	);
}
