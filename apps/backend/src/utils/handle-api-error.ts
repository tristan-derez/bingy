const errorMappings = [
	{ keywords: ["already exists", "User already exists"], statusCode: 409 },
	{ keywords: ["Invalid email", "invalid email"], statusCode: 400 },
	{ keywords: ["Password", "weak"], statusCode: 400, requireAll: true }, // Requires both keywords
	{ keywords: ["validation", "required"], statusCode: 400 },
	{ keywords: ["rate limit", "too many"], statusCode: 429 },
	{ keywords: ["forbidden", "not allowed"], statusCode: 403 },
];

export const handleApiError = (
	error: unknown,
): {
	statusCode: number;
	message: string;
} => {
	const defaultError = {
		statusCode: 500,
		message: "An unexpected error occurred.",
	};

	if (!(error instanceof Error)) {
		return defaultError;
	}

	const errorMessage = error.message;

	for (const mapping of errorMappings) {
		const hasKeywords = mapping.requireAll
			? mapping.keywords.every((k) => errorMessage.includes(k))
			: mapping.keywords.some((k) => errorMessage.includes(k));

		if (hasKeywords) {
			return { statusCode: mapping.statusCode, message: errorMessage };
		}
	}

	return { statusCode: 500, message: errorMessage };
};
