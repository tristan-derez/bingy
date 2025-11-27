export function formatRuntime(minutes: number | null): string {
	if (!minutes || minutes <= 0) return "N/A";
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${h}h${m.toString().padStart(2, "0")}`;
}
