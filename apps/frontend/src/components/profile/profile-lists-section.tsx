import { Link } from "@tanstack/react-router";
import type { UserListsResponse } from "@/api/user-profile";
import { ListCard } from "@/components/lists/custom-lists/list-card";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { m } from "@/paraglide/messages";

type ProfileListsSectionProps = {
	lists: UserListsResponse["data"];
	isLoading: boolean;
	localeRegion: string;
	ownProfile: boolean;
	username: string;
};

export function ProfileListsSection({
	lists,
	isLoading,
	ownProfile,
	username,
}: ProfileListsSectionProps) {
	if (isLoading) {
		return (
			<section className="flex flex-col gap-2 min-h-[150px] lg:min-h-[300px]">
				<LoadingCentered />
			</section>
		);
	}

	if (lists.length === 0) return null;

	return (
		<section className="flex flex-col gap-2">
			<div className="flex flex-row justify-between">
				<h2 className="text-lg font-semibold">
					{m.profile_lists_section_title()}
				</h2>
				<Link
					to="/@{$username}/lists"
					params={{ username }}
					className="flex flex-row gap-2 items-center justify-center"
				>
					{m.profile_lists_section_link()}
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-2">
				{lists.map((list) => (
					<ListCard
						key={list.id}
						item={list}
						username={username}
						isOwnProfile={ownProfile}
					/>
				))}
			</div>
		</section>
	);
}
