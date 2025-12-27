import {
	createFileRoute,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_auth/welcome")({
	component: WelcomePage,
	beforeLoad: ({ context }) => {
		// Redirect unverified users to verify-email page
		// Note: verify-email already refetches and updates cache before redirecting here
		if (context.session?.user && !context.session.user.emailVerified) {
			throw redirect({ to: "/verify-email" });
		}
	},
});

export function WelcomePage() {
	const { session } = useRouteContext({ from: "__root__" });

	if (!session?.user?.emailVerified) {
		return null;
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-bold mt-2">
				{m.welcome_page_greetings({ username: session.user.displayName! })}
			</h1>
			<Card>
				<CardHeader>
					<CardTitle>{m.welcome_page_email_verified_text()}</CardTitle>
				</CardHeader>
			</Card>
		</div>
	);
}
