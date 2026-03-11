import { Link } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";
import type { VisibilityFilter } from "./lists-container";

type ListsEmptyStateProps = {
	isOwnProfile: boolean;
	username: string;
	filter: VisibilityFilter;
};

export function ListsEmptyState({
	isOwnProfile,
	username,
	filter,
}: ListsEmptyStateProps) {
	const messageMap: Record<VisibilityFilter, () => string> = {
		all: m.lists_empty_state_own_all,
		public: m.lists_empty_state_own_public,
		private: m.lists_empty_state_own_private,
		limited: m.lists_empty_state_own_limited,
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
			<p className="text-muted-foreground text-center">
				{isOwnProfile ? (
					<>
						{messageMap[filter]()}{" "}
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
