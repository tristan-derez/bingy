import { ProfileFollowersDialog } from "@/components/profile/profile-followers-dialog";
import type { UserItem } from "@/components/profile/profile-following-dialog";
import { ProfileFollowingDialog } from "@/components/profile/profile-following-dialog";

export function ProfileFollowStats() {
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
			<ProfileFollowingDialog users={followingUsers} />
			<ProfileFollowersDialog users={followersUsers} />
		</div>
	);
}
