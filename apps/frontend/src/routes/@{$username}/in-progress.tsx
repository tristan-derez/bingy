import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/@{$username}/in-progress")({
	component: InProgressPage,
});

function InProgressPage() {
	return (
		<div className="flex flex-col gap-4 flex-1">
			Hello "/@$username/in-progress"!
		</div>
	);
}
