import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { EmptyProfile } from "@/components/profile/empty-profile";
import { ProfileFavoritesSection } from "@/components/profile/profile-favorites-section";
import { ProfileListsSection } from "@/components/profile/profile-lists-section";
import { ProfileWatchlistSection } from "@/components/profile/profile-watchlist-section";
import {
	useUserFavorites,
	useUserLists,
	useUserWatchlist,
} from "@/hooks/useUserProfile";
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

	const { data: favoritesData, isLoading: isFavoritesLoading } =
		useUserFavorites(username, localeRegion);
	const { data: watchlistData, isLoading: isWatchlistLoading } =
		useUserWatchlist(username, localeRegion);
	const { data: listsData, isLoading: isListsLoading } = useUserLists(
		username,
		localeRegion,
	);

	const favorites = favoritesData?.data ?? [];
	const watchlist = watchlistData?.data ?? [];
	const lists = listsData?.data ?? [];

	const hasFavorites = favorites.length > 0;
	const hasWatchlist = watchlist.length > 0;
	const hasLists = lists.length > 0;
	const isProfileEmpty = !hasFavorites && !hasWatchlist && !hasLists;

	if (isProfileEmpty) {
		return <EmptyProfile ownProfile={ownProfile} />;
	}

	return (
		<div className="flex flex-col gap-6 lg:flex-row flex-1">
			<div className="flex flex-col gap-6 flex-1 lg:max-w-6/9">
				<ProfileFavoritesSection
					favorites={favorites}
					isLoading={isFavoritesLoading}
					localeRegion={localeRegion}
					ownProfile={ownProfile}
					username={username}
				/>
				<ProfileWatchlistSection
					watchlist={watchlist}
					isLoading={isWatchlistLoading}
					localeRegion={localeRegion}
					ownProfile={ownProfile}
					username={username}
				/>
				<ProfileListsSection
					lists={lists}
					isLoading={isListsLoading}
					localeRegion={localeRegion}
					ownProfile={ownProfile}
					username={username}
				/>
			</div>
			<div className="flex flex-col gap-6 flex-1 max-w-full lg:max-w-3/9">
				{/* <ProfileRatingsSection username={username} /> */}
				{/* <ProfileActivitySection
					username={username}
					isOwnProfile={ownProfile}
					localeRegion={localeRegion}
				/> */}
			</div>
		</div>
	);
}
