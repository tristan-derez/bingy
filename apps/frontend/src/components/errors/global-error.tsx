import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";

type GlobalErrorProps = {
	error: unknown;
};

export function GlobalError({ error }: GlobalErrorProps) {
	const message =
		error instanceof Error ? error.message : "Unknown error occurred";

	return (
		<div className="h-screen w-screen flex items-center justify-center bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] px-4">
			<Card className="max-w-md w-full shadow-lg p-2">
				<CardContent className="flex flex-col items-center text-center p-4 gap-4">
					<CardTitle className="text-2xl text-red-500">Oops!</CardTitle>
					<CardDescription className="text-md">{message}</CardDescription>
					<Button
						variant="secondary"
						className="hover:cursor-pointer w-full"
						onClick={() => window.location.reload()}
					>
						Retry
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
