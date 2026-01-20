import { IconEye, IconLock, IconUsers } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { m } from "@/paraglide/messages";

type ListCardProps = {
	item: {
		id: string;
		name: string;
		description: string | null;
		visibility: "limited" | "private" | "public";
		createdAt: Date;
		updatedAt: Date | null;
	};
	linkTo: string;
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

export function ListCard({ item, linkTo }: ListCardProps) {
	const VisibilityIcon = visibilityConfig[item.visibility].icon;

	return (
		<Link to={linkTo}>
			<Card className="hover:bg-accent transition-colors h-full">
				<CardHeader>
					<div className="flex items-start justify-between gap-2">
						<CardTitle className="line-clamp-2">{item.name}</CardTitle>
						<Badge variant="secondary" className="shrink-0">
							<VisibilityIcon className="h-3 w-3 mr-1" />
							{visibilityConfig[item.visibility].label()}
						</Badge>
					</div>
					{item.description && (
						<CardDescription className="line-clamp-3">
							{item.description}
						</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{m.list_created_at({
							date: item.createdAt.toLocaleDateString(),
						})}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
