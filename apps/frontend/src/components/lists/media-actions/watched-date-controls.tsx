import { IconCalendarWeekFilled } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

interface WatchedDateControlProps {
	hasSpecificDate: boolean;
	watchedDate: Date;
	handleHasSpecificDateChange: (checked: boolean) => void;
	setWatchedDate: (date: Date) => void;
}

export function WatchedDateControl({
	hasSpecificDate,
	watchedDate,
	handleHasSpecificDateChange,
	setWatchedDate,
}: WatchedDateControlProps) {
	const localeRegion = useAtomValue(localeRegionAtom);

	return (
		<div className="flex flex-col lg:flex-row gap-3">
			<div className="flex items-center gap-2">
				<Checkbox
					id="hasSpecificDate"
					checked={hasSpecificDate}
					onCheckedChange={handleHasSpecificDateChange}
				/>
				<Label htmlFor="watchedToday" className="text-sm">
					{m.log_review_dialog_seen_specific_date()}
				</Label>
				<Popover>
					<PopoverTrigger
						render={
							<Button
								variant="outline"
								size="sm"
								className="text-sm"
								disabled={!hasSpecificDate}
							>
								<IconCalendarWeekFilled />
								{watchedDate.toLocaleDateString(localeRegion, {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</Button>
						}
					></PopoverTrigger>
					<PopoverContent className="w-60">
						<Calendar
							mode="single"
							selected={watchedDate}
							onSelect={(date) => date && setWatchedDate(date)}
							className="w-full"
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					id="unknownDate"
					checked={!hasSpecificDate}
					onCheckedChange={(c) => handleHasSpecificDateChange(!c)}
				/>
				<Label
					htmlFor="unknownDate"
					className="text-sm font-normal cursor-pointer"
				>
					{m.log_review_dialog_seen_before()}
				</Label>
			</div>
		</div>
	);
}
