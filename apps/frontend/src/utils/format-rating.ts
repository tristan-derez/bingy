export const formatRating = (rating: string): string => {
	const num = Number.parseFloat(rating);

	if (Number.isNaN(num)) {
		return rating;
	}

	return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
};
