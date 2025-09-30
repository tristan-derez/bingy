import { z } from "zod";

export const updateEmailSchema = z.object({
	newEmail: z
		.email({
			error: (iss) =>
				iss.input === undefined
					? "We need your email address to keep in touch"
					: "That email address looks a bit wonky. Mind double-checking it?",
		})
		.min(3, {
			message:
				"Your email's playing hide and seek. Make it at least 3 characters long!",
		})
		.max(256, {
			message: "Wow, that's an epic email! Let's keep it under 256 characters",
		}),
});
