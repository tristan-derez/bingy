import { IconHeart, IconHeartFilled, IconHeartOff } from "@tabler/icons-react";
import { useState } from "react";
import { FavoriteTvConfirmDialog } from "@/components/lists/media-actions/favorite-tv-confirm-dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	useAddToFavorites,
	useFavorite,
	useRemoveFromFavorites,
} from "@/hooks/useFavorites";
import { m } from "@/paraglide/messages";

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
	username: string;
}

export function FavoriteToggleButton({
	movie,
	tvShow,
	color = "foreground",
	username,
}: FavoriteToggleButtonProps) {
	const [showTvConfirmDialog, setShowTvConfirmDialog] = useState(false);
	const addToFavorites = useAddToFavorites(username);
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
			if (tvShow) {
				setShowTvConfirmDialog(true);
			} else {
				addToFavorites.mutate({
					tmdbId,
					mediaType: mediaType as "movie" | "tv",
					mediaName,
				});
			}
		}
	};

	const handleConfirmTvFavorite = () => {
		const mediaName = tvShow?.name;
		if (!mediaName) return;

		addToFavorites.mutate({
			tmdbId,
			mediaType: "tv",
			mediaName,
		});
		setShowTvConfirmDialog(false);
	};

	const isPending = addToFavorites.isPending || removeFromFavorites.isPending;

	return (
		<>
			<Tooltip>
				<TooltipTrigger
					render={
						<button
							type="button"
							onClick={handleToggle}
							disabled={isPending}
							className={`group flex flex-col items-center gap-1 transition-colors hover:text-red-400 ${
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
					}
				/>
				<TooltipContent>
					<p>
						{isFavorited ? m.favorite_toggle_remove() : m.favorite_toggle_add()}
					</p>
				</TooltipContent>
			</Tooltip>

			<FavoriteTvConfirmDialog
				open={showTvConfirmDialog}
				onOpenChange={setShowTvConfirmDialog}
				onConfirm={handleConfirmTvFavorite}
			/>
		</>
	);
}
