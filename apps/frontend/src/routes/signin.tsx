import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { SignInForm } from "@/components/signin-form";

export const Route = createFileRoute("/signin")({
	validateSearch: z.object({
		redirect: z.string().optional().catch(""),
		error: z.string().optional(),
	}),
	component: SigninPage,
});

function SigninPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/signin" });

	const errorMessages: Record<string, string> = {
		auth_failed: "Authentication failed. Please try again.",
		email_required: "Email is required and must be verified by your provider",
		default: "An error occurred during login.",
	};

	if (search.error) {
		toast.error(errorMessages[search.error] || errorMessages.default, {
			id: "signin-error",
		});

		void navigate({
			to: "/signin",
			search: () => ({}),
			replace: true,
		});
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<SignInForm />
		</div>
	);
}
