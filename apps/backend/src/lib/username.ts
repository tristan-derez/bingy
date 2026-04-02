import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { users } from "../db/schemas/user";
import { db } from "./database";

type SanitizedUsername = {
	clean: string;
	normalized: string;
	isValid: boolean;
	reason?: "empty" | "too_long";
};

type OAuthUsername = {
	username: string;
	displayName: string;
};

export function sanitizeUsername(input: string): SanitizedUsername {
	const clean = input
		.replace(/[^a-z0-9._-]/gi, "")
		.replace(/[._-]{2,}/g, (match) => match[0])
		.replace(/^[._-]+|[._-]+$/g, "");

	if (!clean) {
		return {
			clean: "",
			normalized: "",
			isValid: false,
			reason: "empty",
		};
	}

	if (clean.length > 30) {
		return {
			clean: clean.slice(0, 30),
			normalized: clean.slice(0, 30).toLowerCase(),
			isValid: false,
			reason: "too_long",
		};
	}

	return {
		clean,
		normalized: clean.toLowerCase(),
		isValid: true,
	};
}

export function resolveOAuthBase(input: string): {
	normalized: string;
	displayName: string;
} {
	const result = sanitizeUsername(input);

	if (!result.clean || !/[a-z0-9]/i.test(result.clean)) {
		const suffix = crypto.randomUUID().slice(0, 4);

		return {
			normalized: `user${suffix}`,
			displayName: `User${suffix}`,
		};
	}

	return {
		normalized: result.normalized,
		displayName: result.clean,
	};
}

export async function generateUniqueUsername(
	baseName: string,
	maxUsernameAttempt = 5,
): Promise<OAuthUsername> {
	const base = resolveOAuthBase(baseName);

	const isTaken = async (name: string): Promise<boolean> => {
		const existing = await db.query.users.findFirst({
			where: eq(users.name, name.toLowerCase()),
		});
		return !!existing;
	};

	let displayName = base.displayName;
	let username = base.normalized;

	// Try base name first
	if (!(await isTaken(username))) {
		return { username, displayName };
	}

	for (let counter = 1; counter <= maxUsernameAttempt; counter++) {
		const suffix = counter.toString();
		const maxBaseLength = 30 - suffix.length;
		const trimmedBase = base.displayName.slice(0, maxBaseLength);

		displayName = `${trimmedBase}${suffix}`;
		username = displayName.toLowerCase();

		if (!(await isTaken(username))) {
			return { username, displayName };
		}
	}

	// Fallback: append random suffix if counter exhausted
	const randomSuffix = crypto.randomUUID().slice(0, 6);
	displayName = `${base.displayName.slice(0, 23)}.${randomSuffix}`;
	username = displayName.toLowerCase();

	return { username, displayName };
}

export function validateUsernameOrThrow(input: string) {
	const RESERVED = new Set(["admin", "api", "support"]);

	const result = sanitizeUsername(input);

	if (!result.isValid) {
		if (result.reason === "empty") {
			throw new APIError("BAD_REQUEST", {
				message: "Invalid username",
				code: "INVALID_USERNAME",
			});
		}

		if (result.reason === "too_long") {
			throw new APIError("BAD_REQUEST", {
				message: "Username is too long",
				code: "USERNAME_TOO_LONG",
			});
		}
	}

	if (!/[a-z0-9]/i.test(result.clean)) {
		throw new APIError("BAD_REQUEST", {
			message: "Username must contain letters or numbers",
			code: "INVALID_USERNAME",
		});
	}

	if (RESERVED.has(result.normalized)) {
		throw new APIError("UNPROCESSABLE_ENTITY", {
			message: "Username is not allowed",
			code: "USERNAME_RESERVED",
		});
	}

	return {
		normalized: result.normalized,
		displayName: result.clean,
	};
}

export async function assertUsernameAvailable(
	username: string,
	excludeUserId?: string,
) {
	const existing = await db.query.users.findFirst({
		where: (user, { eq, and, ne }) =>
			excludeUserId
				? and(eq(user.name, username), ne(user.id, excludeUserId))
				: eq(user.name, username),
	});

	if (existing) {
		throw new APIError("UNPROCESSABLE_ENTITY", {
			message: "Username is already taken",
			code: "USERNAME_ALREADY_EXISTS",
		});
	}
}
