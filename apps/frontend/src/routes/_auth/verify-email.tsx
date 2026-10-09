import {
	createFileRoute,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "@/components/toast/toast";
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

export const Route = createFileRoute("/_auth/verify-email")({
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

function VerifyEmailPage() {
	const { authData } = useRouteContext({ from: "__root__" });
	const [isResending, setIsResending] = useState(false);

	const handleResendEmail = async () => {
		if (!authData?.user?.email) return;

		setIsResending(true);
		try {
			await authClient.sendVerificationEmail({
				email: authData.user.email,
				callbackURL: `${config.appUrl}/welcome`,
			});
			toast.success({
				title: m.toast_success_email_sent_title_verify_email_page(),
				description: m.toast_success_email_sent_desc_verify_email_page(),
			});
		} catch {
			toast.error({
				title: m.toast_error_email_failed_verify_email_page(),
			});
		} finally {
			setIsResending(false);
		}
	};

	if (!authData) {
		return null;
	}

	return (
		<div className="flex flex-col justify-center items-center gap-4">
			<Card className="min-w-full">
				<CardHeader>
					<CardTitle>
						{m.verify_email_page_verification_required_title()}
					</CardTitle>
					<CardDescription>
						{m.verify_email_page_verification_required_desc()}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleResendEmail}
						disabled={isResending}
					>
						{isResending
							? m.verify_email_page_btn_sending()
							: m.verify_email_page_btn_resend({ email: authData.user.email })}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
