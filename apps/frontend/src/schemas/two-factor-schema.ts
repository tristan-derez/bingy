import * as z from "zod";

export const twoFactorSchema = z.object({
	password: z
		.string()
		.min(
			8,
			"Your password is at least 8 characters long. Please double-check and try again.",
		)
		.max(
			256,
			"Your password can't have more than 256 characters. Please double-check and try again.",
		),
});
