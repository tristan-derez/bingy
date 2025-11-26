export const calculateAge = (
	birthDate: string,
	deathDate?: string | null,
): number => {
	const birth = new Date(birthDate);
	const end = deathDate ? new Date(deathDate) : new Date();
	let age = end.getFullYear() - birth.getFullYear();
	const monthDiff = end.getMonth() - birth.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
		age--;
	}

	return age;
};
