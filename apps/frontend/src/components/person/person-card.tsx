import fallbackPoster from "@/assets/movie-placeholder.jpg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { CastMember } from "../movies/movie-details";

interface PersonCardProps {
	person: CastMember;
}

export const PersonCard = ({ person }: PersonCardProps) => {
	const imageUrl = person.profile_path
		? `https://image.tmdb.org/t/p/w200${person.profile_path}`
		: fallbackPoster;

	return (
		<Card className="w-full max-w-30 lg:max-w-60 min-h-[250px] overflow-hidden pt-0">
			<div className="w-full h-[180px] lg:h-[300px] bg-gray-200">
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
			<CardHeader className="flex-grow justify-between py-2 px-3">
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
					{person.character}
				</CardDescription>
			</CardHeader>
		</Card>
	);
};
