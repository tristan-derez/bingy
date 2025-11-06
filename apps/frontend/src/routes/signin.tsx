import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { SignInForm } from "@/components/auth/forms/signin-form";
import { CenteredLayout } from "@/components/layout/centered-layout";

export const Route = createFileRoute("/signin")({
	validateSearch: z.object({
		redirect: z.string().optional().catch(""),
		error: z.string().optional(),
	}),
	beforeLoad: async ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SigninPage,
});

function SigninPage() {
	const search = Route.useSearch();
	const errorMessages: Record<string, string> = {
		auth_failed: "Authentication failed. Please try again.",
		email_required: "Email is required and must be verified by your provider",
		token_expired_or_invalid: "The reset password link is invalid or expired",
		no_token: "Please request a new password reset email",
		default: "An error occurred during login.",
	};

	const message =
		(search.error && errorMessages[search.error]) ?? errorMessages.default;

	if (search.error) {
		toast.error(message, {
			id: "signin-error",
		});
	}

	return (
		<CenteredLayout>
			<SignInForm />
		</CenteredLayout>
	);
}
