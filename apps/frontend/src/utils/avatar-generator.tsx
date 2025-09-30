const BASE_URL = "https://api.dicebear.com/9.x";
const DEFAULT_STYLE = "bottts-neutral";

const seeds = [
	"Ashley",
	"Brandon",
	"Emma",
	"Finn",
	"Grace",
	"Isabella",
	"Jackson",
	"Kaitlyn",
	"Logan",
	"Madison",
	"Noah",
	"Olivia",
	"Parker",
	"Quinn",
	"Riley",
	"Sophia",
	"Tyler",
	"Uma",
	"Victoria",
	"Wesley",
	"Yasmin",
	"Zoe",
	"Austin",
	"Brooke",
	"Connor",
] as const;

export type Seed = (typeof seeds)[number];
export type AvatarStyle =
	| "bottts-neutral"
	| "adventurer"
	| "micah"
	| "identicon"
	| "shapes"
	| "thumbs";

function buildAvatarUrl(
	seed: string,
	style: AvatarStyle = DEFAULT_STYLE,
): string {
	return `${BASE_URL}/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

export function getRandomAvatarUrl(style: AvatarStyle = DEFAULT_STYLE): string {
	const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
	return buildAvatarUrl(randomSeed, style);
}

export function getAllAvatarUrls(style: AvatarStyle = DEFAULT_STYLE): string[] {
	return seeds.map((seed) => buildAvatarUrl(seed, style));
}
