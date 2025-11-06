import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import cat404 from "@/assets/not-found/404-cat.png";
import cuteAnimal404 from "@/assets/not-found/404-cute-animal.png";
import desert404 from "@/assets/not-found/404-desert.png";
import mountains404 from "@/assets/not-found/404-mountains.png";
import { Button } from "@/components/ui/button";

const NOT_FOUND_IMAGES = [
	cat404,
	cuteAnimal404,
	desert404,
	mountains404,
] as const;

export function NotFoundComponent() {
	const navigate = useNavigate();
	const randomImage = useMemo(
		() => NOT_FOUND_IMAGES[Math.floor(Math.random() * NOT_FOUND_IMAGES.length)],
		[],
	);

	return (
		<div
			role="alert"
			aria-live="polite"
			className="flex flex-col items-center justify-center flex-1"
		>
			<div className="grid">
				<img
					src={randomImage}
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
	);
}
