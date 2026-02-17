import { IconEye, IconLock, IconUsers } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { DeleteListButton } from "../custom-lists/delete-list-button";

type ListCardProps = {
	item: {
		id: string;
		name: string;
		slug: string;
		description: string | null;
		visibility: "limited" | "private" | "public";
		createdAt: Date;
		updatedAt: Date | null;
	};
	username: string;
	isOwnProfile: boolean;
};

const visibilityConfig = {
	private: {
		icon: IconLock,
		label: m.list_visibility_private,
	},
	limited: {
		icon: IconUsers,
		label: m.list_visibility_limited,
	},
	public: {
		icon: IconEye,
		label: m.list_visibility_public,
	},
};

export function ListCard({ item, username, isOwnProfile }: ListCardProps) {
	const localeRegion = useAtomValue(localeRegionAtom);
	const VisibilityIcon = visibilityConfig[item.visibility].icon;
	const formattedDate = formatDate(item.createdAt.toString(), localeRegion);

	const displayDescription = item.description?.split("\n")[0] || "\u00A0";

	return (
		<Link
			to="/user/$username/lists/$slug"
			params={{ username: username, slug: item.slug }}
			className="hover:cursor-default"
		>
			<Card className="hover:bg-accent transition-colors h-full">
				<CardHeader>
					<div className="flex items-start justify-between gap-2">
						<div className="flex items-center gap-2 flex-1 min-w-0">
							<CardTitle className="line-clamp-1 leading-relaxed">
								{item.name}
							</CardTitle>
						</div>
						{isOwnProfile ? (
							<div onClick={(e) => e.preventDefault()}>
								<DeleteListButton listId={item.id} listName={item.name} />
							</div>
						) : null}
					</div>
					<CardDescription className="line-clamp-1 leading-relaxed max-w-2/3 ">
						{displayDescription}
					</CardDescription>
				</CardHeader>
				<CardContent></CardContent>
				<CardFooter className="flex justify-between">
					<p className="text-sm text-muted-foreground">
						{m.list_created_at({
							date: formattedDate,
						})}
					</p>
					<Badge variant="outline" className="shrink-0">
						<VisibilityIcon className="h-3 w-3 mr-1" />
						{visibilityConfig[item.visibility].label()}
					</Badge>
				</CardFooter>
			</Card>
		</Link>
	);
}
