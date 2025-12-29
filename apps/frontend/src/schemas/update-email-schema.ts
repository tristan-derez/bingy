import { signUpFormSchema } from "./signup-form-schema";

export const updateEmailSchema = signUpFormSchema.pick({
	email: true,
});
