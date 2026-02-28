import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { m } from "@/paraglide/messages";

interface MediaOverviewProps {
	overview: string;
}

export const MediaOverview = ({ overview }: MediaOverviewProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!overview) return null;

	const searchWindow = 350;
	const textToSearch = overview.slice(
		0,
		Math.min(searchWindow, overview.length),
	);
	const lastPeriod = textToSearch.lastIndexOf(".");

	// Show full text if it's short, no period found, or nothing meaningful after the period
	const hiddenText =
		lastPeriod > 0 ? overview.slice(lastPeriod + 1).trim() : "";
	if (overview.length <= 250 || lastPeriod <= 0 || !hiddenText) {
		return (
			<p className="w-full text-sm xl:w-6/7 whitespace-pre-line text-foreground text-pretty">
				{overview}
			</p>
		);
	}

	const displayText = overview.slice(0, lastPeriod + 1);

	return (
		<div className="text-foreground text-sm xl:w-6/7">
			<p className="w-full whitespace-pre-line leading-relaxed text-pretty">
				{displayText}
			</p>
			<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
				<div className={isExpanded ? "hidden" : ""}>
					<CollapsibleTrigger
						render={
							<Button variant="link" size="sm" className="p-0">
								{m.btn_show_more()}
							</Button>
						}
					></CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<p className="w-full whitespace-pre-line pt-2 text-pretty">
						{hiddenText}
					</p>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};
