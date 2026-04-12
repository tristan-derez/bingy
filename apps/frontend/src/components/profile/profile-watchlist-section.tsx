import { Link } from "@tanstack/react-router";
import type { MediaDetails } from "@/api/user-profile";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { EmptyCardSlot } from "@/components/profile/cards/empty-card-slot";
import { ProfileWatchlistCard } from "@/components/profile/cards/profile-watchlist-card";
import { m } from "@/paraglide/messages";

type ProfileWatchlistSectionProps = {
	watchlist: MediaDetails[];
	isLoading: boolean;
	localeRegion: string;
	ownProfile: boolean;
	username: string;
};

export function ProfileWatchlistSection({
	watchlist,
	isLoading,
	ownProfile,
	username,
}: ProfileWatchlistSectionProps) {
	const emptySlots = 4 - watchlist.length;

	if (isLoading) {
		return (
			<section className="flex flex-col gap-2 min-h-[150px] lg:min-h-[300px]">
				<LoadingCentered />
			</section>
		);
	}

	if (watchlist.length === 0) return null;

	return (
		<section className="flex flex-col gap-2">
			<div className="flex flex-row justify-between">
				<h2 className="text-lg font-semibold">
					{m.profile_watchlist_section_title()}
				</h2>
				<Link
					to="/@{$username}/watchlist"
					params={{ username }}
					className="flex flex-row gap-2 items-center justify-center"
				>
					{m.profile_watchlist_section_link()}
				</Link>
			</div>

			<div className="grid grid-cols-4 gap-2">
				{watchlist.map((item) => {
					const type = item.mediaType === "movie" ? "movies" : "tv";
					return (
						<ProfileWatchlistCard
							key={`wl-${item.mediaType}-${item.id}`}
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
