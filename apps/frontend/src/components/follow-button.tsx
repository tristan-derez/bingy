import { IconLoader, IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

interface FollowButtonProps {
	isFollowing?: boolean;
	isLoading?: boolean;
	onClick?: () => void;
}

export function FollowButton({
	isFollowing = false,
	isLoading = false,
	onClick,
}: FollowButtonProps) {
	return (
		<Button
			variant={isFollowing ? "secondary" : "default"}
			size="sm"
			onClick={onClick}
			disabled={isLoading}
			className="shrink-0"
		>
			{isLoading ? (
				<>
					<IconLoader className="animate-spin h-4 w-4 mr-1" />
					{m.profile_page_follow_button_loading()}
				</>
			) : isFollowing ? (
				<>
					<IconUserMinus className="h-4 w-4 mr-1" />
					{m.profile_page_unfollow_button()}
				</>
			) : (
				<>
					<IconUserPlus className="h-4 w-4 mr-1" />
					{m.profile_page_follow_button()}
				</>
			)}
		</Button>
	);
}
