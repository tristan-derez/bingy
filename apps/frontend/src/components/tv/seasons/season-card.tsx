import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { TvDetails } from "@/types/tv";

export function SeasonCard({
	season,
}: {
	season: TvDetails["seasons"][number];
}) {
	const imageUrl = season.poster_path
		? `https://image.tmdb.org/t/p/w200${season.poster_path}`
		: fallbackPoster;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<CardTitle>
							{season.season_number === 0
								? "Specials"
								: `Season ${season.season_number}`}
						</CardTitle>
						{season.air_date && (
							<Badge className="text-sm">
								{new Date(season.air_date).toLocaleDateString("en-US", {
									year: "numeric",
								})}
							</Badge>
						)}
					</div>
					<Badge variant="outline">
						{season.episode_count}{" "}
						{season.episode_count === 1 ? "Episode" : "Episodes"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4 flex-col sm:flex-row sm:items-start">
					<img
						src={imageUrl}
						alt={season.name}
						className="rounded-lg w-50 h-80 lg:w-42 lg:h-62 object-cover mx-auto sm:mx-0"
						onError={(e) => {
							const target = e.currentTarget;
							if (target.src !== fallbackPoster) {
								target.src = fallbackPoster;
							}
						}}
					/>
					<div className="flex-1 space-y-2">
						{season.name &&
							season.name !== `Season ${season.season_number}` &&
							season.season_number !== 0 && (
								<h3 className="font-semibold">{season.name}</h3>
							)}
						{season.overview && (
							<p className="text-muted-foreground">{season.overview}</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
