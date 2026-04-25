import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl } from "@/utils/utils";

interface CrewCardTvProps {
	person: Schemas.CrewMember;
}

export const CrewCardTv = ({ person }: CrewCardTvProps) => {
	const imageUrl = getTmdbImageUrl(person.profile_path, "w200");

	return (
		<div className="relative pt-8">
			<Avatar className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-16 z-10">
				<AvatarImage
					src={imageUrl ?? fallbackPoster}
					alt={person.name}
					className="object-cover object-top"
					onError={(e) => {
						if (e.currentTarget.src !== fallbackPoster)
							e.currentTarget.src = fallbackPoster;
					}}
				/>
				<AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>

			<Card className="w-full min-w-60 mt-2 px-2 gap-2">
				<CardHeader className="text-center pt-0 pb-2">
					<CardTitle
						className="text-base leading-relaxed line-clamp-1"
						title={person.name}
					>
						{person.name}
					</CardTitle>
					<CardDescription
						className="text-sm leading-relaxed line-clamp-1"
						title={person.job}
					>
						{person.job ? person.job : "N/A"}
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center pt-0 gap-4 flex flex-col">
					<Link
						to="/person/$personId"
						params={{ personId: person.id.toString() }}
					>
						<Button className="w-full hover:cursor-pointer">
							{m.btn_show_more()}
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
};
