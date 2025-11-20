const EXCLUDED_JOBS = new Set([
	"Story Artist",
	"Story Coordinator",
	"Lyricist",
	"Head of Story",
]);

export const getRole = (person: {
	job: string;
	department: string;
}): string | null => {
	if (EXCLUDED_JOBS.has(person.job)) return null;
	if (person.job === "Director") return "Director";
	if (person.department === "Writing") return person.job;
	return null;
};
