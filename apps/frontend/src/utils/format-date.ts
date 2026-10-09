import {
	formatDistanceToNow as dfnsFormatDistanceToNow,
	type Locale,
} from "date-fns";
import { enUS as enUSLocale, fr as frLocale } from "date-fns/locale";

const localeMap: Record<string, Locale> = {
	en: enUSLocale,
	fr: frLocale,
};

/**
 * Formats a date string into a localized date format.
 *
 * @param dateString - ISO date string or any valid date string
 * @param locale - BCP 47 language tag (default: "en-US")
 * @param options - Intl.DateTimeFormat options (default: full date with long month)
 * @returns Formatted date string
 *
 * @example
 * formatDate("2024-03-15") // "March 15, 2024"
 * formatDate("2024-03-15", "en-GB") // "15 March 2024"
 * formatDate("2024-03-15", "en-US", { month: "short", day: "numeric" }) // "Mar 15"
 */
export function formatDate(
	dateString: string,
	locale = "en-US",
	options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	},
): string {
	return new Date(dateString).toLocaleDateString(locale, options);
}

/**
 * Formats a date as a relative time string (e.g., "5 minutes ago", "2 hours ago").
 *
 * @param date - Date object or ISO date string
 * @param locale - BCP 47 language tag (default: "en-US")
 * @returns Formatted relative time string
 *
 * @example
 * formatDistanceToNow(new Date(Date.now() - 1000 * 60 * 5)) // "5 minutes ago"
 * formatDistanceToNow(new Date(Date.now() - 1000 * 60 * 60 * 2)) // "2 hours ago"
 */
export function formatDistanceToNow(date: Date, locale = "en-US"): string {
	const lang = locale.split("-")[0] ?? "en";
	const dateLocale = localeMap[lang] ?? enUSLocale;
	return dfnsFormatDistanceToNow(date, {
		addSuffix: true,
		locale: dateLocale,
	});
}
