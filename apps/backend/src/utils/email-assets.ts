import { readFileSync } from "node:fs";

const readAsset = (path: string): string => {
	const buffer = readFileSync(path);
	return `data:image/svg+xml;base64,${buffer.toString("base64")}`;
};

export const EMAIL_ASSETS = {
	logo: readAsset("./src/assets/icons/bingy-icon.svg"),
	logo_text: readAsset("./src/assets/icons/bingy-icon_text.svg"),
} as const;
