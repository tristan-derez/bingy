import { useNavigate } from "@tanstack/react-router";
import { FilmIcon, TvIcon, UserIcon } from "lucide-react";
import type { Schemas } from "shared";
import { Badge } from "@/components/ui/badge";
import { CommandItem } from "@/components/ui/command";
import { formatDate } from "@/utils/format-date";
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

	const commonClasses = "flex items-center gap-2 hover:cursor-pointer";

	if (item.media_type === "movie") {
		const m = item as Schemas.MovieMedia;

		return (
			<CommandItem
				key={`movie-${m.id}`}
				value={`movie-${m.id}`}
				onSelect={() => {
					navigate({
						to: "/movies/$movieId",
						params: { movieId: String(m.id) },
					});
					onSelect();
				}}
				className={commonClasses}
			>
				<FilmIcon className="h-4 w-4 flex-shrink-0" />
				<span className="flex-1 line-clamp-1 leading-relaxed">{m.title}</span>
				<div className="flex items-center gap-2">
					{m.release_date && (
						<span className="text-xs text-muted-foreground">
							{formatDate(m.release_date, "en-US", { year: "numeric" })}
						</span>
					)}
					<Badge
						variant="secondary"
						className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 min-w-18 justify-center"
					>
						Movie
					</Badge>
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
				<TvIcon className="h-4 w-4 flex-shrink-0" />
				<span className="flex-1 line-clamp-1 leading-relaxed">{tv.name}</span>

				<div className="flex items-center gap-2">
					{tv.first_air_date && (
						<span className="text-xs text-muted-foreground">
							{formatDate(tv.first_air_date, "en-US", { year: "numeric" })}
						</span>
					)}
					<Badge
						variant="secondary"
						className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 min-w-18 justify-center"
					>
						TV show
					</Badge>
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
					<Avatar className="h-4 w-4 flex-shrink-0 rounded-xs overflow-hidden p-0">
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
					<Badge
						variant="secondary"
						className="bg-green-500/10 text-green-500 hover:bg-green-500/20 min-w-18 justify-center"
					>
						Person
					</Badge>
				</div>
			</CommandItem>
		);
	}

	return null;
};
