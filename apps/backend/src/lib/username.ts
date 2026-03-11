import { eq } from "drizzle-orm";
import { users } from "#db/schemas/user";
import { db } from "./database";

export async function generateUniqueUsername(
	baseName: string,
): Promise<string> {
	// Sanitize: lowercase, allow alphanumeric, dots, underscores only
	let username = baseName
		.toLowerCase()
		.replace(/[^a-z0-9._]/g, "")
		.slice(0, 30);

	// Remove leading/trailing dots and underscores
	username = username.replace(/^[._]+|[._]+$/g, "");

	// Replace consecutive dots with single dot
	username = username.replace(/\.{2,}/g, ".");

	// Fallback if sanitization removes everything
	if (!username) {
		username = "user";
	}

	// Check if base username is available
	const existing = await db.query.users.findFirst({
		where: eq(users.name, username),
	});

	if (!existing) {
		return username;
	}

	// Append numbers until unique
	let counter = 1;
	let candidate = `${username}${counter}`;

	while (
		await db.query.users.findFirst({
			where: eq(users.name, candidate),
		})
	) {
		counter++;
		candidate = `${username}${counter}`;

		// Ensure we don't exceed 30 chars
		if (candidate.length > 30) {
			const baseLength = 30 - counter.toString().length;
			candidate = `${username.slice(0, baseLength)}${counter}`;
		}
	}

	return candidate;
}
