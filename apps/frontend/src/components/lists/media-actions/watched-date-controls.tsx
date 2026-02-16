import { IconCalendarWeekFilled } from "@tabler/icons-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { m } from "@/paraglide/messages";

interface WatchedDateControlProps {
	hasSpecificDate: boolean;
	unknownDate: boolean;
	watchedDate: Date;
	handleHasSpecificDateChange: (checked: boolean) => void;
	handleUnknownDateChange: (checked: boolean) => void;
	setWatchedDate: (date: Date) => void;
}

export function WatchedDateControl({
	hasSpecificDate,
	unknownDate,
	watchedDate,
	handleHasSpecificDateChange,
	handleUnknownDateChange,
	setWatchedDate,
}: WatchedDateControlProps) {
	return (
		<div className="flex flex-col lg:flex-row gap-3">
			<div className="flex items-center gap-2">
				<Checkbox
					id="hasSpecificDate"
					checked={hasSpecificDate}
					onCheckedChange={(c) => handleHasSpecificDateChange(c === true)}
				/>
				<Label htmlFor="watchedToday" className="text-sm">
					{m.log_review_dialog_seen_specific_date()}
				</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="text-sm"
							disabled={unknownDate}
						>
							<IconCalendarWeekFilled />
							{format(watchedDate, "MMMM d, yyyy")}
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<Calendar
							mode="single"
							selected={watchedDate}
							onSelect={(date) => date && setWatchedDate(date)}
							className="rounded-xl border w-full"
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					id="unknownDate"
					checked={unknownDate}
					onCheckedChange={(c) => handleUnknownDateChange(c === true)}
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
