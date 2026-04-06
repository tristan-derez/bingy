import { Link } from "@tanstack/react-router";
import { EmptyPosterCard } from "@/components/profile/cards/empty-poster-card";
import { ProfileFavoriteCard } from "@/components/profile/cards/profile-favorite-card";
import { useUserFavorites } from "@/hooks/useUserProfile";
import { m } from "@/paraglide/messages";
import { LoadingCentered } from "../loading/loading-centered";

type ProfileFavoritesSectionProps = {
	username: string;
	localeRegion: string;
	ownProfile: boolean;
};

export function ProfileFavoritesSection({
	username,
	localeRegion,
	ownProfile,
}: ProfileFavoritesSectionProps) {
	const { data: favoritesData, isLoading } = useUserFavorites(
		username,
		localeRegion,
	);
	const favorites = favoritesData?.data ?? [];
	const emptySlots = 4 - favorites.length;

	if (isLoading) {
		return (
			<section className="flex flex-col gap-2 min-h-[150px] lg:min-h-[300px]">
				<LoadingCentered />
			</section>
		);
	}

	if (favorites.length === 0) return null;

	return (
		<section className="flex flex-col gap-2">
			<div className="flex flex-row justify-between">
				<h2 className="text-lg font-semibold">
					{m.profile_favorites_section_title()}
				</h2>
				<Link
					to="/@{$username}/favorites"
					params={{ username }}
					className="flex flex-row gap-2 items-center justify-center"
				>
					{m.profile_favorites_section_link()}
				</Link>
			</div>

			<div className="grid grid-cols-4 gap-2">
				{favorites.map((item) => {
					const type = item.mediaType === "movie" ? "movies" : "tv";
					return (
						<ProfileFavoriteCard
							key={`fav-${item.mediaType}-${item.id}`}
							item={item}
							linkTo={`/${type}/${item.id}`}
						/>
					);
				})}
				{[...Array(emptySlots)].map((_, i) => (
					<EmptyPosterCard key={`fav-empty-${i}`} isOwnProfile={ownProfile} />
				))}
			</div>
		</section>
	);
}
