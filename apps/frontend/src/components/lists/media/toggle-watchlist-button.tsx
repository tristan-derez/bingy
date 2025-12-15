import { ClockPlus } from "lucide-react";
import { TbClockMinus } from "react-icons/tb";
import type { Schemas } from "shared";
import { Button } from "@/components/ui/button";
import {
	useAddMediaToWatchlist,
	useRemoveFromWatchlist,
	useWatchlist,
} from "@/hooks/useLists";
import { m } from "@/paraglide/messages";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface ToggleWatchlistButtonProps {
	movie?: Schemas.MovieDetails;
	tvShow?: Schemas.TvDetails;
}

type WatchlistItem = {
	userId: string;
	mediaTmdbId: number;
	mediaType: string;
	addedAt: string;
};

export function ToggleWatchlistButton({
	movie,
	tvShow,
}: ToggleWatchlistButtonProps) {
	const { data: watchlistData } = useWatchlist();
	const addToWatchlist = useAddMediaToWatchlist();
	const removeFromWatchlist = useRemoveFromWatchlist();

	const mediaType = movie ? "movie" : "tv";
	const mediaId = movie?.id ?? tvShow?.id;
	const mediaTitle = movie?.title ?? tvShow?.name;

	if (!mediaId || !mediaTitle) {
		return null;
	}

	const watchlist = (watchlistData as WatchlistItem[] | undefined) ?? [];
	const isInWatchlist = watchlist.some(
		(item) => item.mediaTmdbId === mediaId && item.mediaType === mediaType,
	);

	const handleToggleWatchlist = () => {
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
					onClick={handleToggleWatchlist}
					disabled={isPending}
					className="hover:cursor-pointer font-bold hover:bg-none"
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
