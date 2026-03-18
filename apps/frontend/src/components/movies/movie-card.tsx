import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { CarouselCard } from "@/components/medias/carousel-card";
import { getTmdbImageUrl } from "@/utils/utils";

interface MovieCardProps {
	movie: Schemas.Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
	const imageUrl = getTmdbImageUrl(movie.poster_path, "w500");

	return (
		<Link to="/movies/$movieId" params={{ movieId: movie.id.toString() }}>
			<CarouselCard imageUrl={imageUrl} mediaName={movie.title} />
		</Link>
	);
};
