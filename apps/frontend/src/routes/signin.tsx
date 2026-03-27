import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { SignInForm } from "@/components/auth/forms/signin-form";
import { CenteredLayout } from "@/components/layout/centered-layout";
import { toast } from "@/components/toast/toast";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/signin")({
	validateSearch: z.object({
		redirect: z.string().optional().catch(""),
		error: z.string().optional(),
	}),
	beforeLoad: async ({ context }) => {
		if (context.authData?.user) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SigninPage,
});

function SigninPage() {
	const search = Route.useSearch();

	// these errors happens after being redirected from backend
	// eg: oauth sign-in/sign-up with an invalid/not verified email by google
	//     token to verify email/reset password expired or not present/invalid
	const errorMessages: Record<string, string> = {
		auth_failed: m.toast_error_auth_failed(),
		email_required: m.toast_error_oauth_email_required({ provider: "Google" }),
		token_expired_or_invalid: m.toast_error_auth_token_expired_or_invalid(),
		no_token: m.toast_error_auth_no_token(),
		default: m.toast_error_auth_signin_default(),
	};

	const message =
		(search.error && errorMessages[search.error]) ?? errorMessages.default;

	if (search.error) {
		toast.error({ title: message });
	}

	return (
		<CenteredLayout>
			<SignInForm />
		</CenteredLayout>
	);
}
