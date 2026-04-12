import { Link } from "@tanstack/react-router";
import type { MediaDetails } from "@/api/user-profile";
import { EmptyCardSlot } from "@/components/profile/cards/empty-card-slot";
import { ProfileFavoriteCard } from "@/components/profile/cards/profile-favorite-card";
import { m } from "@/paraglide/messages";
import { LoadingCentered } from "../loading/loading-centered";

type ProfileFavoritesSectionProps = {
	favorites: MediaDetails[];
	isLoading: boolean;
	localeRegion: string;
	ownProfile: boolean;
	username: string;
};

export function ProfileFavoritesSection({
	favorites,
	isLoading,
	ownProfile,
	username,
}: ProfileFavoritesSectionProps) {
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
					<EmptyCardSlot key={`fav-empty-${i}`} isOwnProfile={ownProfile} />
				))}
			</div>
		</section>
	);
}
