import type { ReactNode } from "react";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { BottomGradient } from "@/components/lists/bottom-gradient";
import { ListDropdown } from "@/components/lists/media-actions/list-dropdown";
import { TopGradient } from "@/components/lists/top-gradient";
import { getMediaProps, getTmdbImageUrl } from "@/utils/utils";

interface MediaPosterProps {
	posterPath: string | null;
	title: string;
	mediaType: "movie" | "tv";
	id: number;
	releaseDate: string;
	children?: ReactNode;
}

export function MediaPosterContainer({
	posterPath,
	title,
	mediaType,
	id,
	releaseDate,
	children,
}: MediaPosterProps) {
	const imageUrl = getTmdbImageUrl(posterPath, "w500");
	const mediaProps = getMediaProps(
		mediaType,
		id,
		title,
		posterPath,
		releaseDate,
	);

	return (
		<div className="relative aspect-2/3 overflow-hidden rounded-lg">
			<TopGradient />
			<img
				src={imageUrl ?? undefined}
				alt={title}
				className="w-full h-full object-cover transition-transform"
			/>
			<BottomGradient />
			<div className="w-full absolute top-2 flex items-center justify-end z-10 pr-2">
				{mediaType === "movie" ? (
					<MovieBadge minWidth={8} />
				) : (
					<TvShowBadge minWidth={8} />
				)}
			</div>
			<div
				className="absolute bottom-1.5 right-1.5 z-10"
				onClick={(e) => e.stopPropagation()}
			>
				<ListDropdown {...mediaProps} imageUrl={imageUrl} />
			</div>
			{children}
		</div>
	);
}
