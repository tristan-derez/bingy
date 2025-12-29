import z from "zod";
import { m } from "@/paraglide/messages";

export const signUpFormSchema = z.object({
	name: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? m.schema_name_required()
					: m.schema_name_invalid_type(),
		})
		.trim()
		.min(2, { message: m.schema_name_min_length() })
		.max(30, { message: m.schema_name_max_length() })
		.regex(/^[a-zA-Z0-9._]+$/, {
			message: m.schema_name_invalid_characters(),
		})
		.regex(/^[a-zA-Z0-9].*[a-zA-Z0-9]$/, {
			message: m.schema_name_invalid_boundaries(),
		})
		.refine((val) => !val.includes(".."), {
			message: m.schema_name_consecutive_dots(),
		}),
	email: z
		.email({
			error: (iss) =>
				iss.input === undefined
					? m.schema_email_required()
					: m.schema_email_invalid(),
		})
		.min(3, { message: m.schema_email_min_length() })
		.max(256, { message: m.schema_email_max_length() }),
	password: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? m.schema_password_required()
					: m.schema_password_invalid_type(),
		})
		.min(8, { message: m.schema_password_min_length() })
		.max(256, { message: m.schema_password_max_length() }),
});
