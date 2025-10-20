import { createAuthClient } from "better-auth/react";
import { config } from "./env";

export const authClient = createAuthClient({
	baseURL: config.apiUrl,
	plugins: [
		lastLoginMethodClient({
			cookieName: "bingy.last_used_login_method",
		}),
	],
});
