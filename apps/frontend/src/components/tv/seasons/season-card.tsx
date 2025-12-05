import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";

export function SeasonCard({
	season,
	tvId,
}: {
	season: Schemas.TvDetails["seasons"][number];
	tvId: number;
}) {
	const localeRegion = useAtomValue(localeRegionAtom);
	const imageUrl = season.poster_path
		? `https://image.tmdb.org/t/p/w500${season.poster_path}`
		: fallbackPoster;

	return (
		<Link
			to="/tv/$tvId/season/$seasonNumber"
			params={{
				tvId: tvId.toString(),
				seasonNumber: String(season.season_number),
			}}
		>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<CardTitle>
								{season.season_number === 0
									? m.season_card_special_season()
									: m.season_card_season({
											seasonNumber: season.season_number,
										})}
							</CardTitle>
							<Badge className="text-sm">
								{season.air_date
									? formatDate(season.air_date, localeRegion, {
											year: "numeric",
										})
									: "N/A"}
							</Badge>
						</div>
						<Badge variant="outline">
							<span>
								{season.episode_count}{" "}
								{m.season_card_episode_badge({ count: season.episode_count })}
							</span>
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
						<div className="flex-1 gap-2">
							{season.name
								? season.name !==
										m.season_card_season({
											seasonNumber: season.season_number,
										}) &&
									season.season_number !== 0 && (
										<h3 className="font-semibold">{season.name}</h3>
									)
								: null}
							<p className="text-muted-foreground xl:line-clamp-9">
								{season.overview ? season.overview : m.overview_none()}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
