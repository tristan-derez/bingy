import { Link } from "@tanstack/react-router";
import { PositionBadge } from "@/components/lists/custom-lists/position-badge";
import { MediaPosterContainer } from "@/components/lists/media-poster-container";

interface ListMediaCardProps {
	item: {
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		position?: number;
		mediaType: "movie" | "tv";
		addedAt: Date;
		note: string | null;
	};
	showPosition?: boolean;
}

export const ListMediaCard = ({ item, showPosition }: ListMediaCardProps) => {
	const linkTo =
		item.mediaType === "movie" ? `/movies/${item.id}` : `/tv/${item.id}`;

	return (
		<div key={`${item.mediaType}-${item.id}`}>
			<Link to={linkTo}>
				<MediaPosterContainer {...item}>
					{showPosition && item.position ? (
						<div className="absolute top-2 left-2 z-10">
							<PositionBadge position={item.position} variant="overlay" />
						</div>
					) : null}
				</MediaPosterContainer>
			</Link>
		</div>
	);
};
