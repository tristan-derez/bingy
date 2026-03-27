import {
	createFileRoute,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import { toast } from "@/components/toast/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { sessionQueryOptions } from "@/lib/queries/session";
import { m } from "@/paraglide/messages";

const verifyEmailSearchSchema = z.object({
	verified: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_auth/verify-email")({
	validateSearch: verifyEmailSearchSchema,
	component: VerifyEmailPage,
	beforeLoad: async ({ context }) => {
		// Fetch fresh session data
		const { data: freshSession } = await authClient.getSession({
			query: { disableCookieCache: true },
		});

		if (freshSession) {
			context.queryClient.setQueryData(
				sessionQueryOptions.queryKey,
				freshSession,
			);
		}

		// Redirect verified users to welcome page
		if (freshSession?.user?.emailVerified) {
			throw redirect({ to: "/welcome" });
		}
	},
});

export function VerifyEmailPage() {
	const { authData } = useRouteContext({ from: "__root__" });
	const { verified } = Route.useSearch();
	const [isResending, setIsResending] = useState(false);

	const handleResendEmail = async () => {
		if (!authData?.user?.email) return;

		setIsResending(true);
		try {
			await authClient.sendVerificationEmail({
				email: authData.user.email,
				callbackURL: `${config.appUrl}/verify-email?verified=true`,
			});
			toast.success({
				title: m.toast_success_email_sent_title_welcome_page(),
				description: m.toast_success_email_sent_desc_welcome_page(),
			});
		} catch {
			toast.error({ title: m.toast_error_email_failed_welcome_page() });
		} finally {
			setIsResending(false);
		}
	};

	if (!authData) {
		return null;
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-bold mt-2">Verify Your Email</h1>
			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle>Verification Required</CardTitle>
					<CardDescription>
						Check your inbox and click the link to verify your email.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{verified && (
						<Alert>
							<AlertTitle>Email Verified!</AlertTitle>
							<AlertDescription>
								Redirecting you to the welcome page...
							</AlertDescription>
						</Alert>
					)}

					<Alert>
						<AlertTitle>
							{m.welcome_page_verification_required_title()}
						</AlertTitle>
						<AlertDescription>
							<p>{m.welcome_page_verification_required_desc()}</p>
							<p className="mt-2 text-sm text-muted-foreground">
								Email: {authData.user.email}
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={handleResendEmail}
								disabled={isResending}
								className="mt-2"
							>
								{isResending
									? m.welcome_page_btn_sending()
									: m.welcome_page_btn_resend()}
							</Button>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		</div>
	);
}
