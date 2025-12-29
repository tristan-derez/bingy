import { signUpFormSchema } from "./signup-form-schema";

export const signinFormSchema = signUpFormSchema.pick({
	email: true,
	password: true,
});
