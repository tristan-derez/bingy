import { ofetch } from "ofetch";
import { config } from "@/lib/env";

export const apiFetch = ofetch.create({
	baseURL: `${config.apiUrl}/api`,
	credentials: "include",
	retry: 1,
	retryDelay: 3000,
	retryStatusCodes: [429, 500],
});
