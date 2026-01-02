import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { m } from "@/paraglide/messages";

type GlobalErrorProps = {
	error: unknown;
};

export function GlobalError({ error }: GlobalErrorProps) {
	const message =
		error instanceof Error ? error.message : "Unknown error occurred";

	return (
		<div className="h-screen w-screen flex items-center justify-center p-4">
			<Card className="max-w-md w-full shadow-lg p-2">
				<CardContent className="flex flex-col items-center text-center p-4 gap-4">
					<CardTitle className="text-2xl text-red-500">Oops!</CardTitle>
					<CardDescription className="text-md">{message}</CardDescription>
					<Button
						variant="secondary"
						className="w-full"
						onClick={() => window.location.reload()}
					>
						{m.btn_error_retry()}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
