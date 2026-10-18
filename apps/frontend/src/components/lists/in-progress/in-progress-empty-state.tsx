import { Link } from "@tanstack/react-router";
import type { InProgressFilter } from "@/api/in-progress";
import { SearchCommand } from "@/components/search/search-command";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { m } from "@/paraglide/messages";

type InProgressEmptyStateProps = {
	filter: InProgressFilter;
	username: string;
	isOwnProfile: boolean;
};

export function InProgressEmptyState({
	filter,
	username,
	isOwnProfile,
}: InProgressEmptyStateProps) {
	const titles = isOwnProfile
		? {
				all: m.emtpy_inprogress_own_profile_title(),
				watching: m.in_progress_no_result_watching_own(),
				on_hold: m.in_progress_no_result_on_hold_own(),
				dropped: m.in_progress_no_result_dropped_own(),
				completed: m.in_progress_no_result_completed_own(),
			}
		: {
				all: m.empty_inprogress_other_profile_title({ username }),
				watching: m.in_progress_no_result_watching_other({ username }),
				on_hold: m.in_progress_no_result_on_hold_other({ username }),
				dropped: m.in_progress_no_result_dropped_other({ username }),
				completed: m.in_progress_no_result_completed_other({ username }),
			};

	const descriptions = isOwnProfile
		? {
				all: m.empty_inprogress_own_profile_desc(),
				watching: m.in_progress_no_result_watching_desc_own(),
				on_hold: m.in_progress_no_result_on_hold_desc_own(),
				dropped: m.in_progress_no_result_dropped_desc_own(),
				completed: m.in_progress_no_result_completed_desc_own(),
			}
		: {
				all: m.empty_inprogress_other_profile_desc({ username }),
				watching: m.in_progress_no_result_watching_desc_other({ username }),
				on_hold: m.in_progress_no_result_on_hold_desc_other({ username }),
				dropped: m.in_progress_no_result_dropped_desc_other({ username }),
				completed: m.in_progress_no_result_completed_desc_other({ username }),
			};

	return (
		<Empty className="min-h-100 w-full">
			<EmptyHeader>
				<EmptyTitle className="text-lg md:text-2xl">{titles[filter]}</EmptyTitle>
				<EmptyDescription>{descriptions[filter]}</EmptyDescription>
			</EmptyHeader>
			{isOwnProfile ? (
				<EmptyContent className="w-full">
					<Link to="/tv">
						<Button className="w-35">{m.empty_inprogress_cta()}</Button>
					</Link>
					<SearchCommand
						title={m.form_search_placeholder()}
						showKbdHelper
						showButton
					/>
				</EmptyContent>
			) : null}
		</Empty>
	);
}
