import { ClockPlus } from "lucide-react";
import { TbClockMinus } from "react-icons/tb";
import type { Schemas } from "shared";
import { Button } from "@/components/ui/button";
import {
	useAddMediaToWatchlist,
	useIsInWatchlist,
	useRemoveFromWatchlist,
} from "@/hooks/useLists";
import { m } from "@/paraglide/messages";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface WatchlistToggleButtonProps {
	movie?: Schemas.MovieDetails;
	tvShow?: Schemas.TvDetails;
	color?: string;
}

export function WatchlistToggleButton({
	movie,
	tvShow,
	color = "foreground",
}: WatchlistToggleButtonProps) {
	const addToWatchlist = useAddMediaToWatchlist();
	const removeFromWatchlist = useRemoveFromWatchlist();

	const mediaType = movie ? "movie" : "tv";
	const mediaId = movie?.id ?? tvShow?.id;
	const mediaTitle = movie?.title ?? tvShow?.name;

	const isInWatchlist = useIsInWatchlist(mediaId ?? 0);

	if (!mediaId || !mediaTitle) {
		return null;
	}

	const handleWatchlistToggle = () => {
		if (isInWatchlist) {
			removeFromWatchlist.mutate({
				tmdbId: mediaId,
				mediaType,
				...(movie ? { title: movie.title } : { name: tvShow?.name }),
			});
		} else {
			addToWatchlist.mutate({
				tmdbId: mediaId,
				mediaType,
				...(movie ? { title: movie.title } : { name: tvShow?.name }),
			});
		}
	};

	const isPending = addToWatchlist.isPending || removeFromWatchlist.isPending;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleWatchlistToggle}
					disabled={isPending}
					className={`hover:cursor-pointer hover:text-${color} hover:bg-none font-bold text-${color}`}
				>
					{isInWatchlist ? (
						<TbClockMinus className="h-5 w-5" />
					) : (
						<ClockPlus className="h-5 w-5" />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent align="center">
				<p>
					{isInWatchlist
						? m.remove_watchlist_media_tooltip({ media: `"${mediaTitle}"` })
						: m.add_watchlist_media_tooltip({ media: `"${mediaTitle}"` })}
				</p>
			</TooltipContent>
		</Tooltip>
	);
}
