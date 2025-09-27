import { z } from "zod";

export const updatePasswordFormSchema = z.object({
	newPassword: z.string().min(8, "Password must be at least 8 characters long"),
	currentPassword: z
		.string()
		.min(8, "Password must be at least 8 characters long"),
});
