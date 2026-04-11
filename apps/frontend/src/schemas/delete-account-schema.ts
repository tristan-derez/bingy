import z from "zod";
import { m } from "@/paraglide/messages";

export const deleteAccountSchema = (hasPassword: boolean) =>
	z.object({
		password: hasPassword
			? z
					.string({
						error: (iss) =>
							iss.input === undefined
								? m.schema_password_required()
								: m.schema_password_invalid_type(),
					})
					.min(8, { message: m.schema_password_min_length() })
					.max(256, { message: m.schema_password_max_length() })
			: z.string().optional().or(z.literal("")),
	});
