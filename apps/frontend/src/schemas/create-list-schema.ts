import z from "zod";
import { m } from "@/paraglide/messages";

export const createListSchema = z.object({
	name: z
		.string()
		.min(1, m.schema_create_list_name_min())
		.max(50, m.schema_create_list_name_max()),
	description: z
		.string()
		.max(1000, m.schema_create_list_description_max())
		.optional(),
	visibility: z.enum(["public", "limited", "private"]),
});
