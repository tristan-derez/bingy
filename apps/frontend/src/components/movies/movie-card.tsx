import {
	IconCalendarWeekFilled,
	IconStarFilled,
	IconUsers,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";

interface MovieCardProps {
	movie: Schemas.Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
	const localeRegion = useAtomValue(localeRegionAtom);
	const imageUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: fallbackPoster;

	return (
		<Link to="/movies/$movieId" params={{ movieId: movie.id.toString() }}>
			<Card className="w-full h-full overflow-hidden pt-0 flex flex-col select-none gap-2 shadow-none pb-4">
				<div className="relative aspect-3/4 md:aspect-2/3 w-full overflow-hidden">
					<img
						src={imageUrl}
						alt={movie.title}
						loading="lazy"
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

				<CardContent className="flex flex-col gap-4 grow pt-2">
					{movie.vote_count > 10 ? (
						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-1">
								<IconStarFilled className="h-4 w-4 text-yellow-400" />
								<span className="font-medium">
									{movie.vote_average.toFixed(1)}
								</span>
							</div>
							<div className="flex items-center gap-1 text-muted-foreground">
								<IconUsers className="h-4 w-4" />
								<span>{movie.vote_count.toLocaleString()}</span>
							</div>
						</div>
					) : null}
				</CardContent>

				<CardFooter className="text-sm text-muted-foreground border-none bg-card">
					<div className="flex items-center gap-1">
						<IconCalendarWeekFilled className="h-4 w-4" />
						<span>
							{movie.release_date
								? formatDate(movie.release_date, localeRegion, {
										month: "short",
										year: "numeric",
										day: "2-digit",
									})
								: m.text_not_announced()}
						</span>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
};
