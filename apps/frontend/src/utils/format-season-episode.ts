export const formatEpisode = (season: number, episode: number) => {
	return `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`;
};
