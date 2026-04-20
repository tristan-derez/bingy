import { z } from "zod";
import { m } from "@/paraglide/messages";

export const profileSchema = z.object({
	bio: z.string().max(160, m.schema_bio_max_length({ maxChars: 160 })),
	location: z.string().max(30, m.schema_location_max_length({ maxChars: 30 })),
});
