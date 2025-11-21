import { useNavigate } from "@tanstack/react-router";
import cuteAnimal404 from "@/assets/not-found/404-cute-animal.png";
import { Button } from "@/components/ui/button";
import { CenteredLayout } from "../layout/centered-layout";

export function NotFoundComponent() {
	const navigate = useNavigate();

	return (
		<CenteredLayout>
			<div role="alert" aria-live="polite">
				<div className="grid">
					<img
						src={cuteAnimal404}
						alt="Not found illustration"
						className="w-3/4 sm:w-1/2 lg:w-1/3 mx-auto object-contain"
						role="presentation"
						loading="lazy"
					/>
					<div className="space-y-4">
						<h1 className="text-4xl font-bold text-center">Oops!</h1>
						<p className="text-lg text-center text-muted-foreground">
							The page you're looking for doesn't exist or has been moved.
						</p>
						<div className="text-lg text-center">
							<Button onClick={() => navigate({ to: "/" })}>Go home</Button>
						</div>
					</div>
				</div>
			</div>
		</CenteredLayout>
	);
}
