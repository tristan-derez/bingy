import z from "zod";
import { m } from "@/paraglide/messages";

export const createListSchema = z.object({
	name: z
		.string()
		.min(1, m.schema_create_list_name_min())
		.max(200, m.schema_create_list_name_max()),
	description: z
		.string()
		.max(2000, m.schema_create_list_description_max())
		.optional(),
	type: z.enum(["unranked", "ranked"]),
	visibility: z.enum(["public", "limited", "private"]),
});
