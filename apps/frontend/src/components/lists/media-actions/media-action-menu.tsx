import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	useMovieRating,
	useRateMovie,
	useRateTvShow,
	useTvRating,
} from "@/hooks/useRating";
import { useTv } from "@/hooks/useTv";
import { m } from "@/paraglide/messages";
import { getTvShowProgress } from "@/utils/season-helper";
import { getTmdbImageUrl } from "@/utils/utils";
import { WatchlistToggleButton } from "../watchlist/watchlist-toggle-button";
import { AddToListButton } from "./action-bar/add-to-list-button";
import { LogReviewButton } from "./action-bar/log-review-button";
import { ShareButton } from "./action-bar/share-button";
import { AddToListDialog } from "./add-to-list-dialog";
import { FavoriteToggleButton } from "./favorite-toggle-button";
import { LogReviewDialog } from "./log-review-dialog";
import { StarRating } from "./star-rating";
import { WatchToggleButton } from "./watch-toggle-button";

interface MediaActionMenuProps {
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
	username: string;
	posterPath: string | null;
	currentUrl: string;
}

export const MediaActionMenu = ({
	movie,
	tvShow,
	username,
	posterPath,
	currentUrl,
}: MediaActionMenuProps) => {
	const passProps = { movie, tvShow, username };
	const imageUrl = getTmdbImageUrl(posterPath, "w500");

	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);

	const { data: tvDetails } = useTv(tmdbId, {}, { enabled: isTvShow });

	const tvProgress = useMemo(() => getTvShowProgress(tvDetails), [tvDetails]);

	const { data: movieRating } = useMovieRating(username, tmdbId);
	const { data: tvRating } = useTvRating(username, tmdbId);

	const rateMovieMutation = useRateMovie(username);
	const rateTvMutation = useRateTvShow(username);

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

	const [showAddToListDialog, setShowAddToListDialog] = useState(false);
	const [showLogReviewDialog, setShowLogReviewDialog] = useState(false);

	const existingRating = isTvShow ? tvRating : movieRating;

	const title = movie?.title ?? tvShow?.name ?? "";
	const year = movie?.releaseDate
		? new Date(movie.releaseDate).getFullYear()
		: tvShow?.releaseDate
			? new Date(tvShow.releaseDate).getFullYear()
			: "N/A";

	return (
		<>
			<Card className="min-w-3xs">
				<CardHeader className="flex flex-col w-full gap-4">
					<div className="flex w-full flex-row justify-around items-center gap-4">
						<WatchToggleButton {...passProps} />
						<FavoriteToggleButton {...passProps} />
						<WatchlistToggleButton {...passProps} />
					</div>
					<Separator />
					<div className="flex w-full justify-center">
						<StarRating
							movie={movie}
							tvShow={tvShow}
							fetchRating={true}
							onRatingChange={handleRatingChange}
							username={username}
							gapSize={2}
							iconSize={8}
						/>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<LogReviewButton
						existingRating={!!existingRating}
						onClick={() => setShowLogReviewDialog(true)}
					/>
					<AddToListButton onClick={() => setShowAddToListDialog(true)} />
					<ShareButton
						url={currentUrl}
						text={m.btn_share_link_media_text({
							media_name: title,
							year: year,
						})}
					/>
				</CardContent>
			</Card>

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
};
