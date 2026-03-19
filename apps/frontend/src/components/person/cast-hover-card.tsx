import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMediaQuery } from "@/integrations/media-query";
import { m } from "@/paraglide/messages";
import { Button } from "../ui/button";

interface CastHoverCardProps {
	person: Schemas.CastMember;
}

export const CastHoverCard = ({ person }: CastHoverCardProps) => {
	const isMobile = useMediaQuery("(pointer: coarse)");

	const imageUrl = person.profile_path
		? `https://image.tmdb.org/t/p/w500${person.profile_path}`
		: fallbackPoster;

	if (isMobile) {
		return (
			<Drawer swipeDirection="down">
				<DrawerTrigger>
					<Badge>{person.name}</Badge>
				</DrawerTrigger>
				<DrawerContent className="items-center">
					<div className="flex gap-4 pt-6 pb-2 px-4">
						<img
							src={imageUrl}
							alt={person.name}
							onError={(e) => {
								if (e.currentTarget.src !== fallbackPoster)
									e.currentTarget.src = fallbackPoster;
							}}
							className="w-20 h-auto aspect-2/3 object-cover rounded-lg shrink-0"
						/>
						<div className="flex flex-col justify-center gap-1 flex-1">
							<DrawerTitle className="wrap-break-words">
								{person.name}
							</DrawerTitle>
							<DrawerDescription className="wrap-break-words">
								{person.character
									? `${m.person_as()} ${person.character}`
									: "N/A"}
							</DrawerDescription>
						</div>
					</div>
					<DrawerFooter className="w-full mb-2">
						<Link
							to="/person/$personId"
							params={{ personId: person.id.toString() }}
							className="w-full"
						>
							<Button className="w-full">{m.btn_media_learn_more()}</Button>
						</Link>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<HoverCard>
			<HoverCardTrigger
				render={<Badge className="cursor-default">{person.name}</Badge>}
			/>
			<HoverCardContent className="w-40 p-0" side="left" align="end">
				<Link
					to="/person/$personId"
					params={{ personId: person.id.toString() }}
					className="block"
				>
					<img
						src={imageUrl}
						alt={person.name}
						onError={(e) => {
							if (e.currentTarget.src !== fallbackPoster)
								e.currentTarget.src = fallbackPoster;
						}}
						className="w-full h-auto aspect-2/3 object-cover rounded-t-md"
					/>
					<div className="p-2 space-y-1">
						<p className="font-semibold text-xs">{person.name}</p>
						<p className="text-xs text-muted-foreground">
							{person.character
								? `${m.person_as()} ${person.character}`
								: "N/A"}
						</p>
					</div>
				</Link>
			</HoverCardContent>
		</HoverCard>
	);
};
