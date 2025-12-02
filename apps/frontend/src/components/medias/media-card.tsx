import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface MediaCardProps {
	media: Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits;
}

const isCastCredit = (
	media: Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits,
): media is Schemas.MediaWithCastCredits => {
	return "character" in media;
};

export const MediaCard = ({ media }: MediaCardProps) => {
	const imageUrl = media.poster_path
		? `https://image.tmdb.org/t/p/w500${media.poster_path}`
		: fallbackPoster;

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
			<Card className="w-full h-full overflow-hidden pt-0 flex flex-col select-none gap-2 shadow-none pb-4">
				<div className="relative aspect-[2/3] w-full overflow-hidden">
					<img
						src={imageUrl}
						alt={title}
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
