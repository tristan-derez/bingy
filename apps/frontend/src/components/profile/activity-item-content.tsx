import { Link } from "@tanstack/react-router";
import type { ActivityItem } from "@/components/profile/profile-activity-section";
import { m } from "@/paraglide/messages";
import { getListLink, getMediaLink, getStars } from "@/utils/utils";

type ActivityItemContentProps = {
	activity: ActivityItem;
	isOwnProfile: boolean;
};

export function ActivityItemContent({
	activity,
	isOwnProfile,
}: ActivityItemContentProps) {
	const usernameLink = `/@${activity.username}`;
	const mediaLink = getMediaLink(activity.mediaId, activity.mediaType);
	const targetUsernameLink = activity.targetUsername
		? `/@${activity.targetUsername}`
		: null;
	const listLink = getListLink(activity.username, activity.listSlug);
	const usernameDisplay = isOwnProfile
		? m.profile_activity_you()
		: activity.username;
	const ownProfileToString = isOwnProfile ? "true" : "false";

	switch (activity.type) {
		case "added_to_watchlist":
			return (
				<>
					<Link
						to={usernameLink}
						className="hover:text-foreground transition-colors font-medium"
					>
						{usernameDisplay}
					</Link>
					{m.profile_activity_action_added_to_watchlist({
						isOwnProfile: ownProfileToString,
					})}
					{mediaLink ? (
						<Link
							to={mediaLink}
							className="hover:text-foreground transition-colors font-medium"
						>
							{activity.mediaTitle}
						</Link>
					) : null}
					<span className="text-muted-foreground">
						{m.profile_activity_added_to_watchlist({
							isOwnProfile: ownProfileToString,
						})}
					</span>
				</>
			);

		case "added_to_favorites":
			return (
				<>
					<Link
						to={usernameLink}
						className="hover:text-foreground transition-colors font-medium"
					>
						{usernameDisplay}
					</Link>
					{m.profile_activity_action_added_to_favorites({
						isOwnProfile: ownProfileToString,
					})}
					{mediaLink ? (
						<Link
							to={mediaLink}
							className="hover:text-foreground transition-colors font-medium"
						>
							{activity.mediaTitle}
						</Link>
					) : null}
					<span className="text-muted-foreground">
						{m.profile_activity_added_to_favorites({
							isOwnProfile: ownProfileToString,
						})}
					</span>
				</>
			);

		case "watched":
			return (
				<>
					<Link
						to={usernameLink}
						className="hover:text-foreground transition-colors font-medium"
					>
						{usernameDisplay}
					</Link>
					{m.profile_activity_action_watched({
						isOwnProfile: ownProfileToString,
					})}
					{mediaLink && (
						<Link
							to={mediaLink}
							className="hover:text-foreground transition-colors font-medium"
						>
							{activity.mediaTitle}
						</Link>
					)}
					{activity.rating && (
						<span className="text-brand font-medium ml-1">
							{getStars(activity.rating)}
						</span>
					)}
				</>
			);

		case "followed_user":
			return (
				<>
					<Link
						to={usernameLink}
						className="hover:text-foreground transition-colors font-medium"
					>
						{usernameDisplay}
					</Link>
					{m.profile_activity_action_followed({
						isOwnProfile: isOwnProfile ? "true" : "false",
					})}
					{targetUsernameLink && (
						<Link
							to={targetUsernameLink}
							className="hover:text-foreground transition-colors font-medium"
						>
							{activity.targetUsername}
						</Link>
					)}
				</>
			);

		case "rated":
			return (
				<>
					<Link
						to={usernameLink}
						className="hover:text-foreground transition-colors font-medium"
					>
						{usernameDisplay}
					</Link>
					{m.profile_activity_action_rated({
						isOwnProfile: isOwnProfile ? "true" : "false",
					})}
					{mediaLink && (
						<Link
							to={mediaLink}
							className="hover:text-foreground transition-colors font-medium"
						>
							{activity.mediaTitle}
						</Link>
					)}
					{activity.rating && (
						<span className="text-brand font-medium ml-1">
							{getStars(activity.rating)}
						</span>
					)}
				</>
			);

		case "created_list":
			return (
				<>
					<Link
						to={usernameLink}
						className="hover:text-foreground transition-colors font-medium"
					>
						{usernameDisplay}
					</Link>
					{m.profile_activity_action_created_list({
						isOwnProfile: isOwnProfile ? "true" : "false",
					})}
					{listLink ? (
						<Link
							to={listLink}
							className="hover:text-foreground transition-colors font-medium"
						>
							{activity.listName}
						</Link>
					) : (
						<span className="font-medium">{activity.listName}</span>
					)}
				</>
			);

		default:
			return null;
	}
}
