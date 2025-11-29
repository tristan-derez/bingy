const countryShortNames: Record<string, string> = {
	"United States of America": "USA",
	"United Kingdom": "UK",
	"Russian Federation": "Russia",
};

export function shortenCountryName(name: string) {
	return countryShortNames[name] || name;
}
