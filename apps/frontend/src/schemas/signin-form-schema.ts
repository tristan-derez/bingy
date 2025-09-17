import * as z from "zod";

export const signinFormSchema = z.object({
	email: z.email().min(3),
	password: z
		.string()
		.min(
			8,
			"Your password must be at least 8 characters long. Please double-check and try again.",
		)
		.max(
			256,
			"Your password must not exceed 256 characters. Please double-check and try again.",
		),
});
