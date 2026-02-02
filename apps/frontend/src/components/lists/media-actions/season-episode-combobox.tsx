import { IconCheck, IconSelector } from "@tabler/icons-react";
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
	const [openSeason, setOpenSeason] = useState(false);
	const [openEpisode, setOpenEpisode] = useState(false);

	const availableEpisodes = selectedSeason
		? seasons.find((s) => s.season_number === Number(selectedSeason))
				?.episode_count || 0
		: 0;

	const handleSeasonSelect = (value: string) => {
		onSeasonChange(value === selectedSeason ? "" : value);
		onEpisodeChange("");
		setOpenSeason(false);
	};

	const handleEpisodeSelect = (value: string) => {
		onEpisodeChange(value === selectedEpisode ? "" : value);
		setOpenEpisode(false);
	};

	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="flex flex-col gap-2">
				<Label htmlFor="season">Watched up to Season</Label>
				<Popover open={openSeason} onOpenChange={setOpenSeason}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={openSeason}
							className="justify-between"
							type="button"
						>
							{selectedSeason ? `Season ${selectedSeason}` : "Select season"}
							<IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandInput placeholder="Search season..." />
							<CommandList>
								<CommandEmpty>No season found.</CommandEmpty>
								<CommandGroup>
									{seasons.map((s) => (
										<CommandItem
											key={s.season_number}
											value={s.season_number.toString()}
											onSelect={handleSeasonSelect}
										>
											<IconCheck
												className={cn(
													"mr-2 h-4 w-4",
													selectedSeason === s.season_number.toString()
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											Season {s.season_number}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="episode">Episode</Label>
				<Popover open={openEpisode} onOpenChange={setOpenEpisode}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={openEpisode}
							className="justify-between"
							type="button"
							disabled={!selectedSeason}
						>
							{selectedEpisode
								? `Episode ${selectedEpisode}`
								: "Select episode"}
							<IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandInput placeholder="Search episode..." />
							<CommandList>
								<CommandEmpty>No episode found.</CommandEmpty>
								<CommandGroup>
									{Array.from(
										{ length: availableEpisodes },
										(_, i) => i + 1,
									).map((ep) => (
										<CommandItem
											key={ep}
											value={ep.toString()}
											onSelect={handleEpisodeSelect}
										>
											<IconCheck
												className={cn(
													"mr-2 h-4 w-4",
													selectedEpisode === ep.toString()
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											Episode {ep}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
