import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
	const [open, setOpen] = useState(false);

	const episodes = Array.from({ length: totalEpisodes }, (_, i) => ({
		value: (i + 1).toString(),
		label: `Episode ${i + 1}`,
	}));

	return (
		<div className="flex flex-col gap-2">
			<Label>Episode</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="justify-between"
					>
						{selectedEpisode
							? `Episode ${selectedEpisode}`
							: "Select episode..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search episode..." />
						<CommandList>
							<CommandEmpty>No episode found.</CommandEmpty>
							<CommandGroup>
								{episodes.map((episode) => (
									<CommandItem
										key={episode.value}
										value={episode.value}
										onSelect={(currentValue) => {
											onEpisodeChange(
												currentValue === selectedEpisode ? "" : currentValue,
											);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedEpisode === episode.value
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										{episode.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
