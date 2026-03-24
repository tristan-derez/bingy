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
	selectedEpisode: number | null;
	onEpisodeChange: (episode: number | null) => void;
}

export function AbsoluteEpisodeCombobox({
	totalEpisodes,
	selectedEpisode,
	onEpisodeChange,
}: AbsoluteEpisodeComboboxProps) {
	const episodes = useMemo(
		() => Array.from({ length: totalEpisodes }, (_, i) => i + 1),
		[totalEpisodes],
	);

	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-col gap-2">
			<Label>{m.log_review_dialog_absolute_episode_combobox_label()}</Label>
			<Combobox
				open={isOpen}
				onOpenChange={setIsOpen}
				value={selectedEpisode}
				onValueChange={(val) => {
					onEpisodeChange(val ?? null);
				}}
			>
				<ComboboxInput
					placeholder={m.log_review_dialog_absolute_episode_combobox_placeholder()}
					showClear={!!selectedEpisode}
				/>

				<ComboboxContent>
					{episodes.length === 0 ? (
						<ComboboxEmpty>
							{m.log_review_dialog_absolute_episode_combobox_no_result()}
						</ComboboxEmpty>
					) : null}

					<ComboboxList>
						{episodes.map((episodeNum) => (
							<ComboboxItem key={episodeNum} value={episodeNum.toString()}>
								{episodeNum}
							</ComboboxItem>
						))}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		</div>
	);
}
