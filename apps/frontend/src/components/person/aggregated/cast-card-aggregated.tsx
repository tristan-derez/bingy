import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

interface CastCardAggregatedProps {
	person: Schemas.CastPersonInAggregatedTvCredits;
}

export const CastCardAggregated = ({ person }: CastCardAggregatedProps) => {
	const imageUrl = person.profile_path
		? `https://image.tmdb.org/t/p/w200${person.profile_path}`
		: fallbackPoster;

	const primaryRole = person.roles.reduce((prev, current) =>
		current.episode_count > prev.episode_count ? current : prev,
	);

	const roleText =
		person.roles.length > 1
			? `${primaryRole.character} (+${person.roles.length - 1} more)`
			: primaryRole.character;

	return (
		<div className="relative pt-8">
			<Avatar className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-16 z-10">
				<AvatarImage
					src={imageUrl}
					alt={person.name}
					className="object-cover object-top"
					onError={(e) => {
						if (e.currentTarget.src !== fallbackPoster)
							e.currentTarget.src = fallbackPoster;
					}}
				/>
				<AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>

			<Card className="w-full min-w-60 pt-10 px-2">
				<CardHeader className="text-center pt-0">
					<CardTitle
						className="text-base leading-relaxed line-clamp-1"
						title={person.name}
					>
						{person.name}
					</CardTitle>
					<CardDescription
						className="text-sm leading-relaxed mt-1 line-clamp-1"
						title={roleText}
					>
						{roleText}
					</CardDescription>
					<CardDescription className="text-xs text-muted-foreground">
						{person.total_episode_count} episodes
					</CardDescription>
				</CardHeader>

				<CardContent className="text-center pt-0 gap-4 flex flex-col">
					<Separator />
					<Button asChild>
						<Link
							to="/person/$personId"
							params={{ personId: person.id.toString() }}
						>
							See more
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};
