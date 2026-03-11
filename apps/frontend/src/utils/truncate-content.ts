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
	const sentenceEnders = /[.!?]/;
	const otherPunct = /[;:—–-]/;

	// no need to truncate if the text is less or equal than searchWindow and minHiddenLength
	if (!overview || overview.length <= searchWindow + minHiddenLength) {
		return { shouldTruncate: false, displayText: overview, hiddenText: "" };
	}

	const searchText = overview.slice(0, searchWindow);

	// find the last index of any sentence ender
	let cutPosition = -1;
	for (let i = searchText.length - 1; i >= 0; i--) {
		if (sentenceEnders.test(searchText[i])) {
			cutPosition = i + 1;
			break;
		}
	}

	// fallback: find the last index of other punctuation
	if (cutPosition === -1) {
		for (let i = searchText.length - 1; i >= 0; i--) {
			if (otherPunct.test(searchText[i])) {
				cutPosition = i + 1;
				break;
			}
		}
	}

	// final fallback: if no punctuation at all, just cut at the window
	if (cutPosition === -1) {
		cutPosition = searchWindow;
	}

	return {
		shouldTruncate: true,
		displayText: overview.slice(0, cutPosition),
		hiddenText: overview.slice(cutPosition).trim(),
	};
};
