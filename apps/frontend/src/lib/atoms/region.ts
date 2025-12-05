import { atom } from "jotai";
import type { Locale } from "@/paraglide/runtime";
import { localeAtom } from "./locale";

const SUPPORTED_REGIONS = ["CA", "US", "FR", "GB", "AU"] as const;
type Region = (typeof SUPPORTED_REGIONS)[number];

const DEFAULT_REGION: Region = "US";

const regionStorage = atom<Region>(DEFAULT_REGION);

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
