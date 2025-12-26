import {
	customSessionClient,
	lastLoginMethodClient,
} from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/plugins/two-factor";
import { createAuthClient } from "better-auth/react";
import type { Auth } from "shared";
import { config } from "./env";

export const authClient = createAuthClient({
	baseURL: config.apiUrl,
	plugins: [
		lastLoginMethodClient({
			cookieName: "bingy.last_used_login_method",
		}),
		twoFactorClient(),
		customSessionClient<Auth>(),
	],
});
