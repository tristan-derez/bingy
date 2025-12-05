import { atom } from "jotai";
import { getLocale, type Locale, setLocale } from "@/paraglide/runtime";

export const localeAtom = atom<Locale>(getLocale());

export const setLocaleAtom = atom(null, (_get, set, newLocale: Locale) => {
	setLocale(newLocale);
	set(localeAtom, newLocale);
});
