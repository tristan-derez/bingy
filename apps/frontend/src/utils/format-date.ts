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
