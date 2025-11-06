import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/goodbye")({
	component: GoodByePage,
});

function GoodByePage() {
	const navigate = useNavigate();
	return (
		<div>
			<div className="grid gap-4 text-center">
				<p>Hey! goodbye!</p>
				<Button onClick={() => navigate({ to: "/" })}>Return to home</Button>
			</div>
		</div>
	);
}
