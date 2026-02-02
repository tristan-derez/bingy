import { IconHeart, IconHeartFilled, IconHeartOff } from "@tabler/icons-react";
import {
	useAddToFavorites,
	useFavorite,
	useRemoveFromFavorites,
} from "@/hooks/useFavorites";
import { m } from "@/paraglide/messages";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface FavoriteToggleButtonProps {
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

export function FavoriteToggleButton({
	movie,
	tvShow,
	color = "foreground",
}: FavoriteToggleButtonProps) {
	const addToFavorites = useAddToFavorites();
	const removeFromFavorites = useRemoveFromFavorites();

	const tmdbId = movie?.id ?? tvShow?.id ?? 0;
	const mediaType = movie ? "movie" : "tv";

	const { data: favoriteData } = useFavorite(
		tmdbId,
		mediaType as "movie" | "tv",
	);
	const isFavorited = !!favoriteData;

	if (!movie?.id && !tvShow?.id) return null;

	const handleToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		const mediaName = movie?.title ?? tvShow?.name;
		if (!mediaName) return;

		if (isFavorited) {
			removeFromFavorites.mutate({
				tmdbId,
				mediaType: mediaType as "movie" | "tv",
				mediaName,
			});
		} else {
			addToFavorites.mutate({
				tmdbId,
				mediaType: mediaType as "movie" | "tv",
				mediaName,
			});
		}
	};

	const isPending = addToFavorites.isPending || removeFromFavorites.isPending;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					onClick={handleToggle}
					disabled={isPending}
					className={`group flex flex-col items-center gap-1 transition-colors hover:cursor-pointer ${
						isFavorited ? "text-red-500" : `text-${color}`
					}`}
				>
					{isFavorited ? (
						<>
							<IconHeartFilled className="size-8 group-hover:hidden" />
							<IconHeartOff className="size-8 hidden group-hover:block" />
						</>
					) : (
						<IconHeart className="size-8" />
					)}
				</button>
			</TooltipTrigger>
			<TooltipContent>
				<p>
					{isFavorited ? m.favorite_toggle_remove() : m.favorite_toggle_add()}
				</p>
			</TooltipContent>
		</Tooltip>
	);
}
