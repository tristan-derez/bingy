type ReleaseDates = {
	results: Array<{
		iso_3166_1: string;
		release_dates: Array<{ type: number; release_date: string }>;
	}>;
};

export const getReleaseDate = (
	releaseDates: ReleaseDates | undefined,
	region: string,
	fallbackDate: string | undefined,
): { date: string | undefined; region: string | undefined } => {
	const regionData = releaseDates?.results.find((r) => r.iso_3166_1 === region);

	if (!regionData) return { date: fallbackDate, region: undefined };

	const typeOrder = [3, 4, 5];

	for (const type of typeOrder) {
		const release = regionData.release_dates.find((rd) => rd.type === type);
		if (release) return { date: release.release_date, region };
	}

	return { date: fallbackDate, region: undefined };
};
