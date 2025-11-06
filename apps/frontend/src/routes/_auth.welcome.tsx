import {
	createFileRoute,
	useRouteContext,
	useRouter,
	useSearch,
} from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";

const welcomeSearchSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute("/_auth/welcome")({
	validateSearch: welcomeSearchSchema,
	component: Welcome,
});

export function Welcome() {
	const { session } = useRouteContext({ from: "__root__" });
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();
	const error = useSearch({
		from: "/_auth/welcome",
		select: (search) => search.error,
	});

	const handleResendEmail = async () => {
		try {
			setIsPending(true);
			if (session?.user) {
				await authClient.sendVerificationEmail({
					email: session.user.email,
					callbackURL: `${config.appUrl}/welcome`,
				});
				toast.success("Verification email sent!", {
					description: "Please check your inbox.",
				});
			}

			await router.navigate({
				replace: true,
			});
		} catch (error) {
			toast.error("Failed to resend", { description: String(error) });
		} finally {
			setIsPending(false);
		}
	};

	if (error === "token_expired" && session?.user.emailVerified === false) {
		toast.error("Link expired", {
			id: "token-expired-toast",
			duration: Infinity,
			cancel: { label: "Resend email", onClick: handleResendEmail },
		});
	}

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold mt-2">Welcome {session?.user.name}!</h1>

			<Card className="max-w-lg mx-auto p-6">
				{session?.user && !session.user.emailVerified && (
					<Alert className="mb-6">
						<AlertTitle>Email verification required</AlertTitle>
						<AlertDescription>
							<p>
								Please check your inbox and verify your email address to access
								all features.
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={handleResendEmail}
								disabled={isPending}
								className="mt-2"
							>
								{isPending ? "Sending..." : "Resend Email"}
							</Button>
						</AlertDescription>
					</Alert>
				)}

				<div className="text-center">
					<p className="text-lg font-medium mb-4">
						{session?.user?.emailVerified
							? "You're all set! 🎉"
							: "You're almost ready! 🚀"}
					</p>

					{session?.user?.emailVerified ? (
						<div>
							<p className="mb-4">Ready to start building your collection?</p>
							<Button className="w-full mb-3">Add Your First Movie</Button>
							<Button variant="outline" className="w-full">
								Browse Popular Titles
							</Button>
						</div>
					) : (
						<div>
							<p className="mb-4">
								Once verified, you'll be able to add movies, create watchlists,
								and get personalized recommendations.
							</p>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}
