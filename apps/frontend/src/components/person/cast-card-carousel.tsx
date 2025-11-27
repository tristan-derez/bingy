import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface CastCardCarouselProps {
	person: Schemas.CastMember;
}

export const CastCardCarousel = ({ person }: CastCardCarouselProps) => {
	const imageUrl = person.profile_path
		? `https://image.tmdb.org/t/p/w200${person.profile_path}`
		: fallbackPoster;

	return (
		<Link to="/person/$personId" params={{ personId: person.id.toString() }}>
			<Card className="w-full min-w-42 lg:min-w-60 min-h-[250px]  overflow-hidden pt-0 select-none">
				<div className="w-full h-[250px]">
					<img
						src={imageUrl}
						alt={person.name}
						onError={(e) => {
							if (e.currentTarget.src !== fallbackPoster)
								e.currentTarget.src = fallbackPoster;
						}}
						className="h-full w-full object-cover"
					/>
				</div>
				<CardHeader className="flex-grow justify-between">
					<CardTitle
						className="text-base leading-tight line-clamp-1"
						title={person.name}
					>
						{person.name}
					</CardTitle>
					<CardDescription
						className="text-sm leading-tight line-clamp-1 mt-1"
						title={person.character}
					>
						{person.character ? person.character : "N/A"}
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
};
