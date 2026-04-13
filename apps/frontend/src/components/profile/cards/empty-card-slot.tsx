import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import type { Schemas } from "shared";
import { SearchDialog } from "@/components/search/search-dialog";
import { Button } from "@/components/ui/button";
import { useAddToFavorites } from "@/hooks/useFavorites";
import { useAddMediaToWatchlist } from "@/hooks/useLists";

interface EmptyCardSlotProps {
	isOwnProfile: boolean;
	type: "watchlist" | "favorites";
	username: string;
}

export function EmptyCardSlot({
	isOwnProfile,
	type,
	username,
}: EmptyCardSlotProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const addMediaToWatchlist = useAddMediaToWatchlist(username);
	const addToFavorites = useAddToFavorites(username);

	const handleSelectMedia = (media: Schemas.MediaMulti) => {
		if (media.media_type === "person") return; // Person not supported for lists
		const mediaItem = media as Schemas.Media;
		const tmdbId = mediaItem.id;
		let mediaType: "movie" | "tv";
		let title: string;

		switch (mediaItem.media_type) {
			case "movie":
				mediaType = "movie";
				title = mediaItem.title;
				break;
			case "tv":
				mediaType = "tv";
				title = mediaItem.name;
				break;
			default:
				return;
		}

		if (type === "watchlist") {
			addMediaToWatchlist.mutate({
				tmdbId,
				mediaType,
				title: mediaType === "movie" ? title : undefined,
				name: mediaType === "tv" ? title : undefined,
			});
		} else if (type === "favorites") {
			addToFavorites.mutate({
				tmdbId,
				mediaType,
				mediaName: title,
			});
		}
	};

	return (
		<div className="aspect-2/3 rounded-lg bg-muted flex items-center justify-center">
			{isOwnProfile ? (
				<>
					<Button size="icon-sm" onClick={() => setDialogOpen(true)}>
						<IconPlus />
					</Button>
					<SearchDialog
						open={dialogOpen}
						onOpenChange={setDialogOpen}
						onSelectMedia={handleSelectMedia}
					/>
				</>
			) : null}
		</div>
	);
}
