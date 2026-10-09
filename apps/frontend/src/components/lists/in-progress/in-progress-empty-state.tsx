import { Link } from "@tanstack/react-router";
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
	username: string;
	isOwnProfile: boolean;
};

export function InProgressEmptyState({
	username,
	isOwnProfile,
}: InProgressEmptyStateProps) {
	const title = isOwnProfile
		? m.emtpy_inprogress_own_profile_title()
		: m.empty_inprogress_other_profile_title({ username });
	const description = isOwnProfile
		? m.empty_inprogress_own_profile_desc()
		: m.empty_inprogress_other_profile_desc({ username });

	return (
		<Empty className="min-h-100 w-full">
			<EmptyHeader>
				<EmptyTitle className="text-lg md:text-2xl">{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
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
