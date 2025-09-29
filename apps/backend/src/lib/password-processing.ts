import env from "./env";
import { logger } from "./logger";

const PEPPER = env.PEPPER_KEY;

const applyPepper = (password: string): string => {
	if (!PEPPER) throw new Error("PEPPER variable is not properly configured");

	const hasher = new Bun.CryptoHasher("sha256", PEPPER);
	hasher.update(password);
	return hasher.digest("hex");
};

export const hash = async (password: string): Promise<string> => {
	try {
		const pepperedPassword = applyPepper(password);

		const hash = await Bun.password.hash(pepperedPassword, {
			algorithm: "argon2id",
			memoryCost: 65536,
			timeCost: 3,
		});

		return hash;
	} catch (error) {
		logger.error({ error }, "Failed to hash password");
		throw new Error("Password hashing failed");
	}
};

export const verify = async (data: {
	hash: string;
	password: string;
}): Promise<boolean> => {
	try {
		const pepperedPassword = applyPepper(data.password);

		return await Bun.password.verify(pepperedPassword, data.hash);
	} catch (error) {
		logger.error({ error }, "Failed to verify password");
		throw new Error("Password verification failed");
	}
};
