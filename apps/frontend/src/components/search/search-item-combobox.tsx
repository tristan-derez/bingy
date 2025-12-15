import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { FilmIcon, TvIcon, UserIcon } from "lucide-react";
import type { Schemas } from "shared";
import { CommandItem } from "@/components/ui/command";
import { localeRegionAtom } from "@/lib/atoms/region";
import { formatDate } from "@/utils/format-date";
import { MovieBadge } from "../badges/movie-badge";
import { PersonBadge } from "../badges/person-badge";
import { TvShowBadge } from "../badges/tv-badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface SearchItemComboboxProps {
	item: Schemas.MediaMulti;
	onSelect: () => void;
}

export const SearchItemCombobox = ({
	item,
	onSelect,
}: SearchItemComboboxProps) => {
	const navigate = useNavigate();
	const localeRegion = useAtomValue(localeRegionAtom);

	const commonClasses = "flex items-center gap-2 hover:cursor-pointer";

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
				className={commonClasses}
			>
				<FilmIcon className="h-4 w-4 shrink-0" />
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
				className={commonClasses}
			>
				<TvIcon className="h-4 w-4 shrink-0" />
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
				className={commonClasses}
			>
				{item.profile_path ? (
					<Avatar className="h-4 w-4 shrink-0 rounded-xs overflow-hidden p-0">
						<AvatarImage
							src={
								item.profile_path
									? `https://image.tmdb.org/t/p/w500${item.profile_path}`
									: undefined
							}
							alt={item.name}
							className="h-full w-full object-cover"
						/>
						<AvatarFallback>
							<UserIcon className="h-4 w-4" />
						</AvatarFallback>
					</Avatar>
				) : (
					<UserIcon className="h-4 w-4" />
				)}

				<span className="flex-1">{item.name}</span>

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
