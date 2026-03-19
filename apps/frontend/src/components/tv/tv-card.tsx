import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { CarouselCard } from "@/components/medias/carousel-card";
import { getTmdbImageUrl } from "@/utils/utils";

interface TvCardProps {
	tvShow: Schemas.Tv;
}

export const TvCard = ({ tvShow }: TvCardProps) => {
	const imageUrl = getTmdbImageUrl(tvShow.poster_path, "w500");

	return (
		<Link to="/tv/$tvId" params={{ tvId: tvShow.id.toString() }}>
			<CarouselCard imageUrl={imageUrl} mediaName={tvShow.name} />
		</Link>
	);
};
