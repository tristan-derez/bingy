import fallbackPoster from "@/assets/user-placeholder.jpg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface CastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}

interface CastCardCarouselProps {
	person: CastMember;
}

export const CastCardCarousel = ({ person }: CastCardCarouselProps) => {
	const imageUrl = person.profile_path
		? `https://image.tmdb.org/t/p/w200${person.profile_path}`
		: fallbackPoster;

	return (
		<Card className="w-full min-w-42 lg:min-w-60 min-h-[300px] lg:min-h-[400px] overflow-hidden pt-0 select-none">
			<div className="w-full h-[180px] lg:h-[300px]">
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
	);
};
