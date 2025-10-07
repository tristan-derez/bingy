export const config = {
	apiUrl: import.meta.env.VITE_API_URL,
	apiKey: import.meta.env.VITE_API_KEY,
	environment: import.meta.env.MODE,
} as const;
