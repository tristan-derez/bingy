import { atom } from "jotai";
import { getLocale, type Locale, setLocale } from "@/paraglide/runtime";

export const localeAtom = atom<Locale>(getLocale());

// @todo: make that dynamic
export const regionAtom = atom<string>((get) => {
	const locale = get(localeAtom);
	return locale === "fr" ? "FR" : "US";
});

export const localeWithRegionAtom = atom<string>((get) => {
	const locale = get(localeAtom);
	const region = get(regionAtom);
	return `${locale}-${region}`;
});

export const setLocaleAtom = atom(null, (_get, set, newLocale: Locale) => {
	setLocale(newLocale);
	set(localeAtom, newLocale);
});
