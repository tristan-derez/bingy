import { Link } from "@tanstack/react-router";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { EmptyPosterCard } from "@/components/profile/cards/empty-poster-card";
import { ProfileWatchlistCard } from "@/components/profile/cards/profile-watchlist-card";
import { useUserWatchlist } from "@/hooks/useUserProfile";
import { m } from "@/paraglide/messages";

type ProfileWatchlistSectionProps = {
	username: string;
	localeRegion: string;
	ownProfile: boolean;
};

export function ProfileWatchlistSection({
	username,
	localeRegion,
	ownProfile,
}: ProfileWatchlistSectionProps) {
	const { data: watchlistData, isLoading } = useUserWatchlist(
		username,
		localeRegion,
	);
	const watchlist = watchlistData?.data ?? [];
	const emptySlots = 4 - watchlist.length;

	if (watchlist.length === 0) return null;
	if (isLoading) {
		return (
			<section className="flex flex-col gap-2 min-h-[150px] lg:min-h-[300px]">
				<LoadingCentered />
			</section>
		);
	}

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
					<EmptyPosterCard key={`fav-empty-${i}`} isOwnProfile={ownProfile} />
				))}
			</div>
		</section>
	);
}
