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
		? `https://image.tmdb.org/t/p/w500${person.profile_path}`
		: fallbackPoster;

	return (
		<Link to="/person/$personId" params={{ personId: person.id.toString() }}>
			<Card className="flex flex-col select-none gap-2 pt-0 pb-2 shadow-none rounded-md">
				<img
					src={imageUrl}
					alt={person.name}
					onError={(e) => {
						if (e.currentTarget.src !== fallbackPoster)
							e.currentTarget.src = fallbackPoster;
					}}
					className="w-30 h-45 md:w-45 md:h-67.5 object-cover aspect-2/3"
				/>
				<CardHeader className="grow justify-between gap-2">
					<CardTitle
						className="text-base leading-relaxed line-clamp-1"
						title={person.name}
					>
						{person.name}
					</CardTitle>
					<CardDescription
						className="text-sm leading-relaxed line-clamp-1 mt-1"
						title={person.character}
					>
						{person.character ? person.character : "N/A"}
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
};
