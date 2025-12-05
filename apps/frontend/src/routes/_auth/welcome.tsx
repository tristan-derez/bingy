import {
	createFileRoute,
	redirect,
	useRouteContext,
	useRouter,
	useSearch,
} from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/env";
import { m } from "@/paraglide/messages";

const welcomeSearchSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute("/_auth/welcome")({
	validateSearch: welcomeSearchSchema,
	beforeLoad: ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: "/signin",
				search: {
					redirect: "/welcome",
				},
			});
		}
	},
	component: Welcome,
});

export function Welcome() {
	const { session } = useRouteContext({ from: "__root__" });

	if (!session) {
		return null;
	}

	const [isPending, setIsPending] = useState(false);
	const router = useRouter();
	const error = useSearch({
		from: "/_auth/welcome",
		select: (search) => search.error,
	});

	const handleResendEmail = async () => {
		try {
			setIsPending(true);
			if (session.user) {
				await authClient.sendVerificationEmail({
					email: session.user.email,
					callbackURL: `${config.appUrl}/welcome`,
				});
				toast.success(m.toast_success_email_sent_title_welcome_page(), {
					description: m.toast_success_email_sent_desc_welcome_page(),
				});
			}

			await router.navigate({
				replace: true,
			});
		} catch (error) {
			toast.error(m.toast_error_email_failed_welcome_page());
		} finally {
			setIsPending(false);
		}
	};

	if (error === "token_expired" && session.user.emailVerified === false) {
		toast.error("Link expired", {
			id: "token-expired-toast",
			duration: Infinity,
			cancel: {
				label: m.toast_error_token_expired_cancel_label_welcome_page(),
				onClick: handleResendEmail,
			},
			closeButton: true,
		});
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-bold mt-2">
				{m.welcome_page_greetings({ username: session.user.name })}
			</h1>
			{!session.user.emailVerified ? (
				<Card className="max-w-lg">
					<Alert className="mb-6">
						<AlertTitle>
							{m.welcome_page_verification_required_title()}
						</AlertTitle>
						<AlertDescription>
							<p>{m.welcome_page_verification_required_desc()}</p>
							<Button
								variant="outline"
								size="sm"
								onClick={handleResendEmail}
								disabled={isPending}
								className="mt-2"
							>
								{isPending
									? m.welcome_page_btn_sending()
									: m.welcome_page_btn_resend()}
							</Button>
						</AlertDescription>
					</Alert>
				</Card>
			) : null}
			<Card>
				<CardHeader>
					<CardTitle>
						{session.user.emailVerified
							? m.welcome_page_email_verified_text()
							: m.welcome_page_email_not_verified_text()}
					</CardTitle>
				</CardHeader>
			</Card>
		</div>
	);
}
