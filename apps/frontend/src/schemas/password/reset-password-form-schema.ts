import { signUpFormSchema } from "../signup-form-schema";

export const resetPasswordFormSchema = signUpFormSchema.pick({
	password: true,
});
