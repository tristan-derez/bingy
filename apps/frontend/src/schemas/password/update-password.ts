import { z } from "zod";
import { signUpFormSchema } from "../signup-form-schema";

export const updatePasswordFormSchema = z.object({
	newPassword: signUpFormSchema.shape.password,
	currentPassword: signUpFormSchema.shape.password,
});
