import { useQueryClient } from "@tanstack/react-query";
import {
	createFileRoute,
	redirect,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
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
	token: z.string().optional().catch(""),
	error: z.string().optional().catch(""),
});

export const Route = createFileRoute("/_auth/verify-email")({
	validateSearch: verifyEmailSearchSchema,
	component: VerifyEmailPage,
	beforeLoad: async ({ context, search }) => {
		// Refetch session with disableCookieCache to bypass server's 5-minute cache
		// This ensures we get fresh data after email verification
		const { data: freshSession } = await authClient.getSession({
			query: {
				disableCookieCache: true,
			},
		});

		// Update the query cache with fresh session data
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

		// If token is invalid or expired, redirect with error
		if (search.error === "INVALID_TOKEN" || search.error === "TOKEN_EXPIRED") {
			throw redirect({
				to: "/verify-email",
				search: { error: "token_expired" },
			});
		}
	},
});

export function VerifyEmailPage() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { session } = useRouteContext({ from: "__root__" });
	const { token, error } = Route.useSearch();
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [isVerified, setIsVerified] = useState(false);

	// Verify email on mount if token is present
	useEffect(() => {
		const verifyEmail = async () => {
			if (!token || isVerified) return;

			setIsVerifying(true);
			try {
				const { data, error: verifyError } = await authClient.verifyEmail({
					token,
				});

				if (verifyError) {
					if (
						verifyError.code === "INVALID_TOKEN" ||
						verifyError.code === "TOKEN_EXPIRED"
					) {
						toast.error("Link expired or invalid", {
							id: "verify-email-error",
						});
					} else {
						toast.error(m.toast_error_generic());
					}
					return;
				}

				if (data) {
					setIsVerified(true);
					toast.success("Email verified successfully!");

					// Refetch session with fresh data
					const { data: freshSession } = await authClient.getSession({
						query: {
							disableCookieCache: true,
						},
					});

					if (freshSession) {
						queryClient.setQueryData(
							sessionQueryOptions.queryKey,
							freshSession,
						);
						queryClient.invalidateQueries({
							queryKey: sessionQueryOptions.queryKey,
						});

						// Redirect to welcome page if email is now verified
						if (freshSession.user?.emailVerified) {
							await router.navigate({ to: "/welcome" });
						}
					}
				}
			} catch (err) {
				toast.error(m.toast_error_generic());
			} finally {
				setIsVerifying(false);
			}
		};

		verifyEmail();
	}, [token, isVerified, queryClient, router]);

	const handleResendEmail = async () => {
		if (!session?.user?.email) return;

		setIsResending(true);
		try {
			await authClient.sendVerificationEmail({
				email: session.user.email,
				callbackURL: `${config.appUrl}/verify-email`,
			});
			toast.success(m.toast_success_email_sent_title_welcome_page(), {
				description: m.toast_success_email_sent_desc_welcome_page(),
			});
		} catch (err) {
			toast.error(m.toast_error_email_failed_welcome_page());
		} finally {
			setIsResending(false);
		}
	};

	if (!session?.user) {
		return null;
	}

	// Show success state if verified
	if (isVerified || session.user.emailVerified) {
		return (
			<div className="flex flex-col gap-6">
				<Card className="max-w-lg">
					<CardHeader>
						<CardTitle>Email Verified!</CardTitle>
						<CardDescription>
							Your email has been successfully verified.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => router.navigate({ to: "/welcome" })}
							className="w-full"
						>
							Continue to Welcome
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-bold mt-2">Verify Your Email</h1>
			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle>
						{token ? "Verifying your email..." : "Verification Required"}
					</CardTitle>
					<CardDescription>
						{token
							? "Please wait while we verify your email address."
							: "We've sent a verification email to your address. Please check your inbox and click the link to verify your email."}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error === "token_expired" && (
						<Alert variant="destructive">
							<AlertTitle>Link Expired</AlertTitle>
							<AlertDescription>
								The verification link has expired. Please request a new
								verification email.
							</AlertDescription>
						</Alert>
					)}

					{isVerifying && (
						<div className="text-center py-4">
							<p>Verifying your email...</p>
						</div>
					)}

					{!token && (
						<Alert>
							<AlertTitle>
								{m.welcome_page_verification_required_title()}
							</AlertTitle>
							<AlertDescription>
								<p>{m.welcome_page_verification_required_desc()}</p>
								<p className="mt-2 text-sm text-muted-foreground">
									Email: {session.user.email}
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
					)}
				</CardContent>
			</Card>
		</div>
	);
}
