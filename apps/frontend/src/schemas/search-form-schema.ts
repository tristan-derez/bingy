import { z } from "zod";

export const searchFormSchema = z.object({
	newQuery: z
		.string()
		.min(1, { message: "Search cannot be empty" })
		.max(200, { message: "Search cannot exceed 200 characters" }),
});
