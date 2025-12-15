import { Link } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

type MediaFilter = "all" | "movie" | "tv";

type WatchlistEmptyStateProps = {
	filter: MediaFilter;
};

export function WatchlistEmptyState({ filter }: WatchlistEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
			<p className="text-muted-foreground text-2xl">
				{filter === "all"
					? m.watchlist_toggle_no_result_all()
					: filter === "movie"
						? m.watchlist_toggle_no_result_movies()
						: m.watchlist_toggle_no_result_tv()}
			</p>
			<p className="text-muted-foreground flex gap-1">
				{filter === "all" ? (
					<>
						{m.watchlist_page_empty_cta_prefix()}
						<Link
							to="/movies"
							className="text-primary underline hover:text-primary/80"
						>
							{m.watchlist_page_link_movies()}
						</Link>{" "}
						{m.watchlist_page_empty_cta_separator()}{" "}
						<Link
							to="/tv"
							className="text-primary underline hover:text-primary/80"
						>
							{m.watchlist_page_link_tv()}
						</Link>
					</>
				) : filter === "movie" ? (
					<>
						{m.watchlist_page_empty_cta_prefix()}
						<Link
							to="/movies"
							className="text-primary underline hover:text-primary/80"
						>
							{m.watchlist_page_link_movies()}
						</Link>
					</>
				) : (
					<>
						{m.watchlist_page_empty_cta_prefix()}
						<Link
							to="/tv"
							className="text-primary underline hover:text-primary/80"
						>
							{m.watchlist_page_link_tv()}
						</Link>
					</>
				)}
				{m.watchlist_page_empty_cta_followup()}
			</p>
		</div>
	);
}
