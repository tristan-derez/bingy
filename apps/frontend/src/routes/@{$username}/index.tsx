import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { ProfileActivitySection } from "@/components/profile/profile-activity-section";
import { ProfileFavoritesSection } from "@/components/profile/profile-favorites-section";
import { ProfileListsSection } from "@/components/profile/profile-lists-section";
import { ProfileRatingsSection } from "@/components/profile/profile-ratings-section";
import { ProfileWatchlistSection } from "@/components/profile/profile-watchlist-section";
import { localeRegionAtom } from "@/lib/atoms/region";
import { isOwnProfile } from "@/utils/utils";

export const Route = createFileRoute("/@{$username}/")({
	component: ProfilePage,
});

function ProfilePage() {
	const { authData } = useRouteContext({ from: "__root__" });
	const { username } = Route.useParams();
	const ownProfile = isOwnProfile(authData?.user.name, username);
	const localeRegion = useAtomValue(localeRegionAtom);

	return (
		<div className="flex flex-col gap-6 lg:flex-row flex-1">
			<div className="flex flex-col gap-6 flex-1 lg:max-w-6/9">
				<ProfileFavoritesSection
					username={username}
					localeRegion={localeRegion}
					ownProfile={ownProfile}
				/>
				<ProfileWatchlistSection
					username={username}
					localeRegion={localeRegion}
					ownProfile={ownProfile}
				/>
				<ProfileListsSection
					username={username}
					localeRegion={localeRegion}
					ownProfile={ownProfile}
				/>
			</div>
			<div className="flex flex-col gap-6 flex-1 max-w-full lg:max-w-3/9">
				<ProfileRatingsSection username={username} />
				<ProfileActivitySection
					username={username}
					isOwnProfile={ownProfile}
					localeRegion={localeRegion}
				/>
			</div>
		</div>
	);
}
