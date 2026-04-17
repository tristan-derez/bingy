import { EmptyUsers } from "@/components/profile/empty-users";
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

export interface UserItem {
	name: string;
	description: string;
	avatarUrl?: string;
}

interface ProfileFollowingDialogProps {
	users: UserItem[];
}

export function ProfileFollowingDialog({ users }: ProfileFollowingDialogProps) {
	const hasFollowing = users.length > 0;

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="link" className="flex flex-row items-center p-0">
						<span className="font-semibold">
							{users.length ?? 0} {m.profile_page_following()}
						</span>
					</Button>
				}
			/>
			<DialogContent className="max-w-xs md:max-w-lg">
				<DialogHeader>
					<DialogTitle>{m.profile_page_following_dialog_title()}</DialogTitle>
					<DialogDescription>
						{m.profile_page_following_dialog_description()}
					</DialogDescription>
				</DialogHeader>
				{hasFollowing ? (
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
					<EmptyUsers message={m.profile_page_following_empty()} />
				)}
			</DialogContent>
		</Dialog>
	);
}
