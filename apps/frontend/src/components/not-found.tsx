import { useNavigate } from "@tanstack/react-router";
import notFound from "@/assets/notFoundIllustration.jpg";
import { Button } from "@/components/ui/button";

export function notFoundComponent() {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<div className="grid gap-6">
				<h1 className="text-4xl font-bold text-center">Oops!</h1>
				<img
					src={notFound}
					alt="Not found illustration"
					className="h-64 mx-auto"
				/>
				<div className="space-y-2">
					<p className="text-lg text-center text-muted-foreground">
						The page you're looking for doesn't exist or has been moved.
					</p>
					<div className="text-lg text-center">
						<Button onClick={() => navigate({ to: "/" })}>Go home</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
