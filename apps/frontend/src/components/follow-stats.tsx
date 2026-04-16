import { FollowersDialog } from "@/components/followers-dialog";
import type { UserItem } from "@/components/following-dialog";
import { FollowingDialog } from "@/components/following-dialog";

export function FollowStats() {
	const followingUsers: UserItem[] = [
		{
			name: "Username1",
			description: "User description placeholder",
			avatarUrl: "",
		},
		{
			name: "Username2",
			description: "User description placeholder",
			avatarUrl: "",
		},
	];
	const followersUsers: UserItem[] = [
		{
			name: "Username2",
			description: "User description placeholder",
			avatarUrl: "",
		},
	];

	return (
		<div className="flex flex-row gap-3 text-sm">
			<FollowingDialog users={followingUsers} />
			<FollowersDialog users={followersUsers} />
		</div>
	);
}
