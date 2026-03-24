import { useMemo, useState } from "react";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { m } from "@/paraglide/messages";

interface Season {
	season_number: number;
	episode_count: number;
}

interface SeasonEpisodeComboboxProps {
	seasons: Season[];
	selectedSeason: number | null;
	selectedEpisode: number | null;
	onSeasonChange: (value: number | null) => void;
	onEpisodeChange: (value: number | null) => void;
	lastAired?: { seasonNumber: number; episodeNumber: number } | null;
}

export function SeasonEpisodeCombobox({
	seasons,
	selectedSeason,
	selectedEpisode,
	onSeasonChange,
	onEpisodeChange,
	lastAired,
}: SeasonEpisodeComboboxProps) {
	const [seasonOpen, setSeasonOpen] = useState(false);
	const [episodeOpen, setEpisodeOpen] = useState(false);

	// Only show seasons that have aired (≤ lastAired.seasonNumber)
	const availableSeasons = useMemo(() => {
		if (!lastAired) return [];
		return seasons.filter((s) => s.season_number <= lastAired.seasonNumber);
	}, [seasons, lastAired]);

	// Lookup for total episodes per season (for earlier seasons)
	const seasonEpisodeCountMap = useMemo(
		() => new Map(seasons.map((s) => [s.season_number, s.episode_count])),
		[seasons],
	);

	// Helper to get max selectable episode for a season
	const getMaxEpisode = (seasonNum: number): number => {
		if (!lastAired) return 0;
		if (seasonNum < lastAired.seasonNumber) {
			// All episodes of this season have aired
			return seasonEpisodeCountMap.get(seasonNum) ?? 0;
		} else if (seasonNum === lastAired.seasonNumber) {
			// Only up to the last aired episode
			return lastAired.episodeNumber;
		}
		return 0;
	};

	// Number of episodes available for the selected season
	const availableEpisodes = useMemo(() => {
		if (!selectedSeason) return 0;
		const seasonNum = Number(selectedSeason);
		return getMaxEpisode(seasonNum);
	}, [selectedSeason, lastAired, seasonEpisodeCountMap]);

	const episodeNumbers = useMemo(
		() => Array.from({ length: availableEpisodes }, (_, i) => i + 1),
		[availableEpisodes],
	);

	return (
		<div className="flex flex-col gap-4 lg:flex-row">
			<div className="flex flex-col gap-2 flex-1">
				<Label>{m.log_review_dialog_season_combobox_label()}</Label>
				<Combobox
					open={seasonOpen}
					onOpenChange={setSeasonOpen}
					value={selectedSeason}
					onValueChange={(val) => {
						const newValue = val ?? null;
						onSeasonChange(newValue);
						if (newValue !== selectedSeason) {
							onEpisodeChange(null);
						}
					}}
				>
					<ComboboxInput
						placeholder={m.log_review_dialog_season_combobox_placeholder()}
						showClear={!!selectedSeason}
					/>
					<ComboboxContent>
						{availableSeasons.length === 0 ? (
							<ComboboxEmpty>
								{m.log_review_dialog_season_combobox_no_result()}
							</ComboboxEmpty>
						) : null}
						<ComboboxList>
							{availableSeasons.map((season) => (
								<ComboboxItem
									key={season.season_number}
									value={season.season_number.toString()}
								>
									{season.season_number}
								</ComboboxItem>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>

			<div className="flex flex-col gap-2 flex-1">
				<Label>{m.log_review_dialog_episode_combobox_label()}</Label>
				<Combobox
					open={episodeOpen}
					onOpenChange={setEpisodeOpen}
					value={selectedEpisode}
					onValueChange={(val) => {
						onEpisodeChange(val ?? null);
					}}
					disabled={!selectedSeason || availableEpisodes === 0}
				>
					<ComboboxInput
						placeholder={m.log_review_dialog_episode_combobox_placeholder()}
						showClear={!!selectedEpisode}
						disabled={!selectedSeason || availableEpisodes === 0}
					/>
					<ComboboxContent>
						{episodeNumbers.length === 0 ? (
							<ComboboxEmpty>
								{m.log_review_dialog_episode_combobox_no_result()}
							</ComboboxEmpty>
						) : null}
						<ComboboxList>
							{episodeNumbers.map((episodeNum) => (
								<ComboboxItem key={episodeNum} value={episodeNum.toString()}>
									{episodeNum}
								</ComboboxItem>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		</div>
	);
}
