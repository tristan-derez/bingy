import type { Pretty } from "./generic";

// biome-ignore format: keep union type compact
export type WatchProviderCountry = Pretty<
		| "AE" | "AL" | "AR" | "AT" | "AU" | "BA" | "BB" | "BE" | "BG" | "BH"
		| "BO" | "BR" | "BS" | "CA" | "CH" | "CL" | "CO" | "CR" | "CV" | "CZ"
		| "DE" | "DK" | "DO" | "EC" | "EE" | "EG" | "ES" | "FI" | "FJ" | "FR"
		| "GB" | "GF" | "GI" | "GR" | "GT" | "HK" | "HN" | "HR" | "HU" | "ID"
		| "IE" | "IL" | "IN" | "IQ" | "IS" | "IT" | "JM" | "JO" | "JP" | "KR"
		| "KW" | "LB" | "LI" | "LT" | "LV" | "MD" | "MK" | "MT" | "MU" | "MX"
		| "MY" | "MZ" | "NL" | "NO" | "NZ" | "OM" | "PA" | "PE" | "PH" | "PK"
		| "PL" | "PS" | "PT" | "PY" | "QA" | "RO" | "RS" | "RU" | "SA" | "SE"
		| "SG" | "SI" | "SK" | "SM" | "SV" | "TH" | "TR" | "TT" | "TW" | "UG"
		| "US" | "UY" | "VE" | "YE" | "ZA"
	>;

type WatchProvider = Pretty<{
	logo_path: string | null;
	provider_id: number;
	provider_name: string;
	display_priority: number;
}>;

type CountryWatchProviders = Pretty<{
	link: string;
	flatrate?: WatchProvider[];
	rent?: WatchProvider[];
	buy?: WatchProvider[];
	ads?: WatchProvider[];
}>;

type WatchProviderResults = Pretty<{
	[K in WatchProviderCountry]?: CountryWatchProviders;
}>;

export type WatchProviders = Pretty<{
	id: number;
	results: WatchProviderResults;
}>;
