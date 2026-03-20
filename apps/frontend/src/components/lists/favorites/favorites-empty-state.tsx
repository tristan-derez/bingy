import { Link } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

type MediaFilter = "all" | "movie" | "tv";

type FavoritesEmptyStateProps = {
	filter: MediaFilter;
	username: string;
	isOwnProfile: boolean;
};

export function FavoritesEmptyState({ filter }: FavoritesEmptyStateProps) {
	const headerMessages = {
		all: m.favorites_toggle_no_result_all(),
		movie: m.favorites_toggle_no_result_movies(),
		tv: m.favorites_toggle_no_result_tv(),
	};

	const showMoviesLink = filter === "all" || filter === "movie";
	const showTvLink = filter === "all" || filter === "tv";

	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
			<p className="text-muted-foreground text-2xl">{headerMessages[filter]}</p>

			<p className="text-muted-foreground flex gap-1">
				{m.favorites_page_empty_cta_prefix()}

				{showMoviesLink ? (
					<Link
						to="/movies"
						className="text-primary underline hover:text-primary/80"
					>
						{m.favorites_page_link_movies()}
					</Link>
				) : null}

				{filter === "all" ? (
					<span>{m.favorites_page_empty_cta_separator()}</span>
				) : null}

				{showTvLink ? (
					<Link
						to="/tv"
						className="text-primary underline hover:text-primary/80"
					>
						{m.favorites_page_link_tv()}
					</Link>
				) : null}

				{m.favorites_page_empty_cta_followup()}
			</p>
		</div>
	);
}
