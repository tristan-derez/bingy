export const formatEpisode = (
	season: number,
	episode: number,
	absoluteEpisode?: number,
) => {
	if (absoluteEpisode) {
		return `EP${absoluteEpisode}`;
	}
	return `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`;
};
