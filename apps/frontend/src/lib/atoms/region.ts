import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Locale } from "@/paraglide/runtime";
import { localeAtom } from "./locale";

const SUPPORTED_REGIONS = ["CA", "US", "FR", "GB", "AU"] as const;
type Region = (typeof SUPPORTED_REGIONS)[number];

const DEFAULT_REGION: Region = "US";

const getInitialRegion = (): Region => {
	const stored = localStorage.getItem("region");
	if (stored) {
		return JSON.parse(stored) as Region;
	}

	// Auto-detect and save
	const detected = getUserRegionFromNavigator() ?? DEFAULT_REGION;
	localStorage.setItem("region", JSON.stringify(detected));
	return detected;
};

function getUserRegionFromNavigator(): Region | undefined {
	if (typeof Intl === "undefined" || typeof navigator === "undefined") {
		return undefined;
	}

	try {
		// Try timezone first
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		if (timezone.startsWith("America/")) {
			if (
				timezone.includes("Toronto") ||
				timezone.includes("Vancouver") ||
				timezone.includes("Montreal")
			) {
				return "CA";
			}
			return "US";
		}
		if (timezone.startsWith("Europe/Paris")) return "FR";
		if (timezone.startsWith("Europe/London")) return "GB";
		if (timezone.startsWith("Australia/")) return "AU";

		// Fallback to navigator.language
		const locale = navigator.language.split("-")[1];
		return SUPPORTED_REGIONS.includes(locale as Region)
			? (locale as Region)
			: undefined;
	} catch {
		return undefined;
	}
}

const regionStorage = atomWithStorage<Region>("region", getInitialRegion());

// Valid locale-region combinations
const VALID_COMBOS: Record<Locale, Region[]> = {
	en: ["US", "GB", "AU", "CA"],
	fr: ["FR", "CA"],
};

// Default fallback for each locale
const DEFAULT_FOR_LOCALE: Record<Locale, Region> = {
	en: "US",
	fr: "FR",
};

// Used only for api calls with a region param
export const regionAtom = atom(
	(get) => get(regionStorage),
	(_get, set, newRegion: Region) => {
		set(regionStorage, newRegion);
	},
);

// Used for "language" param in api calls and date format
export const localeRegionAtom = atom((get) => {
	const locale = get(localeAtom);
	const region = get(regionStorage);

	const validRegions = VALID_COMBOS[locale];
	if (validRegions.includes(region)) {
		return `${locale}-${region}`;
	}

	// Fallback to default region for this locale
	const defaultRegion = DEFAULT_FOR_LOCALE[locale];
	return `${locale}-${defaultRegion}`;
});

export { SUPPORTED_REGIONS, type Region };
