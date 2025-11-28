import { useState } from "react";
import { Button } from "../ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";

interface PersonBiographyProps {
	biography: string;
}

export const PersonBiography = ({ biography }: PersonBiographyProps) => {
	const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

	if (!biography) {
		return <p></p>;
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
			<Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
				<CollapsibleTrigger asChild>
					<Button variant="link" size="sm" className="p-0">
						{isCollapsibleOpen ? "Show less" : "Show more"}
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<p className="whitespace-pre-line">{hiddenText}</p>
				</CollapsibleContent>
			</Collapsible>
		</>
	);
};
