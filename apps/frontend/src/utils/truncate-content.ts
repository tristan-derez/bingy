import type { Pretty } from "shared";

type TruncatedContentResp = Pretty<{
	shouldTruncate: boolean;
	displayText: string;
	hiddenText: string;
}>;

export const getTruncatedContent = (
	overview: string,
	searchWindow: number = 500,
): TruncatedContentResp => {
	const minHiddenLength = 50;

	if (!overview || overview.length <= searchWindow + minHiddenLength) {
		return { shouldTruncate: false, displayText: overview, hiddenText: "" };
	}

	const searchText = overview.slice(0, searchWindow);

	const findLastMatch = (text: string, chars: string[]): number => {
		return Math.max(...chars.map((c) => text.lastIndexOf(c)));
	};

	const lastSentenceEnd = findLastMatch(searchText, [".", "!", "?"]);
	const lastOtherPunct = findLastMatch(searchText, [";", ":", "—", "–", "-"]);

	let cutPosition: number;
	if (lastSentenceEnd !== -1) {
		cutPosition = lastSentenceEnd + 1;
	} else if (lastOtherPunct !== -1) {
		cutPosition = lastOtherPunct + 1;
	} else {
		// no punctuation found, find last space to avoid cutting words
		const lastSpace = searchText.lastIndexOf(" ");
		cutPosition = lastSpace !== -1 ? lastSpace : searchWindow;
	}

	return {
		shouldTruncate: true,
		displayText: overview.slice(0, cutPosition).trim(),
		hiddenText: overview.slice(cutPosition),
	};
};
