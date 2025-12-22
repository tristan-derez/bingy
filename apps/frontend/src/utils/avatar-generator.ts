const BASE_URL = "https://api.dicebear.com/9.x";
const DEFAULT_STYLE = "thumbs";

export type AvatarStyle = "thumbs";

function buildAvatarUrl(
	seed: string,
	style: AvatarStyle = DEFAULT_STYLE,
): string {
	return `${BASE_URL}/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

export function getRandomAvatarUrl(
	seed: string,
	style: AvatarStyle = DEFAULT_STYLE,
): string {
	const randomNumber = Math.floor(Math.random() * 100);
	const randomSeed = `${seed}${randomNumber}`;
	return buildAvatarUrl(randomSeed, style);
}
