import { IconClock, IconClockOff, IconClockPlus } from "@tabler/icons-react";
import { useRouteContext } from "@tanstack/react-router";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	useAddMediaToWatchlist,
	useIsInWatchlist,
	useRemoveFromWatchlist,
} from "@/hooks/useLists";
import { m } from "@/paraglide/messages";

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
	size?: number;
	username: string;
}

export function WatchlistToggleButton({
	movie,
	tvShow,
	color = "foreground",
	size = 8,
	username,
}: WatchlistToggleButtonProps) {
	const { authData } = useRouteContext({ from: "__root__" });

	const addToWatchlist = useAddMediaToWatchlist(username);
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

	if (!authData) {
		return <span className="invisible" aria-hidden="true" />;
	}

	const isPending =
		addToWatchlist.isPending || removeFromWatchlist.isPending || isLoading;

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<button
						type="button"
						onClick={handleWatchlistToggle}
						disabled={isPending}
						className={`group flex flex-col items-center gap-1 transition-colors hover:cursor-pointer ${
							isInWatchlist ? "text-blue-500" : `text-${color}`
						}`}
					>
						{isInWatchlist ? (
							<>
								<IconClock className={`size-${size} group-hover:hidden`} />
								<IconClockOff
									className={`size-${size} hidden group-hover:block`}
								/>
							</>
						) : (
							<IconClockPlus className={`size-${size}`} />
						)}
					</button>
				}
			></TooltipTrigger>
			<TooltipContent align="center">
				<p>
					{isInWatchlist
						? m.remove_watchlist_media_tooltip()
						: m.add_watchlist_media_tooltip()}
				</p>
			</TooltipContent>
		</Tooltip>
	);
}
