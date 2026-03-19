import { IconExternalLink } from "@tabler/icons-react"; // or whichever icon you want
import { Link } from "@tanstack/react-router";
import type { Schemas } from "shared";
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
	const personName = person.name;
	const character = person.character
		? `${m.person_as()} ${person.character}`
		: "N/A";
	const imageUrl = person.profile_path
		? `https://image.tmdb.org/t/p/w500${person.profile_path}`
		: null;

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		e.currentTarget.style.display = "none";
	};

	if (isMobile) {
		return (
			<Drawer swipeDirection="down">
				<DrawerTrigger>
					<Badge>{personName}</Badge>
				</DrawerTrigger>
				<DrawerContent className="items-center">
					<div className="flex gap-4 pt-6 pb-2 px-4">
						{imageUrl ? (
							<img
								src={imageUrl}
								alt={personName}
								onError={handleImageError}
								className="w-20 h-auto aspect-2/3 object-cover rounded-lg shrink-0"
							/>
						) : null}
						<div className="flex flex-col justify-center gap-1 flex-1">
							<DrawerTitle className="wrap-break-words">
								{personName}
							</DrawerTitle>
							<DrawerDescription className="wrap-break-words">
								{character}
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
				render={<Badge className="cursor-default">{personName}</Badge>}
			/>
			<HoverCardContent className="w-40 p-0" side="left" align="end">
				<Link
					to="/person/$personId"
					params={{ personId: person.id.toString() }}
					className="block"
				>
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={personName}
							onError={handleImageError}
							className="w-full h-auto aspect-2/3 object-cover rounded-t-md"
						/>
					) : null}
					<div className="p-2 space-y-1">
						<div className="flex items-start gap-1">
							<p className="font-semibold text-xs flex-1 wrap-break-words">
								{personName}
							</p>
							<IconExternalLink size={14} className="shrink-0 mt-0.5" />
						</div>
						<p className="text-xs text-muted-foreground">{character}</p>
					</div>
				</Link>
			</HoverCardContent>
		</HoverCard>
	);
};
