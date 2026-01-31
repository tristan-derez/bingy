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
	bg?: string;
}

export const MediaOverview = ({ overview, bg }: MediaOverviewProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const textColor = bg ? "text-dark-card-foreground" : "text-foreground";

	if (!overview) {
		return <p className={textColor}>{m.overview_none()}</p>;
	}

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
			<p className={`w-full xl:w-2/3 whitespace-pre-line ${textColor}`}>
				{overview}
			</p>
		);
	}

	const displayText = overview.slice(0, lastPeriod + 1);

	return (
		<>
			<p className={`w-full xl:w-2/3 whitespace-pre-line ${textColor}`}>
				{displayText}
			</p>
			<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
				<div className={isExpanded ? "hidden" : ""}>
					<CollapsibleTrigger>
						<Button variant="link" size="sm" className={`p-0 ${textColor}`}>
							{m.btn_show_more()}
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<p className={`w-full xl:w-2/3 whitespace-pre-line ${textColor}`}>
						{hiddenText}
					</p>
				</CollapsibleContent>
			</Collapsible>
		</>
	);
};
