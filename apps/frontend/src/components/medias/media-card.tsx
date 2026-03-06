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
			<Card className="w-full h-full border-none bg-accent overflow-hidden pt-0 select-none gap-4 pb-4">
				<div className="relative aspect-3/4 md:aspect-2/3 w-full overflow-hidden">
					<img
						src={imageUrl ?? fallbackPoster}
						alt={title}
						loading="lazy"
						className="h-full w-full object-cover"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
				</div>
				<CardHeader>
					<CardTitle className="line-clamp-1 leading-normal" title={title}>
						{title}
					</CardTitle>
					{role ? (
						<CardDescription className="line-clamp-1 leading-relaxed">
							{role}
						</CardDescription>
					) : null}
				</CardHeader>
			</Card>
		</Link>
	);
};
