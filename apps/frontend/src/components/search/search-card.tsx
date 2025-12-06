import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Star } from "lucide-react";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/movie-placeholder.jpg";
import fallbackPersonPoster from "@/assets/user-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { localeAtom } from "@/lib/atoms/locale";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";

interface SearchCardProps {
	item: Schemas.MediaMulti;
}

export const SearchCard = ({ item }: SearchCardProps) => {
	const navigate = useNavigate();
	const locale = useAtomValue(localeAtom);

	const imageUrl =
		item.media_type === "person"
			? (item as Schemas.PersonExtended).profile_path
				? `https://image.tmdb.org/t/p/w500${(item as Schemas.PersonExtended).profile_path}`
				: fallbackPersonPoster
			: (item as Schemas.MovieMedia | Schemas.TvMedia).poster_path
				? `https://image.tmdb.org/t/p/w500${(item as Schemas.MovieMedia | Schemas.TvMedia).poster_path}`
				: fallbackPoster;

	if (item.media_type === "movie") {
		const movie = item as Schemas.MovieMedia;

		return (
			<Card
				className="flex flex-row p-4 cursor-pointer hover:bg-accent transition-colors gap-4"
				onClick={() =>
					navigate({
						to: "/movies/$movieId",
						params: { movieId: String(movie.id) },
					})
				}
			>
				<img
					src={imageUrl}
					alt={`poster path for ${movie.title}`}
					className="w-[100px] h-[170px] md:w-[133px] md:h-[200px] object-cover rounded flex-shrink-0"
				/>

				<CardHeader className="flex-1 flex flex-col gap-2 p-0">
					<div className="flex flex-col gap-2 md:flex-row md:items-center md:w-full">
						<div className="flex items-center gap-2">
							<CardTitle className="text-sm md:text-xl line-clamp-1">
								{movie.title}
							</CardTitle>
							{movie.release_date && (
								<span className="text-sm text-muted-foreground flex-shrink-0">
									{formatDate(movie.release_date, locale, {
										year: "numeric",
									})}
								</span>
							)}
						</div>

						<div className="flex items-center gap-2 md:ml-auto">
							{movie.vote_count > 0 ? (
								<div className="flex items-center gap-1 text-sm text-muted-foreground">
									<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
									{movie.vote_average.toFixed(1)}
								</div>
							) : null}
							<Badge
								variant="secondary"
								className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 min-w-18 justify-center"
							>
								{m.search_movie_badge()}
							</Badge>
						</div>
					</div>

					<CardDescription className="line-clamp-3 leading-relaxed">
						{movie.overview || m.overview_none()}
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (item.media_type === "tv") {
		const tv = item as Schemas.TvMedia;

		return (
			<Card
				className="flex flex-row gap-4 p-4 cursor-pointer hover:bg-accent transition-colors"
				onClick={() =>
					navigate({
						to: "/tv/$tvId",
						params: { tvId: String(tv.id) },
					})
				}
			>
				<img
					src={imageUrl}
					alt={`poster path for ${tv.name}`}
					className="w-[100px] h-[170px] md:w-[133px] md:h-[200px] object-cover rounded flex-shrink-0"
				/>

				<CardHeader className="flex-1 min-w-0 flex flex-col gap-2 p-0">
					<div className="flex flex-col gap-2 md:flex-row md:items-center md:w-full">
						<div className="flex items-center gap-2">
							<CardTitle className="text-sm md:text-xl line-clamp-1">
								{tv.name}
							</CardTitle>
							{tv.first_air_date && (
								<span className="text-sm text-muted-foreground flex-shrink-0">
									{formatDate(tv.first_air_date, locale, {
										year: "numeric",
									})}
								</span>
							)}
						</div>

						<div className="flex items-center gap-2 md:ml-auto">
							{tv.vote_count > 0 ? (
								<div className="flex items-center gap-1 text-sm text-muted-foreground">
									<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
									{tv.vote_average.toFixed(1)}
								</div>
							) : null}
							<Badge
								variant="secondary"
								className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 min-w-18 justify-center"
							>
								{m.search_tv_badge()}
							</Badge>
						</div>
					</div>
					{tv.original_name && tv.original_name !== tv.name ? (
						<span className="text-sm">Original name: {tv.original_name}</span>
					) : null}

					<CardDescription className="line-clamp-3 leading-relaxed">
						{tv.overview || m.overview_none()}
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (item.media_type === "person") {
		const person = item as Schemas.PersonExtended;

		return (
			<Card
				className="flex flex-row gap-4 p-4 cursor-pointer hover:bg-accent transition-colors"
				onClick={() =>
					navigate({
						to: "/person/$personId",
						params: { personId: String(person.id) },
					})
				}
			>
				<img
					src={imageUrl}
					alt={`picture of ${person.name}`}
					className="w-[100px] h-[170px] md:w-[133px] md:h-[200px] object-cover rounded flex-shrink-0"
				/>

				<CardHeader className="flex-1 min-w-0 flex flex-col gap-2 p-0">
					<div className="flex flex-col gap-2 w-full md:flex-row md:items-center">
						<CardTitle className="text-sm md:text-xl line-clamp-1">
							{person.name}
						</CardTitle>

						<Badge
							variant="secondary"
							className="bg-green-500/10 text-green-500 hover:bg-green-500/20 min-w-18 justify-center self-start md:ml-auto"
						>
							{m.search_person_badge()}
						</Badge>
					</div>

					{person.known_for_department && (
						<span className="text-sm text-muted-foreground">
							{person.known_for_department}
						</span>
					)}

					{person.known_for?.length ? (
						<CardDescription className="line-clamp-3 leading-relaxed">
							{m.person_known_for({
								gender: person.gender === 1 ? "female" : "male",
							})}

							{": "}
							{person.known_for
								.map((media) =>
									media.media_type === "movie"
										? (media as Schemas.MovieMedia).title
										: (media as Schemas.TvMedia).name,
								)
								.join(" - ")}
						</CardDescription>
					) : null}
				</CardHeader>
			</Card>
		);
	}

	return null;
};
