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
	selectedSeason: string;
	selectedEpisode: string;
	onSeasonChange: (value: string) => void;
	onEpisodeChange: (value: string) => void;
}

export function SeasonEpisodeCombobox({
	seasons,
	selectedSeason,
	selectedEpisode,
	onSeasonChange,
	onEpisodeChange,
}: SeasonEpisodeComboboxProps) {
	const [seasonInputValue, setSeasonInputValue] = useState(selectedSeason);
	const [episodeInputValue, setEpisodeInputValue] = useState(selectedEpisode);
	const [seasonOpen, setSeasonOpen] = useState(false);
	const [episodeOpen, setEpisodeOpen] = useState(false);

	const seasonNumbers = useMemo(
		() => seasons.map((s) => s.season_number),
		[seasons],
	);

	const availableEpisodes = selectedSeason
		? seasons.find((s) => s.season_number === Number(selectedSeason))
				?.episode_count || 0
		: 0;

	const episodeNumbers = useMemo(
		() => Array.from({ length: availableEpisodes }, (_, i) => i + 1),
		[availableEpisodes],
	);

	const filteredSeasons = useMemo(() => {
		if (!seasonInputValue) return seasonNumbers;
		return seasonNumbers.filter((num) =>
			num.toString().includes(seasonInputValue),
		);
	}, [seasonNumbers, seasonInputValue]);

	const filteredEpisodes = useMemo(() => {
		if (!episodeInputValue) return episodeNumbers;
		return episodeNumbers.filter((num) =>
			num.toString().includes(episodeInputValue),
		);
	}, [episodeNumbers, episodeInputValue]);

	return (
		<div className="flex flex-col gap-4 lg:flex-row">
			<div className="flex flex-col gap-2 flex-1">
				<Label>{m.log_review_dialog_season_combobox_label()}</Label>
				<Combobox
					open={seasonOpen}
					onOpenChange={setSeasonOpen}
					value={selectedSeason}
					onValueChange={(val) => {
						const newValue = val ?? "";
						onSeasonChange(newValue);
						if (newValue !== selectedSeason) {
							onEpisodeChange("");
						}
						if (val) setSeasonInputValue(val);
					}}
					inputValue={seasonInputValue}
					onInputValueChange={setSeasonInputValue}
				>
					<ComboboxInput
						placeholder={m.log_review_dialog_season_combobox_placeholder()}
						showClear={!!selectedSeason}
					/>
					<ComboboxContent>
						{filteredSeasons.length === 0 ? (
							<ComboboxEmpty>
								{m.log_review_dialog_season_combobox_no_result()}
							</ComboboxEmpty>
						) : null}
						<ComboboxList>
							{filteredSeasons.map((seasonNum) => (
								<ComboboxItem key={seasonNum} value={seasonNum.toString()}>
									{seasonNum}
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
						onEpisodeChange(val ?? "");
						if (val) setEpisodeInputValue(val);
					}}
					inputValue={episodeInputValue}
					onInputValueChange={setEpisodeInputValue}
					disabled={!selectedSeason}
				>
					<ComboboxInput
						placeholder={m.log_review_dialog_episode_combobox_placeholder()}
						showClear={!!selectedEpisode}
						disabled={!selectedSeason}
					/>
					<ComboboxContent>
						{filteredEpisodes.length === 0 ? (
							<ComboboxEmpty>
								{m.log_review_dialog_episode_combobox_no_result()}
							</ComboboxEmpty>
						) : null}
						<ComboboxList>
							{filteredEpisodes.map((episodeNum) => (
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
