import { Link } from "@tanstack/react-router";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { CrewMember } from "@/types/person";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

interface CrewCardMovieProps {
	person: CrewMember;
}

export const CrewCardMovie = ({ person }: CrewCardMovieProps) => {
	const imageUrl = person.profile_path
		? `https://image.tmdb.org/t/p/w200${person.profile_path}`
		: fallbackPoster;

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
						className="text-base leading-tight line-clamp-1"
						title={person.name}
					>
						{person.name}
					</CardTitle>
					<CardDescription
						className="text-sm leading-tight mt-1 line-clamp-1"
						title={person.job}
					>
						{person.job ? person.job : "N/A"}
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
