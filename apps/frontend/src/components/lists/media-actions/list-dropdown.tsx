import { IconDots } from "@tabler/icons-react";
import { useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
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
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { getLastAiredEpisodeInfo } from "@/utils/season-helper";
import { WatchlistDropdownItem } from "../watchlist/watchlist-dropdown-item";
import { HistoryToggleDropdownItem } from "./history-toggle-dropdown-item";
import { LogReviewDialog } from "./log-review-dialog";
import { RemoveRatingDropdownItem } from "./remove-rating-dropdown-item";
import { StarRating } from "./star-rating";

interface ListDropdownProps {
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
	imageUrl?: string;
}

export function ListDropdown({ movie, tvShow, imageUrl }: ListDropdownProps) {
	const { session } = useRouteContext({ from: "__root__" });
	const localeRegion = useAtomValue(localeRegionAtom);

	if (!session) {
		return null;
	}

	const username = session.user.name;
	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);

	const { data: tvDetails } = useTv(
		tmdbId,
		{
			language: localeRegion,
		},
		{
			enabled: isTvShow,
		},
	);

	const { data: movieRating } = useMovieRating(username, tmdbId);
	const { data: tvRating } = useTvRating(username, tmdbId);

	const rateMovieMutation = useRateMovie();
	const rateTvMutation = useRateTvShow();

	const [showLogReviewDialog, setShowLogReviewDialog] = useState(false);

	const existingRating = isTvShow ? tvRating : movieRating;
	const rating = existingRating?.rating ?? 0;

	const handleRatingChange = (newRating: number) => {
		if (isTvShow) {
			const episodeInfo = getLastAiredEpisodeInfo(tvDetails);
			if (episodeInfo) {
				rateTvMutation.mutate({
					tmdbId,
					rating: newRating,
					lastWatchedSeason: episodeInfo.seasonNumber,
					lastWatchedEpisode: episodeInfo.episodeNumber,
					trackingMode: "season",
					watchedAt: new Date(),
				});
			}
		} else {
			rateMovieMutation.mutate({
				tmdbId,
				rating: newRating,
				watchedAt: new Date(),
			});
		}
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
				<DropdownMenuContent align="center">
					<div className="px-2 flex justify-center">
						<StarRating
							movie={movie}
							tvShow={tvShow}
							fetchRating={true}
							onRatingChange={handleRatingChange}
							username={username}
						/>
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => setShowLogReviewDialog(true)}>
						{existingRating
							? m.list_dropdown_editreview()
							: m.list_dropdown_logreview()}
					</DropdownMenuItem>
					<WatchlistDropdownItem movie={movie} tvShow={tvShow} />
					<RemoveRatingDropdownItem
						movie={movie}
						tvShow={tvShow}
						username={username}
					/>
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
				initialRating={rating}
				imageUrl={imageUrl}
				existingData={existingRating}
			/>
		</>
	);
}
