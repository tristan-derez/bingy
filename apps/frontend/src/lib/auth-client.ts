import {
	customSessionClient,
	inferAdditionalFields,
	lastLoginMethodClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "../../../backend/src/lib/auth"; 
import { config } from "./env";

export const authClient = createAuthClient({
	baseURL: config.apiUrl,
	plugins: [
		twoFactorClient(),
		lastLoginMethodClient({
			cookieName: "bingy.last_used_login_method",
		}),
		inferAdditionalFields({
			user: {
				displayName: {
					type: "string",
					required: false,
					input: false,
				},
				twoFactorEnabled: {
					type: "boolean",
					required: false,
					input: false,
				},
			},
		}),
		customSessionClient<typeof auth>(),
	],
});