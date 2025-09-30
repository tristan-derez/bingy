import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { ResetPasswordForm } from "@/components/auth/forms/reset-password-form";

const resetPasswordSearchSchema = z.object({
	token: z.string().catch(""),
	error: z.string().optional().catch(""),
});

export const Route = createFileRoute("/reset-password")({
	component: ResetPasswordCallbackPage,
	validateSearch: resetPasswordSearchSchema,
	beforeLoad: ({ search }) => {
		if (search.error === "INVALID_TOKEN") {
			throw redirect({
				to: "/signin",
				search: { error: "token_expired_or_invalid" },
			});
		}

		if (!search.token) {
			toast.error("");
			throw redirect({
				to: "/signin",
				search: { error: "no_token" },
			});
		}
	},
});

function ResetPasswordCallbackPage() {
	const { token } = Route.useSearch();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<ResetPasswordForm token={token} />
		</div>
	);
}
