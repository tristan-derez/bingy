import { WatchlistToggleButton } from "../watchlist/watchlist-toggle-button";
import { FavoriteToggleButton } from "./favorite-toggle-button";
import { WatchToggleButton } from "./watch-toggle-button";

interface MediaActionBarProps {
	movie?: {
		mediaType?: string;
		id: number;
		title: string;
	};
	tvShow?: {
		mediaType?: string;
		id: number;
		name: string;
	};
	username: string;
}

export const MediaActionBar = ({
	movie,
	tvShow,
	username,
}: MediaActionBarProps) => {
	const passProps = { movie, tvShow, username };

	return (
		<div className="flex flex-row p-0 gap-4 rounded-md bg-card border px-4 py-2 items-center justify-around lg:justify-center">
			<WatchToggleButton {...passProps} />
			<FavoriteToggleButton {...passProps} />
			<WatchlistToggleButton {...passProps} />
		</div>
	);
};
