import { IconEye, IconLock, IconUsers } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";
import { getTruncatedContent } from "@/utils/truncate-content";
import { DeleteListButton } from "../custom-lists/delete-list-button";
import { EditListButton } from "../custom-lists/edit-list-button";

type ListCardProps = {
	item: {
		id: string;
		name: string;
		type: "ranked" | "unranked";
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
	const formattedDate = formatDate(item.createdAt.toString(), localeRegion, {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
	});
	const { displayText, shouldTruncate } = getTruncatedContent(
		item.description ?? "",
		100,
	);

	const description =
		displayText && shouldTruncate ? displayText + "..." : displayText;

	return (
		<Link
			to="/@{$username}/lists/$slug"
			params={{ username: username, slug: item.slug }}
		>
			<Card className="hover:bg-accent transition-colors h-full">
				<CardHeader>
					<div className="flex items-center gap-2 min-w-0">
						<CardTitle className="text-xl font-bold truncate min-w-0 flex-1">
							{item.name}
						</CardTitle>
						{isOwnProfile ? (
							<Badge variant="outline" className="shrink-0 flex gap-1">
								<VisibilityIcon className="h-3 w-3" />
								<span className="hidden sm:inline">
									{visibilityConfig[item.visibility].label()}
								</span>
							</Badge>
						) : null}
					</div>
					<CardDescription className="line-clamp-1 leading-relaxed">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent></CardContent>
				<CardFooter className="flex justify-between">
					<p className="text-sm text-muted-foreground">
						{m.list_created_at({
							date: formattedDate,
						})}
					</p>

					{isOwnProfile ? (
						<CardAction onClick={(e) => e.preventDefault()}>
							<div className="flex gap-2">
								<EditListButton
									username={username}
									listSlug={item.slug}
									size="icon-sm"
									showText={false}
								/>
								<DeleteListButton
									listId={item.id}
									listName={item.name}
									size="icon-sm"
									username={username}
								/>
							</div>
						</CardAction>
					) : null}
				</CardFooter>
			</Card>
		</Link>
	);
}
