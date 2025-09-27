import * as z from "zod";

export const forgotPasswordFormSchema = z.object({
	email: z.email().min(3),
});
