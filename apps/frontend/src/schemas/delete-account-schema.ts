import { signUpFormSchema } from "./signup-form-schema";

export const deleteAccountSchema = signUpFormSchema.pick({
	password: true,
});
