import { z } from "zod";
import { m } from "@/paraglide/messages";

export const searchFormSchema = z.object({
	newQuery: z
		.string()
		.min(1, { message: m.schema_search_min_length() })
		.max(300, { message: m.schema_search_max_length() }),
});
