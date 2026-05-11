import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { users } from "../db/schemas/user";
import { db } from "./database";

type OAuthUsername = {
	username: string;
	displayName: string;
};

export function cleanUsername(input: string): string {
	return input
		.replace(/[^a-zA-Z0-9._-]/g, "")
		.replace(/([._-])[._-]+/g, "$1")
		.replace(/^[._-]+|[._-]+$/g, "")
		.slice(0, 30);
}

export function resolveOAuthBase(input: string): {
	normalized: string;
	displayName: string;
} {
	const clean = cleanUsername(input);

	if (!clean || !/[a-z0-9]/i.test(clean)) {
		const suffix = crypto.randomUUID().slice(0, 4);

		return {
			normalized: `user${suffix}`,
			displayName: `User${suffix}`,
		};
	}

	return {
		normalized: clean.toLowerCase(),
		displayName: clean,
	};
}

async function isUsernameTaken(name: string): Promise<boolean> {
	const existing = await db.query.users.findFirst({
		where: eq(users.name, name.toLowerCase()),
	});
	return !!existing;
}

export async function generateUniqueUsername(
	baseName: string,
	maxUsernameAttempt = 5,
): Promise<OAuthUsername> {
	const base = resolveOAuthBase(baseName);

	let displayName = base.displayName;
	let username = base.normalized;

	if (!(await isUsernameTaken(username))) {
		return { username, displayName };
	}

	for (let counter = 1; counter <= maxUsernameAttempt; counter++) {
		const suffix = counter.toString();
		const maxBaseLength = 30 - suffix.length;
		const trimmedBase = base.displayName.slice(0, maxBaseLength);

		displayName = `${trimmedBase}${suffix}`;
		username = displayName.toLowerCase();

		if (!(await isUsernameTaken(username))) {
			return { username, displayName };
		}
	}

	const randomSuffix = crypto.randomUUID().slice(0, 6);
	displayName = `${base.displayName.slice(0, 23)}.${randomSuffix}`;
	username = displayName.toLowerCase();

	return { username, displayName };
}

export function validateUsername(input: string) {
	const RESERVED = new Set(["admin", "api", "support", "root"]);

	const clean = input
		.replace(/[^a-zA-Z0-9._-]/g, "")
		.replace(/([._-])[._-]+/g, "$1")
		.replace(/^[._-]+|[._-]+$/g, "");

	if (clean.length > 30) {
		throw new APIError("BAD_REQUEST", {
			message: "Username is too long",
			code: "USERNAME_TOO_LONG",
		});
	}

	if (!clean) {
		throw new APIError("BAD_REQUEST", {
			message: "Invalid username",
			code: "INVALID_USERNAME",
		});
	}

	if (!/[a-z0-9]/i.test(clean)) {
		throw new APIError("BAD_REQUEST", {
			message: "Username must contain letters or numbers",
			code: "INVALID_USERNAME",
		});
	}

	const normalized = clean.toLowerCase();

	if (RESERVED.has(normalized)) {
		throw new APIError("UNPROCESSABLE_ENTITY", {
			message: "Username is not allowed",
			code: "USERNAME_RESERVED",
		});
	}

	return {
		normalized,
		displayName: clean,
	};
}

export async function assertUsernameAvailable(username: string) {
	const taken = await isUsernameTaken(username);
	if (taken) {
		throw new APIError("UNPROCESSABLE_ENTITY", {
			message: "Username is already taken",
			code: "USERNAME_ALREADY_EXISTS",
		});
	}
}
