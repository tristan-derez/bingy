import { m } from "@/paraglide/messages";
import { formatDistanceToNow } from "@/utils/format-date";
import { ActivityItemContent } from "./activity-item-content";

export type ActivityType =
	| "added_to_watchlist"
	| "followed_user"
	| "rated"
	| "added_to_favorites"
	| "created_list"
	| "watched";

export type ActivityItem = {
	id: string;
	type: ActivityType;
	username: string;
	targetUsername?: string;
	mediaTitle?: string;
	mediaId?: number;
	mediaType?: "movie" | "tv";
	rating?: number;
	listName?: string;
	listSlug?: string;
	createdAt: Date;
};

type ProfileActivitySectionProps = {
	username: string;
	isOwnProfile: boolean;
	localeRegion: string;
};

const mockActivities: ActivityItem[] = [
	{
		id: "019d7928-5022-7338-b432-31a46bce5192",
		type: "added_to_watchlist",
		username: "Dreyz",
		mediaTitle: "Inception",
		mediaId: 27205,
		mediaType: "movie",
		createdAt: new Date(Date.now() - 1000 * 60 * 30),
	},
	{
		id: "019d7928-6bae-72a8-827c-e987c2aafd50",
		type: "followed_user",
		username: "Dreyz",
		targetUsername: "Looping",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
	},
	{
		id: "019d7928-7bde-76e9-9156-484142447b4e",
		type: "rated",
		username: "Dreyz",
		mediaTitle: "The Dark Knight",
		mediaId: 155,
		mediaType: "movie",
		rating: 5,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
	},
	{
		id: "019d7928-89f6-7298-8ace-7c1b8e547b42",
		type: "added_to_favorites",
		username: "Dreyz",
		mediaTitle: "Better Call Saul",
		mediaId: 60059,
		mediaType: "tv",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
	},
	{
		id: "019d7928-9eae-74a8-a513-2a1d330a434f",
		type: "created_list",
		username: "Dreyz",
		listName: "Super liste",
		listSlug: "super-liste",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
	},
	{
		id: "019d7928-b327-7209-9c4f-9da3db765a32",
		type: "added_to_watchlist",
		username: "Dreyz",
		mediaTitle: "Stranger Things",
		mediaId: 66732,
		mediaType: "tv",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
	},
	{
		id: "019d7928-c072-76d9-a7bd-890f377263f5",
		type: "watched",
		username: "Dreyz",
		mediaTitle: "Super Mario Bros., le film",
		mediaId: 502356,
		mediaType: "movie",
		createdAt: new Date("2024-02-09"),
	},
];

// todo: rework after we merge pr about profiles/reviews/in-progress
export function ProfileActivitySection({
	isOwnProfile,
	localeRegion = "en-US",
}: ProfileActivitySectionProps) {
	const activities = mockActivities;

	if (!activities || activities.length === 0) {
		return (
			<section className="flex flex-col gap-2">
				<h2 className="text-lg font-semibold">
					{m.profile_activity_section_title()}
				</h2>
				<p className="text-sm text-muted-foreground">
					{m.profile_activity_empty()}
				</p>
			</section>
		);
	}

	return (
		<section className="flex flex-col gap-2">
			<h2 className="text-lg font-semibold">
				{m.profile_activity_section_title()}
			</h2>
			<div className="flex flex-col gap-3">
				{activities.map((activity) => {
					return (
						<div
							key={activity.id}
							className="flex flex-row items-start gap-3 text-sm"
						>
							<div className="flex flex-col gap-0.5 flex-1">
								<div className="text-muted-foreground">
									<ActivityItemContent
										activity={activity}
										isOwnProfile={isOwnProfile}
									/>
								</div>
								<span className="text-xs text-muted-foreground/70">
									{formatDistanceToNow(activity.createdAt, localeRegion)}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
