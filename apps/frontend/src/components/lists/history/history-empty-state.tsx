import { Link } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

type MediaFilter = "all" | "movie" | "tv";

type HistoryEmptyStateProps = {
	filter: MediaFilter;
};

export function HistoryEmptyState({ filter }: HistoryEmptyStateProps) {
	const headerMessages = {
		all: m.history_toggle_no_result_all(),
		movie: m.history_toggle_no_result_movies(),
		tv: m.history_toggle_no_result_tv(),
	};

	const showMoviesLink = filter === "all" || filter === "movie";
	const showTvLink = filter === "all" || filter === "tv";

	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
			<p className="text-muted-foreground text-2xl">{headerMessages[filter]}</p>

			<p className="text-muted-foreground flex gap-1">
				{m.history_page_empty_cta_prefix()}

				{showMoviesLink ? (
					<Link
						to="/movies"
						className="text-primary underline hover:text-primary/80"
					>
						{m.history_page_link_movies()}
					</Link>
				) : null}

				{filter === "all" ? (
					<span>{m.history_page_empty_cta_separator()}</span>
				) : null}

				{showTvLink ? (
					<Link
						to="/tv"
						className="text-primary underline hover:text-primary/80"
					>
						{m.history_page_link_tv()}
					</Link>
				) : null}

				{m.history_page_empty_cta_followup()}
			</p>
		</div>
	);
}
