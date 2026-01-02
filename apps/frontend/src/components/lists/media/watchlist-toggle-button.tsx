import { IconClockMinus, IconClockPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	useAddMediaToWatchlist,
	useIsInWatchlist,
	useRemoveFromWatchlist,
} from "@/hooks/useLists";
import { m } from "@/paraglide/messages";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface WatchlistToggleButtonProps {
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

	const { data: isInWatchlist, isLoading } = useIsInWatchlist(
		mediaType,
		mediaId ?? 0,
	);

	if (!mediaId || !mediaTitle) {
		return null;
	}

	const handleWatchlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();

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

	const isPending =
		addToWatchlist.isPending || removeFromWatchlist.isPending || isLoading;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					onClick={handleWatchlistToggle}
					disabled={isPending}
					className={`hover:cursor-pointer hover:text-${color} hover:bg-none font-bold text-${color}`}
				>
					{isInWatchlist ? <IconClockMinus /> : <IconClockPlus />}
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
