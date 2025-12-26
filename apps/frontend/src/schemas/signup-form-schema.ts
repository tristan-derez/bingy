import z from "zod";

export const signUpFormSchema = z.object({
	name: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? "Hey there, mysterious stranger! We'd love to know what to call you"
					: "Hmm, that doesn't look quite right for a name",
		})
		.trim()
		.min(2, {
			message: "Your name's a bit shy! Can you give us at least 2 characters?",
		})
		.max(30, {
			message: "Whoa there, try to keep your name under 30 characters",
		})
		.regex(/^[a-zA-Z0-9._]+$/, {
			message: "Only letters, numbers, dots, and underscores allowed",
		})
		.regex(/^[a-zA-Z0-9].*[a-zA-Z0-9]$/, {
			message: "Must start and end with a letter or number",
		})
		.refine((val) => !val.includes(".."), {
			message: "Your name can't have consecutive dots",
		}),
	email: z
		.email({
			error: (iss) =>
				iss.input === undefined
					? "We need your email address to keep in touch"
					: "That email address looks a bit wonky. Mind double-checking it?",
		})
		.min(3, {
			message:
				"Your email's playing hide and seek. Make it at least 3 characters long!",
		})
		.max(256, {
			message: "Wow, that's an epic email! Let's keep it under 256 characters",
		}),
	password: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? "Don't forget your secret password!"
					: "Something's not quite right with that password format",
		})
		.min(8, {
			message:
				"Your password needs at least 8 characters to keep things secure",
		})
		.max(256, {
			message:
				"That's quite the fortress of a password! Let's keep it under 256 characters",
		}),
});
