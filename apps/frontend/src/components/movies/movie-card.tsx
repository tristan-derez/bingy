import { Link } from "@tanstack/react-router";
import { Calendar, Star, Users } from "lucide-react";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { formatDate } from "@/utils/format-date";
import { Badge } from "../ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";

interface MovieCardProps {
	movie: Schemas.Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
	const imageUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: fallbackPoster;

	return (
		<Link to="/movies/$movieId" params={{ movieId: movie.id.toString() }}>
			<Card className="w-full h-full overflow-hidden pt-0 flex flex-col select-none gap-2 shadow-none pb-4">
				<div className="relative aspect-[2/3] w-full overflow-hidden">
					<img
						src={imageUrl}
						alt={movie.title}
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
						className="h-full w-full object-cover"
					/>
					{movie.adult && (
						<Badge className="absolute top-2 right-2" variant="destructive">
							18+
						</Badge>
					)}
				</div>

				<CardHeader>
					<CardTitle className="line-clamp-1 leading-normal">
						{movie.title}
					</CardTitle>
				</CardHeader>

				<CardContent className="flex flex-col gap-4 flex-grow">
					<p className="text-sm text-muted-foreground line-clamp-3 leading-normal min-h-[4rem]">
						{movie.overview ? movie.overview : "No overview available."}
					</p>

					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span className="font-medium">
								{movie.vote_count > 0
									? movie.vote_average.toFixed(1)
									: "No rating"}
							</span>
						</div>

						<div className="flex items-center gap-1 text-muted-foreground">
							<Users className="h-4 w-4" />
							<span>{movie.vote_count.toLocaleString()}</span>
						</div>
					</div>
				</CardContent>

				<CardFooter className="text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						<span>
							{movie.release_date
								? formatDate(movie.release_date, "en-US", {
										month: "short",
										year: "numeric",
										day: "2-digit",
									})
								: "N/A"}
						</span>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
};
