import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { m } from "@/paraglide/messages";

interface PersonBiographyProps {
	biography: string;
}

export const PersonBiography = ({ biography }: PersonBiographyProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!biography) {
		return <p>{m.person_biography_missing()}</p>;
	}

	const maxInitialLength = 400;
	const lines = biography.split("\n");
	const [firstLine, ...rest] = lines;
	const remainingText = rest.join("\n");

	const needsCollapse = remainingText || firstLine.length > maxInitialLength;

	if (!needsCollapse) {
		return <p>{firstLine}</p>;
	}

	let displayText: string;
	let hiddenText: string;

	if (remainingText) {
		displayText = firstLine;
		hiddenText = remainingText;
	} else {
		const textUpToLimit = firstLine.slice(0, maxInitialLength);
		const lastSentenceEnd = Math.max(
			textUpToLimit.lastIndexOf(". "),
			textUpToLimit.lastIndexOf("! "),
			textUpToLimit.lastIndexOf("? "),
		);

		if (lastSentenceEnd > 0) {
			displayText = firstLine.slice(0, lastSentenceEnd + 1);
			hiddenText = firstLine.slice(lastSentenceEnd + 1).trim();
		} else {
			displayText = firstLine.slice(0, maxInitialLength);
			hiddenText = firstLine.slice(maxInitialLength);
		}
	}

	return (
		<>
			<p className="whitespace-pre-line">{displayText}</p>
			<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
				<div className={isExpanded ? "hidden" : ""}>
					<CollapsibleTrigger
						render={
							<Button variant="link" size="sm" className="p-0">
								{m.btn_see_more()}
							</Button>
						}
					></CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<p className="whitespace-pre-line pt-2">{hiddenText}</p>
				</CollapsibleContent>
			</Collapsible>
		</>
	);
};
