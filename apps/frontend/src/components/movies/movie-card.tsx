import { Link } from "@tanstack/react-router";
import { Calendar, Star, Users } from "lucide-react";
import type { Movie } from "@/types/movie";
import { Badge } from "../ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";

interface MovieCardProps {
	movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
	const imageUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
		: "/placeholder.svg";
	return (
		<Link
			to="/movies/$movieId"
			params={{ movieId: movie.id.toString() }}
			className="block"
		>
			<Card className="w-full max-w-80 overflow-hidden pt-0">
				<div className="relative h-40 w-full overflow-hidden">
					<img
						src={imageUrl}
						alt={movie.title}
						className="h-full w-full object-cover"
					/>
					{movie.adult && (
						<Badge className="absolute top-2 right-2" variant="destructive">
							18+
						</Badge>
					)}
				</div>

				<CardHeader>
					<CardTitle className="line-clamp-1">{movie.title}</CardTitle>
				</CardHeader>

				<CardContent className="space-y-3">
					<p className="text-sm text-muted-foreground line-clamp-3">
						{movie.overview}
					</p>

					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span className="font-medium">
								{movie.vote_average.toFixed(1)}
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
							{new Date(movie.release_date).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})}
						</span>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
};
