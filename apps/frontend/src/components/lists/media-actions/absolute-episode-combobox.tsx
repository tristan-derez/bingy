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

interface AbsoluteEpisodeComboboxProps {
	totalEpisodes: number;
	selectedEpisode: string;
	onEpisodeChange: (episode: string) => void;
}

export function AbsoluteEpisodeCombobox({
	totalEpisodes,
	selectedEpisode,
	onEpisodeChange,
}: AbsoluteEpisodeComboboxProps) {
	const episodes = useMemo(
		() =>
			Array.from({ length: totalEpisodes }, (_, i) => {
				const num = (i + 1).toString();
				return { value: num, label: num };
			}),
		[totalEpisodes],
	);

	const [inputValue, setInputValue] = useState(selectedEpisode);
	const [isOpen, setIsOpen] = useState(false);

	const shouldShowClear = Boolean(selectedEpisode);

	const filteredEpisodes = useMemo(() => {
		if (!inputValue) return episodes;
		return episodes.filter((ep) => ep.label.includes(inputValue));
	}, [episodes, inputValue]);

	return (
		<div className="flex flex-col gap-2">
			<Label>{m.log_review_dialog_absolute_episode_combobox_label()}</Label>
			<Combobox
				open={isOpen}
				onOpenChange={setIsOpen}
				value={selectedEpisode}
				onValueChange={(val) => {
					onEpisodeChange(val ?? "");
					if (val) setInputValue(val);
				}}
				inputValue={inputValue}
				onInputValueChange={setInputValue}
			>
				<ComboboxInput
					placeholder={m.log_review_dialog_absolute_episode_combobox_placeholder()}
					showClear={shouldShowClear}
				/>

				<ComboboxContent>
					{filteredEpisodes.length === 0 ? (
						<ComboboxEmpty>
							{m.log_review_dialog_absolute_episode_combobox_no_result()}
						</ComboboxEmpty>
					) : null}

					<ComboboxList>
						{filteredEpisodes.map((episode) => (
							<ComboboxItem key={episode.value} value={episode.value}>
								{episode.label}
							</ComboboxItem>
						))}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		</div>
	);
}
