import { IconUserPlus } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

interface UserCardProps {
	name: string;
	description: string;
	avatarUrl?: string;
}

function UserCard({ name, description, avatarUrl }: UserCardProps) {
	return (
		<div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
			<Avatar className="h-10 w-10 rounded-full">
				<AvatarImage src={avatarUrl} alt={name} />
				<AvatarFallback className="rounded-full">
					{name.charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate">{name}</p>
				<p className="text-xs text-muted-foreground truncate">{description}</p>
			</div>
			<Button variant="outline" size="sm" className="shrink-0 gap-1">
				<IconUserPlus className="h-4 w-4" />
				{m.profile_page_follow_button()}
			</Button>
		</div>
	);
}

export { UserCard };
export type { UserCardProps };
