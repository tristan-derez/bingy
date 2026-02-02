import { Link } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

type ListsEmptyStateProps = {
	isOwnProfile: boolean;
	username: string;
};

export function ListsEmptyState({
	isOwnProfile,
	username,
}: ListsEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 gap-4">
			<p className="text-muted-foreground">
				{isOwnProfile ? (
					<>
						{m.lists_empty_state_own()}{" "}
						<Link to="/lists/create" className="text-primary hover:underline">
							{m.lists_empty_state_own_cta()}
						</Link>
					</>
				) : (
					m.lists_empty_state_other({ username })
				)}
			</p>
		</div>
	);
}
