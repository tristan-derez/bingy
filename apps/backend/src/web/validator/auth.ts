import z from "zod";

export const signInSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export const signUpSchema = signInSchema.extend({
	name: z.string().min(2),
	image: z.url().optional(),
	callbackURL: z.url().optional(),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
