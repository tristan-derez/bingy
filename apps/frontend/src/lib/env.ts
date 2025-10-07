export const config = {
	apiUrl: import.meta.env.VITE_API_URL as string,
	apiKey: import.meta.env.VITE_API_KEY as string,
	appUrl: import.meta.env.VITE_APP_URL as string,
} as const;
