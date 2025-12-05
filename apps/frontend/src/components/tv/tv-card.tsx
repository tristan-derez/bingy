import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Calendar, Star, Users } from "lucide-react";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { Badge } from "../ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";

interface TvCardProps {
	tvShow: Schemas.Tv;
}

export const TvCard = ({ tvShow }: TvCardProps) => {
	const localeRegion = useAtomValue(localeRegionAtom);

	const imageUrl = tvShow.poster_path
		? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
		: fallbackPoster;

	return (
		<Link to="/tv/$tvId" params={{ tvId: tvShow.id.toString() }}>
			<Card className="w-full h-full overflow-hidden pt-0 flex flex-col select-none gap-2 shadow-none pb-4">
				<div className="relative aspect-[2/3] w-full overflow-hidden">
					<img
						src={imageUrl}
						alt={tvShow.name}
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
						className="h-full w-full object-cover"
					/>
					{tvShow.adult && (
						<Badge className="absolute top-2 right-2" variant="destructive">
							18+
						</Badge>
					)}
				</div>
				<CardHeader>
					<CardTitle className="line-clamp-1 leading-normal">
						{tvShow.name}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4 flex-grow">
					<p className="text-sm text-muted-foreground line-clamp-3 leading-normal min-h-[4rem]">
						{tvShow.overview ? tvShow.overview : m.overview_none()}
					</p>

					{tvShow.vote_count > 0 ? (
						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span className="font-medium">
									{tvShow.vote_average.toFixed(1)}
								</span>
							</div>

							<div className="flex items-center gap-1 text-muted-foreground">
								<Users className="h-4 w-4" />
								<span>{tvShow.vote_count.toLocaleString()}</span>
							</div>
						</div>
					) : null}
				</CardContent>
				<CardFooter className="text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						<span>
							{tvShow.first_air_date
								? formatDate(tvShow.first_air_date, localeRegion, {
										year: "numeric",
										month: "short",
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
