import { IconDeviceTv, IconMovie, IconUser } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { MovieBadge } from "@/components/badges/movie-badge";
import { PersonBadge } from "@/components/badges/person-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import { CommandItem } from "@/components/ui/command";
import { localeRegionAtom } from "@/lib/atoms/region";
import { formatDate } from "@/utils/format-date";

interface SearchCommandItemProps {
	item: Schemas.MediaMulti;
	onSelect: () => void;
}

export const SearchCommandItem = ({
	item,
	onSelect,
}: SearchCommandItemProps) => {
	const navigate = useNavigate();
	const localeRegion = useAtomValue(localeRegionAtom);

	if (item.media_type === "movie") {
		const movie = item as Schemas.MovieMedia;

		return (
			<CommandItem
				key={`movie-${movie.id}`}
				value={`movie-${movie.id}`}
				onSelect={() => {
					navigate({
						to: "/movies/$movieId",
						params: { movieId: String(movie.id) },
					});
					onSelect();
				}}
				className="[&>svg:last-child]:hidden"
			>
				<IconMovie className="shrink-0" />
				<span className="flex-1 line-clamp-1 leading-relaxed">
					{movie.title}
				</span>
				<div className="flex items-center gap-2">
					{movie.release_date && (
						<span className="text-xs text-muted-foreground">
							{formatDate(movie.release_date, localeRegion, {
								year: "numeric",
							})}
						</span>
					)}
					<MovieBadge />
				</div>
			</CommandItem>
		);
	}

	if (item.media_type === "tv") {
		const tv = item as Schemas.TvMedia;

		return (
			<CommandItem
				key={`tv-${tv.id}`}
				value={`tv-${tv.id}`}
				onSelect={() => {
					navigate({
						to: "/tv/$tvId",
						params: { tvId: String(tv.id) },
					});
					onSelect();
				}}
				className="[&>svg:last-child]:hidden"
			>
				<IconDeviceTv className="shrink-0" />
				<span className="flex-1 line-clamp-1 leading-relaxed">{tv.name}</span>

				<div className="flex items-center gap-2">
					{tv.first_air_date && (
						<span className="text-xs text-muted-foreground">
							{formatDate(tv.first_air_date, localeRegion, {
								year: "numeric",
							})}
						</span>
					)}
					<TvShowBadge />
				</div>
			</CommandItem>
		);
	}

	if (item.media_type === "person") {
		return (
			<CommandItem
				key={`person-${item.id}`}
				value={`person-${item.id}`}
				onSelect={() => {
					navigate({
						to: "/person/$personId",
						params: { personId: String(item.id) },
					});
					onSelect();
				}}
				className="[&>svg:last-child]:hidden"
			>
				<IconUser className="shrink-0" />
				<span className="flex-1 line-clamp-1">{item.name}</span>

				<div className="flex items-center gap-2">
					{item.known_for_department && (
						<span className="text-xs text-muted-foreground">
							{item.known_for_department}
						</span>
					)}

					<PersonBadge />
				</div>
			</CommandItem>
		);
	}

	return null;
};
