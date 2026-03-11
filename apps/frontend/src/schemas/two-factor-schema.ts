import { signUpFormSchema } from "./signup-form-schema";

export const twoFactorSchema = signUpFormSchema.pick({
	password: true,
});
