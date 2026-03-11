import {
	customSessionClient,
	lastLoginMethodClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { Auth } from "shared";
import { config } from "./env";

export const authClient = createAuthClient({
	baseURL: config.apiUrl,
	plugins: [
		twoFactorClient(),
		lastLoginMethodClient({
			cookieName: "bingy.last_used_login_method",
		}),
		customSessionClient<Auth>(),
	],
});
