export const config = {
	apiUrl: import.meta.env.VITE_API_URL as string,
	appUrl: import.meta.env.VITE_APP_URL as string,
	appEnv: import.meta.env.VITE_ENV as string,
} as const;
