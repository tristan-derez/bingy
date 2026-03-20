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
import { useMediaQuery } from "@/integrations/media-query";
import { m } from "@/paraglide/messages";

type MediaFilter = "all" | "movie" | "tv";

type FavoritesEmptyStateProps = {
	filter: MediaFilter;
	username: string;
	isOwnProfile: boolean;
};

export function FavoritesEmptyState({
	filter,
	username,
	isOwnProfile,
}: FavoritesEmptyStateProps) {
	const headerMessages = isOwnProfile
		? {
				all: m.favorites_toggle_no_result_all(),
				movie: m.favorites_toggle_no_result_movies(),
				tv: m.favorites_toggle_no_result_tv(),
			}
		: {
				all: m.favorites_toggle_no_result_all_other(),
				movie: m.favorites_toggle_no_result_movies_other(),
				tv: m.favorites_toggle_no_result_tv_other(),
			};

	const headerDesc = isOwnProfile
		? {
				all: m.favorites_toggle_no_result_all_desc(),
				movie: m.favorites_toggle_no_result_movies_desc(),
				tv: m.favorites_toggle_no_result_tv_desc(),
			}
		: {
				all: m.favorites_toggle_no_result_all_desc_other({
					username: username,
				}),
				movie: m.favorites_toggle_no_result_movies_desc_other({
					username: username,
				}),
				tv: m.favorites_toggle_no_result_tv_desc_other({
					username: username,
				}),
			};

	const isMobile = useMediaQuery("(pointer: coarse)");

	return (
		<Empty className="min-h-[400px] w-full">
			<EmptyHeader>
				<EmptyTitle className="text-lg md:text-2xl">
					{headerMessages[filter]}
				</EmptyTitle>
				<EmptyDescription>{headerDesc[filter]}</EmptyDescription>
			</EmptyHeader>
			{isOwnProfile ? (
				<EmptyContent className="w-full">
					<div className="flex flex-row justify-center gap-1 w-40">
						{filter === "all" || filter === "movie" ? (
							<Link to="/movies">
								<Button className="w-35">{m.btn_explore_movies()}</Button>
							</Link>
						) : null}
						{filter === "all" || filter === "tv" ? (
							<Link to="/tv">
								<Button className="w-35">{m.btn_explore_tv()}</Button>
							</Link>
						) : null}
					</div>
					<SearchCommand
						title={m.btn_form_search()}
						className={isMobile ? "w-50 justify-center" : "w-50"}
						showKbdHelper
						showButton
					/>
				</EmptyContent>
			) : null}
		</Empty>
	);
}
