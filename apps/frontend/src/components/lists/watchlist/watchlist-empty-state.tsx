import { Link } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

type MediaFilter = "all" | "movie" | "tv";

type WatchlistEmptyStateProps = {
	filter: MediaFilter;
};

export function WatchlistEmptyState({ filter }: WatchlistEmptyStateProps) {
	const headerMessages = {
		all: m.watchlist_toggle_no_result_all(),
		movie: m.watchlist_toggle_no_result_movies(),
		tv: m.watchlist_toggle_no_result_tv(),
	};

	const showMoviesLink = filter === "all" || filter === "movie";
	const showTvLink = filter === "all" || filter === "tv";

	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
			<p className="text-muted-foreground text-2xl">{headerMessages[filter]}</p>

			<p className="text-muted-foreground text-center text-sm sm:text-base">
				{m.watchlist_page_empty_cta_prefix()}{" "}
				{showMoviesLink && (
					<Link
						to="/movies"
						className="text-primary underline hover:text-primary/80"
					>
						{m.watchlist_page_link_movies()}
					</Link>
				)}
				{filter === "all" && <> {m.watchlist_page_empty_cta_separator()} </>}
				{showTvLink && (
					<Link
						to="/tv"
						className="text-primary underline hover:text-primary/80"
					>
						{m.watchlist_page_link_tv()}
					</Link>
				)}{" "}
				{m.watchlist_page_empty_cta_followup()}
			</p>
		</div>
	);
}
