import { EmptyUsers } from "@/components/profile/empty-users";
import type { UserItem } from "@/components/profile/profile-following-dialog";
import { UserCard } from "@/components/profile/user-card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { m } from "@/paraglide/messages";

interface ProfileFollowersDialogProps {
	users: UserItem[];
}

export function ProfileFollowersDialog({ users }: ProfileFollowersDialogProps) {
	const hasFollowers = users.length > 0;

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="ghost" className="flex flex-row gap-1 items-center">
						<span className="font-semibold">{users.length ?? 0}</span>
						<span className="text-muted-foreground">
							{m.profile_page_followers()}
						</span>
					</Button>
				}
			/>
			<DialogContent className="max-w-xs md:max-w-lg">
				<DialogHeader>
					<DialogTitle>{m.profile_page_followers_dialog_title()}</DialogTitle>
					<DialogDescription>
						{m.profile_page_followers_dialog_description()}
					</DialogDescription>
				</DialogHeader>
				{hasFollowers ? (
					<div className="-mx-4 no-scrollbar max-h-[50vh] lg:max-h-[30vh] overflow-y-auto px-4">
						{users.map((user) => (
							<UserCard
								key={user.name}
								name={user.name}
								description={user.description}
								avatarUrl={user.avatarUrl}
							/>
						))}
					</div>
				) : (
					<EmptyUsers message={m.profile_page_followers_empty()} />
				)}
			</DialogContent>
		</Dialog>
	);
}
