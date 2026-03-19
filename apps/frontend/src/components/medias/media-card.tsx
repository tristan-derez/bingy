import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getTmdbImageUrl } from "@/utils/utils";

interface MediaCardProps {
	media: Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits;
}

const isCastCredit = (
	media: Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits,
): media is Schemas.MediaWithCastCredits => {
	return "character" in media;
};

export const MediaCard = ({ media }: MediaCardProps) => {
	const imageUrl = getTmdbImageUrl(media.poster_path, "w500");

	const title = media.media_type === "movie" ? media.title : media.name;
	const linkTo =
		media.media_type === "movie" ? "/movies/$movieId" : "/tv/$tvId";
	const linkParams =
		media.media_type === "movie"
			? { movieId: media.id.toString() }
			: { tvId: media.id.toString() };

	const role = isCastCredit(media) ? media.character : media.job;

	return (
		<Link to={linkTo} params={linkParams}>
			<Card className="flex flex-col select-none gap-2 pt-0 pb-2 shadow-none rounded-md">
				<img
					src={imageUrl ?? fallbackPoster}
					alt={title}
					loading="lazy"
					className="w-30 h-45 md:w-45 md:h-67.5 object-cover aspect-2/3"
					onError={(e) => {
						const target = e.currentTarget;
						if (target.src !== fallbackPoster) {
							target.src = fallbackPoster;
						}
					}}
				/>
				<CardHeader>
					<CardTitle className="line-clamp-1 leading-normal" title={title}>
						{title}
					</CardTitle>
					{role ? (
						<CardDescription
							className="line-clamp-1 leading-relaxed"
							title={role}
						>
							{role}
						</CardDescription>
					) : null}
				</CardHeader>
			</Card>
		</Link>
	);
};
