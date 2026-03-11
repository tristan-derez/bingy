import { signUpFormSchema } from "../signup-form-schema";

export const forgotPasswordFormSchema = signUpFormSchema.pick({
	email: true,
});
